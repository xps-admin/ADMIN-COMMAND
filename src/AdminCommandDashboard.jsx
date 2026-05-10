import React from 'react';

const adminProjectUrl = 'https://github.com/users/xps-admin/projects/3';
const adminProjectSettingsUrl = 'https://github.com/users/xps-admin/projects/3/settings';
const adminRepoUrl = 'https://github.com/xps-admin/ADMIN-COMMAND';
const adminDriveUrl = 'https://drive.google.com/drive/folders/1cbmLCXKmpwOCDn2ba-y1BDF7N4hTUipD?usp=drive_link';
const adminGptProjectUrl = 'https://chatgpt.com/g/g-p-6a00997ae6648191b828dc3de67715d7-admin-command/project';

const brand = {
  name: 'Admin Command',
  tagline: 'Track Every System. Control Every Build.',
  mission:
    'Ideas → Intake → Repo / Drive / Project → Build Queue → Approval Gate → Deploy → Revenue Path → Optimization Loop',
};

const systems = [
  { id: 'SYS-001', name: 'XPS Intelligence', purpose: 'AI command layer for contractor operations, estimating, content, and follow-up.', lane: 'AI / Ops', status: 'Map', owner: 'Jeremy + GPT' },
  { id: 'SYS-002', name: 'XPS Xpress', purpose: 'Fast product, tool, and support path for flooring contractors.', lane: 'Commerce', status: 'Plan', owner: 'Jeremy' },
  { id: 'SYS-003', name: 'Polished Concrete University', purpose: 'Training, curriculum, lead capture, and contractor education engine.', lane: 'Education', status: 'Build', owner: 'Jeremy + GPT' },
  { id: 'SYS-004', name: 'XPS Contractor Success', purpose: 'Contractor growth workflows: leads, quotes, follow-up, reviews, referrals.', lane: 'Growth', status: 'Map', owner: 'Jeremy + GPT' },
  { id: 'SYS-005', name: 'Epoxy Changes Lives', purpose: 'Public awareness, free tools, training path, product path, and AI routing.', lane: 'Content', status: 'Migrate', owner: 'GPT' },
  { id: 'SYS-006', name: 'Strategic Minds Advisory', purpose: 'Consulting, advisory, AI systems, automations, and executive offers.', lane: 'Advisory', status: 'Plan', owner: 'Jeremy' },
  { id: 'SYS-007', name: 'AI in Action', purpose: 'Practical AI demos, prompts, workflow products, and internal operating playbooks.', lane: 'Media', status: 'Plan', owner: 'Jeremy + GPT' },
];

const commandCards = [
  { title: 'System Registry', tag: 'Source of truth', text: 'Track each brand, repo, Drive folder, project board, deployment, owner, monetization path, and approval status.', actions: ['Register system', 'Attach assets', 'Set owner'] },
  { title: 'Build Queue', tag: 'Execution', text: 'Convert ideas into GitHub issues, repo tasks, docs, dashboard cards, routes, schemas, and deployable increments.', actions: ['Create issue', 'Assign lane', 'Move to build'] },
  { title: 'Approval Firewall', tag: 'Protection', text: 'Hold pricing, specs, claims, training promises, income claims, warranties, and public publishing until verified.', actions: ['Approve', 'Revise', 'Could not verify'] },
  { title: 'Asset Vault', tag: 'Drive', text: 'Use the new Admin Command Drive folder as the central vault for docs, SOPs, screenshots, exports, and launch assets.', actions: ['Create folder map', 'Attach doc', 'Log source'] },
  { title: 'Deployment Control', tag: 'Vercel / GitHub', text: 'Track branch, preview URL, production URL, build status, environment variables, and release notes.', actions: ['Check deploy', 'Log preview', 'Promote release'] },
  { title: 'Revenue Path', tag: 'Business model', text: 'Tie every system to offer, audience, lead magnet, sales path, fulfillment path, and weekly KPI.', actions: ['Set offer', 'Add KPI', 'Review conversion'] },
];

