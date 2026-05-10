/**
 * Admin Command Drive Bridge
 * Purpose: create and sync the Admin Command folder structure for each system.
 * Safety model: no permanent delete. Removal intent moves files/folders into Quarantine with audit log.
 * Install: paste into Apps Script, set ROOT_FOLDER_ID, run setupAdminCommandBridge(), authorize.
 */

const CONFIG = {
  ROOT_FOLDER_ID: '1cbmLCXKmpwOCDn2ba-y1BDF7N4hTUipD',
  ROOT_NAME: 'ADMIN COMMAND',
  TIMEZONE: 'America/New_York',
  DELETE_MODE: 'QUARANTINE_ONLY',
  SYSTEMS: [
    'XPS Intelligence',
    'XPS Xpress',
    'Polished Concrete University',
    'XPS Contractor Success',
    'Epoxy Changes Lives',
    'Strategic Minds Advisory',
    'AI in Action'
  ],
  STANDARD_FOLDERS: [
    '00_ADMIN',
    '01_INTAKE',
    '02_SOURCE_LEDGER',
    '03_SANDBOX',
    '04_ASSETS',
    '05_DOCS',
    '06_SHEETS',
    '07_PROMPTS',
    '08_AUTOMATIONS',
    '09_CODEX_LOCAL',
    '10_GITHUB',
    '11_VERCEL',
    '12_SUPABASE',
    '13_SHOPIFY',
    '14_CONTENT_QUEUE',
    '15_QA_FIREWALL',
    '16_APPROVALS',
    '17_RELEASES',
    '18_ANALYTICS',
    '19_ROLLBACK',
    '20_QUARANTINE'
  ]
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Admin Command')
    .addItem('Setup Bridge', 'setupAdminCommandBridge')
    .addItem('Sync Folder Structure', 'syncAllSystems')
    .addItem('Create Audit Sheet', 'createAuditSheet')
    .addItem('Create System Registry', 'createSystemRegistry')
    .addItem('Run QA Firewall', 'runQaFirewall')
    .addToUi();
}

function setupAdminCommandBridge() {
  const root = getRootFolder_();
  const auditSheet = createAuditSheet();
  createSystemRegistry();
  ensureFolder_(root, '00_ADMIN_COMMAND_INDEX');
  ensureFolder_(root, '01_SYSTEMS');
  ensureFolder_(root, '02_GLOBAL_SANDBOX');
  ensureFolder_(root, '03_GLOBAL_QUARANTINE');
  ensureFolder_(root, '04_GLOBAL_ROLLBACK');
  ensureFolder_(root, '05_GLOBAL_LOGS');
  ensureFolder_(root, '06_GLOBAL_TEMPLATES');
  ensureFolder_(root, '07_GLOBAL_ASSETS');
  ensureFolder_(root, '08_GLOBAL_EXPORTS');
  syncAllSystems();
  logAction_('SETUP', 'Bridge initialized', root.getId(), root.getUrl(), 'PASS');
  return auditSheet.getParent().getUrl();
}

function syncAllSystems() {
  const root = getRootFolder_();
  const systemsRoot = ensureFolder_(root, '01_SYSTEMS');
  CONFIG.SYSTEMS.forEach(systemName => createSystemFolders_(systemsRoot, systemName));
  logAction_('SYNC_ALL_SYSTEMS', 'Standard system folder structure synced', systemsRoot.getId(), systemsRoot.getUrl(), 'PASS');
}

function createSystemFolders_(systemsRoot, systemName) {
  const slug = slugify_(systemName);
  const systemRoot = ensureFolder_(systemsRoot, slug + ' — ' + systemName);
  CONFIG.STANDARD_FOLDERS.forEach(folderName => ensureFolder_(systemRoot, folderName));
  const indexDoc = ensureIndexDoc_(systemRoot, systemName);
  upsertRegistryRow_(systemName, systemRoot.getId(), systemRoot.getUrl(), indexDoc.getUrl());
  logAction_('CREATE_OR_SYNC_SYSTEM', systemName, systemRoot.getId(), systemRoot.getUrl(), 'PASS');
}

function ensureIndexDoc_(systemRoot, systemName) {
  const fileName = 'ADMIN COMMAND INDEX — ' + systemName;
  const files = systemRoot.getFilesByName(fileName);
  if (files.hasNext()) return files.next();
  const doc = DocumentApp.create(fileName);
  const body = doc.getBody();
  body.appendParagraph(fileName).setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph('Purpose: source of truth index for this system.');
  body.appendParagraph('Workflow: Intake → Source Ledger → Sandbox → Build → QA → Approval → Release → Analytics → Optimization.');
  body.appendParagraph('Rule: no permanent delete; move unused or risky assets to Quarantine.');
  doc.saveAndClose();
  const file = DriveApp.getFileById(doc.getId());
  systemRoot.addFile(file);
  DriveApp.getRootFolder().removeFile(file);
  return file;
}

