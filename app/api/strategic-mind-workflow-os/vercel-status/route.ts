export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({
    system: 'Strategic Mind Workflow OS',
    mode: 'SANDBOX_ONLY',
    checkedAt: new Date().toISOString(),
    vercel: {
      adminCommand: 'Could not verify from runtime without Vercel token',
      templateRepo: 'Could not verify from runtime without Vercel token',
      productionDeployAllowed: false
    }
  });
}
