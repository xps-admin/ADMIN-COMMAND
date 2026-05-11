import { createServiceSupabaseClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

type BridgeAction =
  | 'shopify.publish_product'
  | 'shopify.publish_collection'
  | 'drive.delete_request'
  | 'drive.quarantine'
  | 'social.post'
  | 'email.send'
  | 'sms.send'
  | 'github.workflow_dispatch'
  | 'vercel.deploy_hook'
  | 'vercel.workflow_dispatch';

type BridgePayload = {
  action?: BridgeAction;
  approved?: boolean;
  dryRun?: boolean;
  actor?: string;
  systemCode?: string;
  commandText?: string;
  targetRef?: string;
  payload?: Record<string, unknown>;
};

const productionImpactingActions: BridgeAction[] = [
  'shopify.publish_product',
  'shopify.publish_collection',
  'drive.delete_request',
  'social.post',
  'email.send',
  'sms.send',
  'github.workflow_dispatch',
  'vercel.deploy_hook',
  'vercel.workflow_dispatch',
];

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing server env: ${name}`);
  return value;
}

async function logCommand(input: BridgePayload, status: string, result: Record<string, unknown>) {
  try {
    const supabase = createServiceSupabaseClient();
    const { data: system } = input.systemCode
      ? await supabase.from('systems').select('id').eq('code', input.systemCode).maybeSingle()
      : { data: null } as { data: { id: string } | null };

    const { data: command } = await supabase.from('commands').insert({
      system_id: system?.id ?? null,
      actor: input.actor ?? 'gpt-automation-bridge',
      command_type: input.action ?? 'unknown',
      command_text: input.commandText ?? '',
      target_provider: input.action?.split('.')[0] ?? 'admin-command',
      target_ref: input.targetRef ?? null,
      zone: 'production-gated',
      status,
      approval_required: true,
      approved: Boolean(input.approved),
      metadata: input.payload ?? {},
    }).select('*').single();

    await supabase.from('audit_logs').insert({
      command_id: command?.id ?? null,
      system_id: command?.system_id ?? null,
      actor: input.actor ?? 'gpt-automation-bridge',
      action: input.action ?? 'UNKNOWN_ACTION',
      provider: input.action?.split('.')[0] ?? 'admin-command',
      target_ref: input.targetRef ?? null,
      before_state: null,
      after_state: result,
      status,
      notes: 'Logged by GPT Automation Bridge.',
    });
  } catch (error) {
    console.error('Audit logging failed', error);
  }
}

async function shopifyGraphql(query: string, variables: Record<string, unknown>) {
  const shopDomain = requireEnv('SHOPIFY_SHOP_DOMAIN');
  const token = requireEnv('SHOPIFY_ADMIN_TOKEN');
  const response = await fetch(`https://${shopDomain}/admin/api/2026-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });
  return response.json();
}

async function dispatchGithubWorkflow(payload: Record<string, unknown>) {
  const token = requireEnv('GITHUB_TOKEN');
  const owner = String(payload.owner ?? 'Strategic-Minds');
  const repo = String(payload.repo ?? 'ADMIN-COMMAND');
  const workflowId = String(payload.workflowId ?? 'cloud-command-runner.yml');
  const ref = String(payload.ref ?? 'main');
  const inputs = (payload.inputs ?? {}) as Record<string, unknown>;

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ ref, inputs }),
  });

  if (!response.ok) throw new Error(`GitHub workflow dispatch failed: ${response.status} ${await response.text()}`);
  return { dispatched: true, owner, repo, workflowId, ref, inputs };
}