function createAuditSheet() {
  const root = getRootFolder_();
  const logsFolder = ensureFolder_(root, '05_GLOBAL_LOGS');
  const fileName = 'ADMIN_COMMAND_AUDIT_LOG';
  const existing = logsFolder.getFilesByName(fileName);
  if (existing.hasNext()) return SpreadsheetApp.open(existing.next());
  const ss = SpreadsheetApp.create(fileName);
  const sheet = ss.getActiveSheet();
  sheet.setName('Audit Log');
  sheet.appendRow(['Timestamp', 'Actor', 'Action', 'Target', 'FileOrFolderId', 'Url', 'Status', 'RollbackRef', 'Notes']);
  sheet.setFrozenRows(1);
  const file = DriveApp.getFileById(ss.getId());
  logsFolder.addFile(file);
  DriveApp.getRootFolder().removeFile(file);
  return ss;
}

function createSystemRegistry() {
  const root = getRootFolder_();
  const adminFolder = ensureFolder_(root, '00_ADMIN_COMMAND_INDEX');
  const fileName = 'ADMIN_COMMAND_SYSTEM_REGISTRY';
  const existing = adminFolder.getFilesByName(fileName);
  if (existing.hasNext()) return SpreadsheetApp.open(existing.next());
  const ss = SpreadsheetApp.create(fileName);
  const sheet = ss.getActiveSheet();
  sheet.setName('Systems');
  sheet.appendRow(['System', 'FolderId', 'FolderUrl', 'IndexDocUrl', 'Status', 'Owner', 'LastSynced', 'Notes']);
  sheet.setFrozenRows(1);
  const file = DriveApp.getFileById(ss.getId());
  adminFolder.addFile(file);
  DriveApp.getRootFolder().removeFile(file);
  return ss;
}

function upsertRegistryRow_(systemName, folderId, folderUrl, indexDocUrl) {
  const registry = createSystemRegistry();
  const sheet = registry.getSheetByName('Systems');
  const data = sheet.getDataRange().getValues();
  const now = new Date();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === systemName) {
      sheet.getRange(i + 1, 2, 1, 6).setValues([[folderId, folderUrl, indexDocUrl, 'Active', 'Jeremy + GPT', now]]);
      return;
    }
  }
  sheet.appendRow([systemName, folderId, folderUrl, indexDocUrl, 'Active', 'Jeremy + GPT', now, 'Auto-generated by Admin Command Drive Bridge']);
}

function moveToQuarantine(fileOrFolderId, reason) {
  if (!reason) throw new Error('Quarantine reason is required.');
  const root = getRootFolder_();
  const quarantine = ensureFolder_(root, '03_GLOBAL_QUARANTINE');
  const item = DriveApp.getFileById(fileOrFolderId);
  const originalName = item.getName();
  const timestamp = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyyMMdd-HHmmss');
  item.setName('[QUARANTINE ' + timestamp + '] ' + originalName);
  quarantine.addFile(item);
  logAction_('MOVE_TO_QUARANTINE', reason, fileOrFolderId, item.getUrl(), 'PASS');
  return item.getUrl();
}

function requestDelete(fileOrFolderId, reason) {
  // Intentionally no permanent delete. This keeps rollback possible.
  return moveToQuarantine(fileOrFolderId, 'DELETE_REQUEST_REDIRECTED_TO_QUARANTINE: ' + reason);
}

function runQaFirewall() {
  const registry = createSystemRegistry().getSheetByName('Systems');
  const rows = registry.getDataRange().getValues();
  const failures = [];
  for (let i = 1; i < rows.length; i++) {
    const [system, folderId, folderUrl, indexDocUrl] = rows[i];
    if (!system || !folderId || !folderUrl || !indexDocUrl) failures.push(system || 'UNKNOWN_ROW_' + (i + 1));
  }
  const status = failures.length ? 'FAIL' : 'PASS';
  logAction_('QA_FIREWALL', 'Registry completeness check', '', '', status, failures.join(', '));
  return { status, failures };
}

function mirrorStructureFromFolder(sourceFolderId, targetFolderId) {
  // Mirrors folders by name only. Does not delete target items; missing source folders can be moved manually to quarantine.
  const source = DriveApp.getFolderById(sourceFolderId);
  const target = DriveApp.getFolderById(targetFolderId);
  mirrorFoldersOnly_(source, target);
  logAction_('MIRROR_STRUCTURE', source.getName() + ' → ' + target.getName(), target.getId(), target.getUrl(), 'PASS');
}

function mirrorFoldersOnly_(source, target) {
  const folders = source.getFolders();
  while (folders.hasNext()) {
    const sourceChild = folders.next();
    const targetChild = ensureFolder_(target, sourceChild.getName());
    mirrorFoldersOnly_(sourceChild, targetChild);
  }
}

function getRootFolder_() {
  return DriveApp.getFolderById(CONFIG.ROOT_FOLDER_ID);
}

function ensureFolder_(parent, name) {
  const folders = parent.getFoldersByName(name);
  if (folders.hasNext()) return folders.next();
  const folder = parent.createFolder(name);
  logAction_('CREATE_FOLDER', name, folder.getId(), folder.getUrl(), 'PASS');
  return folder;
}

function logAction_(action, target, id, url, status, notes) {
  const ss = createAuditSheet();
  const sheet = ss.getSheetByName('Audit Log');
  sheet.appendRow([new Date(), Session.getActiveUser().getEmail(), action, target, id, url, status, '', notes || '']);
}

function slugify_(value) {
  return value.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}
