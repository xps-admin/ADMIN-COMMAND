import fs from 'node:fs';

const requiredFiles = [
  'package.json',
  'next.config.mjs',
  'tsconfig.json',
  'app/layout.tsx',
  'app/page.tsx',
  'app/dashboard/page.tsx',
  'app/[section]/page.tsx',
  'app/api/chat/route.ts',
  'app/api/bridge/route.ts',
  'components/AdminShell.tsx',
  'components/ChatPanel.tsx',
  'lib/supabase/client.ts',
  'lib/supabase/server.ts',
  'public/manifest.webmanifest',
  'public/icon.svg',
  'public/sw.js',
  'supabase/migrations/0001_admin_command_schema.sql',
  'apps-script/AdminCommandDriveBridge.gs',
  'RUNNER_QUEUE/README.md',
  '.env.example',
];

const requiredRouteNames = [
  'dashboard', 'vault', 'systems', 'workflow', 'sandbox', 'quarantine', 'logs', 'rollback',
  'content', 'lead-gen', 'benchmark', 'reverse-engineering', 'capabilities', 'github', 'drive',
  'vercel', 'supabase', 'shopify', 'chat', 'tools', 'templates', 'settings',
];

const failures = [];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) failures.push(`Missing required file: ${file}`);
}

const shell = fs.existsSync('components/AdminShell.tsx') ? fs.readFileSync('components/AdminShell.tsx', 'utf8') : '';
for (const route of requiredRouteNames) {
  if (!shell.includes(route)) failures.push(`Missing route in AdminShell: ${route}`);
}

const migration = fs.existsSync('supabase/migrations/0001_admin_command_schema.sql') ? fs.readFileSync('supabase/migrations/0001_admin_command_schema.sql', 'utf8') : '';
for (const table of ['systems', 'commands', 'runner_jobs', 'audit_logs', 'rollback_snapshots', 'quarantine_items', 'vault_references', 'lead_campaigns', 'benchmark_targets', 'reverse_engineering_runs']) {
  if (!migration.includes(`create table if not exists ${table}`)) failures.push(`Missing table in migration: ${table}`);
}

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (!pkg.scripts?.build?.includes('next build')) failures.push('package.json build script must use next build');
if (!pkg.dependencies?.next) failures.push('Next.js dependency missing');
if (!pkg.dependencies?.['@supabase/supabase-js']) failures.push('Supabase dependency missing');
if (!pkg.dependencies?.ai) failures.push('Vercel AI SDK dependency missing');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Admin Command smoke tests passed.');