async function callJsonWebhook(url: string, payload: Record<string, unknown>) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Webhook failed: ${response.status} ${text}`);
  return { ok: true, status: response.status, response: text.slice(0, 4000) };
}

async function executeAction(input: BridgePayload) {
  const payload = input.payload ?? {};

  switch (input.action) {
    case 'shopify.publish_product': {
      const id = String(payload.productId ?? input.targetRef ?? '');
      if (!id.startsWith('gid://shopify/Product/')) throw new Error('productId must be a Shopify Product GID.');
      return shopifyGraphql(
        `mutation PublishProduct($input: ProductInput!) { productUpdate(input: $input) { product { id title status } userErrors { field message } } }`,
        { input: { id, status: 'ACTIVE' } },
      );
    }
    case 'shopify.publish_collection': {
      const id = String(payload.collectionId ?? input.targetRef ?? '');
      if (!id.startsWith('gid://shopify/Collection/')) throw new Error('collectionId must be a Shopify Collection GID.');
      return shopifyGraphql(
        `mutation PublishCollection($input: CollectionInput!) { collectionUpdate(input: $input) { collection { id title } userErrors { field message } } }`,
        { input: { id } },
      );
    }
    case 'drive.delete_request':
    case 'drive.quarantine': {
      const url = requireEnv('APPS_SCRIPT_WEB_APP_URL');
      return callJsonWebhook(url, { action: input.action, fileOrFolderId: payload.fileOrFolderId ?? input.targetRef, reason: payload.reason ?? 'Admin Command bridge request', actor: input.actor });
    }
    case 'social.post': {
      const url = requireEnv('SOCIAL_WEBHOOK_URL');
      return callJsonWebhook(url, { ...payload, actor: input.actor, source: 'admin-command' });
    }
    case 'email.send': {
      const url = requireEnv('EMAIL_WEBHOOK_URL');
      return callJsonWebhook(url, { ...payload, actor: input.actor, source: 'admin-command' });
    }
    case 'sms.send': {
      const url = requireEnv('SMS_WEBHOOK_URL');
      return callJsonWebhook(url, { ...payload, actor: input.actor, source: 'admin-command' });
    }
    case 'github.workflow_dispatch':
      return dispatchGithubWorkflow(payload);
    case 'vercel.deploy_hook': {
      const hookUrl = String(payload.deployHookUrl ?? process.env.VERCEL_DEPLOY_HOOK_URL ?? '');
      if (!hookUrl.startsWith('https://')) throw new Error('Missing VERCEL_DEPLOY_HOOK_URL or payload.deployHookUrl.');
      const response = await fetch(hookUrl, { method: 'POST' });
      if (!response.ok) throw new Error(`Vercel deploy hook failed: ${response.status} ${await response.text()}`);
      return { triggered: true, type: 'vercel.deploy_hook' };
    }
    case 'vercel.workflow_dispatch':
      return dispatchGithubWorkflow({ owner: 'Strategic-Minds', repo: 'ADMIN-COMMAND', workflowId: 'cloud-command-runner.yml', ref: 'main', inputs: { mode: 'deploy-production', command_note: input.commandText ?? 'Vercel workflow dispatch' } });
    default:
      throw new Error(`Unsupported action: ${input.action}`);
  }
}

export async function POST(request: Request) {
  const expected = process.env.ORCHESTRATOR_SECRET;
  const auth = request.headers.get('authorization');

  if (!expected || auth !== `Bearer ${expected}`) {
    return Response.json({ error: 'Unauthorized. Missing or invalid ORCHESTRATOR_SECRET bearer token.' }, { status: 401 });
  }

  const input = (await request.json().catch(() => ({}))) as BridgePayload;
  if (!input.action) return Response.json({ error: 'Missing action.' }, { status: 400 });
  if (!productionImpactingActions.includes(input.action)) return Response.json({ error: 'Unsupported or unregistered bridge action.' }, { status: 400 });

  const dryRun = input.dryRun !== false;
  const approved = Boolean(input.approved);

  if (!approved) {
    const result = { queued: true, approval_required: true, dryRun, action: input.action, targetRef: input.targetRef ?? null, payload: input.payload ?? {} };
    await logCommand(input, 'approval_required', result);
    return Response.json(result, { status: 202 });
  }

  if (dryRun) {
    const result = { dryRun: true, approved: true, action: input.action, message: 'Approved dry run only. Set dryRun:false to execute.' };
    await logCommand(input, 'dry_run', result);
    return Response.json(result);
  }

  try {
    const result = await executeAction(input);
    await logCommand(input, 'executed', { result });
    return Response.json({ executed: true, action: input.action, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown bridge failure';
    await logCommand(input, 'failed', { error: message });
    return Response.json({ error: message, action: input.action }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    ok: true,
    service: 'gpt-automation-bridge',
    actions: productionImpactingActions,
    rules: ['Bearer ORCHESTRATOR_SECRET required', 'approval required', 'dryRun default true', 'audit log attempted', 'secrets server-side only'],
  });
}
