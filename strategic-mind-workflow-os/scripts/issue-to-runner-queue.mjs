import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, 'strategic-mind-workflow-os', 'runner_queue', 'pending');
fs.mkdirSync(outDir, { recursive: true });

const issueNumber = process.env.GITHUB_ISSUE_NUMBER || 'manual';
const issueTitle = process.env.GITHUB_ISSUE_TITLE || 'Manual Strategic Mind Workflow OS work order';
const issueBody = process.env.GITHUB_ISSUE_BODY || '';
const requestedType = process.env.WORK_ORDER_TYPE || 'qa-firewall-task';

const allowedTypes = new Set([
  'source-inventory',
  'benchmark-pass',
  'reverse-engineer-pass',
  'refactor-pass',
  'shopify-draft-build-packet',
  'content-media-task',
  'lead-crm-task',
  'qa-firewall-task'
]);

if (!allowedTypes.has(requestedType)) {
  throw new Error(`Unsupported work order type: ${requestedType}`);
}

const workOrder = {
  id: `github-issue-${issueNumber}-${Date.now()}`,
  type: requestedType,
  mode: 'SANDBOX_ONLY',
  system_name: 'Strategic Mind Workflow OS',
  source: `GitHub issue ${issueNumber}`,
  title: issueTitle,
  body: issueBody,
  required_output: ['summary', 'status', 'blocked_actions', 'next_action'],
  blocked_actions: ['production_deploy', 'shopify_live_publish', 'main_merge', 'secret_write', 'email_send', 'social_post', 'paid_action']
};

const filePath = path.join(outDir, `${workOrder.id}.json`);
fs.writeFileSync(filePath, JSON.stringify(workOrder, null, 2));
console.log(`Created runner queue item: ${filePath}`);