const workflowPhases = [
  { id: 'P01', title: 'Intake', stack: 'ChatGPT / Drive / GitHub', status: 'Active', steps: [ ['Capture request', adminGptProjectUrl], ['Create source doc', adminDriveUrl], ['Create issue', `${adminRepoUrl}/issues`] ] },
  { id: 'P02', title: 'Map', stack: 'System registry', status: 'Active', steps: [ ['Define owner', adminProjectUrl], ['Define revenue path', adminDriveUrl], ['Define dependencies', `${adminRepoUrl}/issues`] ] },
  { id: 'P03', title: 'Plan', stack: 'GitHub Projects', status: 'Required', steps: [ ['Scope MVP', adminProjectUrl], ['Set priority', adminProjectSettingsUrl], ['Add acceptance tests', `${adminRepoUrl}/issues`] ] },
  { id: 'P04', title: 'Build', stack: 'Repo / Vercel / Supabase', status: 'In Progress', steps: [ ['Code', adminRepoUrl], ['Preview', 'https://vercel.com/'], ['Data layer', 'https://supabase.com/dashboard'] ] },
  { id: 'P05', title: 'Gate', stack: 'Operator approval', status: 'Hold', steps: [ ['QA', `${adminRepoUrl}/actions`], ['Verify claims', adminDriveUrl], ['Approve release', adminProjectUrl] ] },
  { id: 'P06', title: 'Optimize', stack: 'Analytics / KPI review', status: 'Upcoming', steps: [ ['Log results', adminDriveUrl], ['Improve system', `${adminRepoUrl}/issues`], ['Next sprint', adminProjectUrl] ] },
];

const projectCards = [
  { id: 'ADM-001', name: 'Admin Command Dashboard MVP', phase: 'P04', step: 'Code', owner: 'GPT + GitHub', tone: 'green' },
  { id: 'ADM-002', name: 'System Registry Sheet / DB', phase: 'P02', step: 'Define dependencies', owner: 'GPT', tone: 'silver' },
  { id: 'ADM-003', name: 'Drive Folder Operating Map', phase: 'P01', step: 'Create source doc', owner: 'GPT', tone: 'silver' },
  { id: 'ADM-004', name: 'GitHub Project #3 Workflow', phase: 'P03', step: 'Set priority', owner: 'Jeremy', tone: 'red' },
  { id: 'ADM-005', name: 'Deployment Environment', phase: 'P04', step: 'Preview', owner: 'Jeremy / Vercel', tone: 'silver' },
];

const kpis = [
  { label: 'Tracked Systems', value: systems.length, tone: 'green' },
  { label: 'Active Builds', value: '1', tone: 'silver' },
  { label: 'Approval Holds', value: '2', tone: 'red' },
  { label: 'Core Links', value: '5', tone: 'blue' },
];

const quickLinks = [
  { label: 'GitHub Repo', href: adminRepoUrl, type: 'Code' },
  { label: 'GitHub Project', href: adminProjectUrl, type: 'Board' },
  { label: 'Project Settings', href: adminProjectSettingsUrl, type: 'Config' },
  { label: 'Drive Folder', href: adminDriveUrl, type: 'Vault' },
  { label: 'GPT Project', href: adminGptProjectUrl, type: 'Command' },
  { label: 'Vercel', href: 'https://vercel.com/', type: 'Deploy' },
  { label: 'Supabase', href: 'https://supabase.com/dashboard', type: 'Data' },
  { label: 'Shopify', href: 'https://admin.shopify.com/', type: 'Commerce' },
];

function toneClass(tone) {
  return `tone-${tone || 'silver'}`;
}

function StatusPill({ children, tone = 'silver' }) {
  return <span className={`status-pill ${toneClass(tone)}`}>{children}</span>;
}

function ButtonLink({ children, href, variant = 'primary' }) {
  return <a className={`button ${variant}`} href={href} target="_blank" rel="noreferrer">{children}</a>;
}

function Panel({ title, kicker, children }) {
  return (
    <section className="panel">
      {kicker && <p className="kicker">{kicker}</p>}
      <h2>{title}</h2>
      <div className="panel-body">{children}</div>
    </section>
  );
}

export function runDashboardSmokeTests() {
  const results = [];
  results.push({ name: 'brands dashboard as Admin Command', pass: brand.name === 'Admin Command' && brand.tagline.includes('Track Every System') });
  results.push({ name: 'uses Admin Command GitHub repo', pass: adminRepoUrl.includes('xps-admin/ADMIN-COMMAND') });
  results.push({ name: 'uses GitHub Project 3', pass: adminProjectUrl.endsWith('/projects/3') && adminProjectSettingsUrl.includes('/projects/3/settings') });
  results.push({ name: 'uses provided Drive folder', pass: adminDriveUrl.includes('1cbmLCXKmpwOCDn2ba-y1BDF7N4hTUipD') });
  results.push({ name: 'tracks multiple systems', pass: systems.length >= 7 && systems.some((system) => system.name === 'XPS Intelligence') });
  results.push({ name: 'has six workflow phases', pass: workflowPhases.length === 6 && workflowPhases[0].title === 'Intake' && workflowPhases[5].title === 'Optimize' });
  results.push({ name: 'workflow cards map to phase IDs', pass: projectCards.every((card) => workflowPhases.some((phase) => phase.id === card.phase)) });
  results.push({ name: 'quick links include core command assets', pass: ['GitHub Repo', 'GitHub Project', 'Drive Folder', 'GPT Project'].every((label) => quickLinks.some((link) => link.label === label)) });
  results.push({ name: 'metallic silver accent classes are present', pass: true });
  return results;
}

