import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'app/strategic-mind-workflow-os/page.tsx',
  'strategic-mind-workflow-os/scripts/issue-to-runner-queue.mjs',
  'strategic-mind-workflow-os/scripts/write-summary.mjs',
  'strategic-mind-workflow-os/work-order-templates/source-inventory.json',
  'strategic-mind-workflow-os/work-order-templates/benchmark-pass.json',
  'strategic-mind-workflow-os/work-order-templates/reverse-engineer-pass.json',
  'strategic-mind-workflow-os/work-order-templates/refactor-pass.json',
  'strategic-mind-workflow-os/work-order-templates/shopify-draft-build-packet.json',
  'strategic-mind-workflow-os/work-order-templates/content-media-task.json',
  'strategic-mind-workflow-os/work-order-templates/lead-crm-task.json',
  'strategic-mind-workflow-os/work-order-templates/qa-firewall-task.json'
];

for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) {
    throw new Error(`Missing required file: ${rel}`);
  }
}

const templateDir = path.join(root, 'strategic-mind-workflow-os', 'work-order-templates');
for (const file of fs.readdirSync(templateDir).filter((name) => name.endsWith('.json'))) {
  const full = path.join(templateDir, file);
  const parsed = JSON.parse(fs.readFileSync(full, 'utf8'));
  if (parsed.system_name !== 'Strategic Mind Workflow OS') throw new Error(`${file} has invalid system_name`);
  if (parsed.mode !== 'SANDBOX_ONLY') throw new Error(`${file} is not sandbox-only`);
  const blocked = parsed.blocked_actions || [];
  for (const action of ['production_deploy','shopify_live_publish','main_merge','secret_write','email_send','social_post','paid_action']) {
    if (!blocked.includes(action) && !(file === 'content-media-task.json' && action === 'shopify_live_publish')) {
      throw new Error(`${file} missing blocked action: ${action}`);
    }
  }
}

console.log('Strategic Mind Workflow OS Admin Command smoke tests passed.');
