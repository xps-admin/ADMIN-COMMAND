export const dynamic = 'force-dynamic';

const repos = [
  { key: 'adminCommand', owner: 'Strategic-Minds', repo: 'ADMIN-COMMAND', pr: 1 },
  { key: 'templateRepo', owner: 'Strategic-Minds', repo: 'shopify-workflow-benchmark-and-refactor-template', pr: 2 }
];

async function readPullRequest(item: typeof repos[number]) {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const url = `https://api.github.com/repos/${item.owner}/${item.repo}/pulls/${item.pr}`;
  const response = await fetch(url, { headers, cache: 'no-store' });
  if (!response.ok) {
    return { key: item.key, repo: `${item.owner}/${item.repo}`, pr: item.pr, status: 'Could not verify', error: response.status };
  }
  const data = await response.json();
  return {
    key: item.key,
    repo: `${item.owner}/${item.repo}`,
    pr: item.pr,
    state: data.state,
    draft: data.draft,
    merged: data.merged,
    mergeable: data.mergeable,
    headSha: data.head?.sha,
    updatedAt: data.updated_at
  };
}

export async function GET() {
  const results = await Promise.all(repos.map(readPullRequest));
  return Response.json({
    system: 'Strategic Mind Workflow OS',
    mode: 'SANDBOX_ONLY',
    checkedAt: new Date().toISOString(),
    results,
    blockedActions: ['production_deploy', 'shopify_live_publish', 'main_merge', 'secret_write', 'email_send', 'social_post', 'paid_action']
  });
}
