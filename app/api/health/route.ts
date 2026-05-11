export const runtime = 'nodejs';

export async function GET() {
  return Response.json({
    ok: true,
    service: 'admin-command',
    repo: 'Strategic-Minds/ADMIN-COMMAND',
    target: 'admin-command-seven.vercel.app',
    timestamp: new Date().toISOString(),
  });
}
