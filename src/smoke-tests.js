const adminRepoUrl = 'https://github.com/xps-admin/ADMIN-COMMAND';
const adminProjectUrl = 'https://github.com/users/xps-admin/projects/3';
const adminDriveUrl = 'https://drive.google.com/drive/folders/1cbmLCXKmpwOCDn2ba-y1BDF7N4hTUipD?usp=drive_link';

const systems = [
  'XPS Intelligence',
  'XPS Xpress',
  'Polished Concrete University',
  'XPS Contractor Success',
  'Epoxy Changes Lives',
  'Strategic Minds Advisory',
  'AI in Action',
];

const tests = [
  ['repo points to Admin Command', adminRepoUrl.includes('xps-admin/ADMIN-COMMAND')],
  ['project points to GitHub Projects 3', adminProjectUrl.endsWith('/projects/3')],
  ['drive folder ID is configured', adminDriveUrl.includes('1cbmLCXKmpwOCDn2ba-y1BDF7N4hTUipD')],
  ['tracks seven systems', systems.length === 7],
  ['includes XPS Intelligence', systems.includes('XPS Intelligence')],
];

const failed = tests.filter(([, pass]) => !pass);
for (const [name, pass] of tests) {
  console.log(`${pass ? 'PASS' : 'FAIL'} ${name}`);
}

if (failed.length) {
  process.exitCode = 1;
}
