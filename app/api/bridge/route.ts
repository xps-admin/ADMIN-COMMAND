import { createServiceSupabaseClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

type BridgeRequest = {
  command_type?: string;
  command_text?: string;
  target_provider?: string;
  target_ref?: string;
  zone?: string;
  system_code?: string;
  metadata?: Record<string, unknown>;
};

export async function POST(request: Request) {
  const auth = request.headers.get('authorization');
  const expected = process.env.ORCHESTRATOR_SECRET;

  if (!expected || auth !== `Bearer ${expected}`) {
    return Response.json({ error: 'Unauthorized bridge request.' }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as BridgeRequest;
  const zone = body.zone ?? 'sandbox';
  const productionImpacting = zone === 'production' || ['publish', 'deploy', 'send', 'admin'].includes(body.command_type ?? '');

  const supabase = createServiceSupabaseClient();
  const { data: system } = body.system_code
    ? await supabase.from('systems').select('id').eq('code', body.system_code).maybeSingle()
    : { data: null } as { data: { id: string } | null };

  const { data: command, error } = await supabase.from('commands').insert({
    system_id: system?.id ?? null,
    actor: 'admin-command-bridge',
    command_type: body.command_type ?? 'general',
    command_text: body.command_text ?? '',
    target_provider: body.target_provider ?? null,
    target_ref: body.target_ref ?? null,
    zone,
    approval_required: productionImpacting,
    approved: !productionImpacting,
    metadata: body.metadata ?? {},
  }).select('*').single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  await supabase.from('audit_logs').insert({
    command_id: command.id,
    system_id: command.system_id,
    actor: 'admin-command-bridge',
    action: 'COMMAND_CREATED',
    provider: body.target_provider ?? 'admin-command',
    target_ref: body.target_ref ?? null,
    status: 'logged',
    notes: productionImpacting ? 'Approval required before production-impacting action.' : 'Sandbox command accepted.',
  });

  await supabase.from('command_queue').insert({
    command_id: command.id,
    queue_name: productionImpacting ? 'pending_approval' : 'pending',
    priority: productionImpacting ? 10 : 50,
  });

  return Response.json({ command, queued: true, approval_required: productionImpacting });
}
