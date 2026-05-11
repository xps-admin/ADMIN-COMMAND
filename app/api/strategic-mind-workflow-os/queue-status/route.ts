export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({
    system: 'Strategic Mind Workflow OS',
    mode: 'SANDBOX_ONLY',
    checkedAt: new Date().toISOString(),
    queueTemplates: 8,
    workOrderTypes: [
      'source-inventory',
      'benchmark-pass',
      'reverse-engineer-pass',
      'refactor-pass',
      'shopify-draft-build-packet',
      'content-media-task',
      'lead-crm-task',
      'qa-firewall-task'
    ],
    queueStatus: 'artifact-backed queue pending storage connection'
  });
}