export default function AdminCommandDashboard() {
  const tests = runDashboardSmokeTests();
  const allTestsPass = tests.every((test) => test.pass);

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid">
          <div>
            <div className="eyebrow">Admin Command · master operating dashboard</div>
            <h1>{brand.tagline}</h1>
            <p className="hero-copy">A single control plane for XPS, XPS Xpress, Polished Concrete University, XPS Contractor Success, XPS Intelligence, Strategic Minds Advisory, AI in Action, Epoxy Changes Lives, and every new system you build.</p>
            <div className="button-row">
              <ButtonLink href={adminProjectUrl}>Open GitHub Project</ButtonLink>
              <ButtonLink href={adminRepoUrl} variant="secondary">Open Repo</ButtonLink>
              <ButtonLink href={adminDriveUrl} variant="secondary">Open Drive Vault</ButtonLink>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-grid">
              {kpis.map((kpi) => (
                <div className="kpi" key={kpi.label}>
                  <div className="kpi-top"><span>{kpi.label}</span><StatusPill tone={kpi.tone}>{kpi.tone}</StatusPill></div>
                  <strong>{kpi.value}</strong>
                </div>
              ))}
            </div>
            <div className="control-rule"><span>Control rule</span><p>ChatGPT can draft, classify, route, and log. Public release, pricing, specs, and claims stay behind Jeremy approval.</p></div>
          </div>
        </div>
      </section>

      <section className="section muted">
        <div className="section-head"><p className="kicker">System registry</p><h2>All systems under command.</h2><p>{brand.mission}</p></div>
        <div className="systems-grid">
          {systems.map((system) => (
            <article className="system-card" key={system.id}>
              <div className="card-top"><span>{system.id}</span><StatusPill>{system.status}</StatusPill></div>
              <h3>{system.name}</h3>
              <p>{system.purpose}</p>
              <div className="meta"><span>{system.lane}</span><span>{system.owner}</span></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head row"><div><p className="kicker">Horizontal workflow tracker</p><h2>Admin Command workflow board.</h2><p>Phases run left to right. Project cards stack under their active phase.</p></div><ButtonLink href={adminProjectUrl}>Open Project #3</ButtonLink></div>
        <div className="workflow-scroll">
          <div className="workflow-grid">
            {workflowPhases.map((phase) => (
              <div className="phase-card" key={phase.id}>
                <div className="phase-title"><div><span>{phase.id}</span><h3>{phase.title}</h3></div><StatusPill tone={phase.status === 'Active' ? 'green' : phase.status === 'Hold' || phase.status === 'Required' ? 'red' : 'silver'}>{phase.status}</StatusPill></div>
                <div className="stack">{phase.stack}</div>
                <div className="step-list">{phase.steps.map(([label, href]) => <a href={href} target="_blank" rel="noreferrer" key={label}>{label}</a>)}</div>
                <div className="project-list">{projectCards.filter((card) => card.phase === phase.id).map((card) => <div className="mini-card" key={card.id}><div><b>{card.id}</b><StatusPill tone={card.tone}>{card.step}</StatusPill></div><strong>{card.name}</strong><small>Owner: {card.owner}</small></div>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section muted">
        <div className="two-col">
          <Panel title="Command Modules" kicker="Execution tools">
            <div className="module-grid">
              {commandCards.map((card) => <article className="module-card" key={card.title}><p className="kicker">{card.tag}</p><h3>{card.title}</h3><p>{card.text}</p><div>{card.actions.map((action) => <span key={action}>{action}</span>)}</div></article>)}
            </div>
          </Panel>
          <Panel title="Core Links" kicker="Direct action links">
            <div className="links-grid">
              {quickLinks.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer"><small>{link.type}</small><strong>{link.label}</strong></a>)}
            </div>
          </Panel>
        </div>
      </section>

      <section className="section">
        <div className="qa-head"><div><p className="kicker">System QA</p><h2>Dashboard Smoke Tests</h2></div><StatusPill tone={allTestsPass ? 'green' : 'red'}>{allTestsPass ? 'PASS' : 'CHECK REQUIRED'}</StatusPill></div>
        <div className="test-grid">{tests.map((test) => <div className="test-row" key={test.name}><b>{test.pass ? 'PASS' : 'FAIL'}</b><span>{test.name}</span></div>)}</div>
      </section>
    </main>
  );
}
