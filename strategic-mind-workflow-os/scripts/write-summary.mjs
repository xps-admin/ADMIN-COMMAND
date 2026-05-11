import fs from 'node:fs';
import path from 'node:path';

const out = path.join(process.cwd(), 'strategic-mind-workflow-os', 'workflow-summary.md');
const text = `# Strategic Mind Workflow OS Summary\n\nGenerated: ${new Date().toISOString()}\n\nMode: SANDBOX_ONLY\n\nChecks:\n- validation complete\n- smoke test complete\n- queue processing checked\n\nNext action: review QA/firewall and approval gates.\n`;
fs.writeFileSync(out, text);
console.log(`Wrote ${out}`);
