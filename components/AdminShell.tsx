import Link from 'next/link';

const nav = ['dashboard','vault','systems','workflow','sandbox','quarantine','logs','rollback','content','github','drive','supabase','shopify','settings'];
const systems = ['XPS Intelligence','XPS Xpress','Polished Concrete University','XPS Contractor Success','Epoxy Changes Lives','Strategic Minds Advisory','AI in Action'];
const connectors = ['Supabase Postgres','GitHub','Vercel','Google Drive','Google Apps Script','Google Cloud','Shopify','Codex Local'];
const phases = ['Command Intake','Discovery','Sandbox Build','Validation','Operator Gate','Deploy / Sync'];

const copy: Record<string, string[]> = {
  dashboard: ['Dashboard','Command overview','Primary view for systems, connectors, workflow health, and active commands.'],
  vault: ['Vault','Connector registry','Secure reference layer for accounts, OAuth connections, scopes, rotation state, and server-side secret locations.'],
  systems: ['Systems','System registry','All brands, projects, repos, folders, deployments, owners, and revenue paths.'],
  workflow: ['Workflow','Locked operating process','Gated repeatable process that prevents scattered execution and forces completion evidence.'],
  sandbox: ['Sandbox','Safe build zone','Default creation, validation, iteration, optimization, testing, healing, and upgrade area.'],
  quarantine: ['Quarantine','Set-aside zone','All risky or unused files, folders, and records are moved here with reason and rollback reference.'],
  logs: ['Logs','Audit trail','Every command, connector action, system change, sync, and approval event is recorded.'],
  rollback: ['Rollback','Restore references','Before-state snapshots, diffs, restore commands, and recovery notes.'],
  content: ['Content','Creation queue','Draft posts, replies, assets, videos, docs, Shopify pages, and approval-ready content.'],
  github: ['GitHub','Repo operations','Repository registry, issue creation, pull requests, actions, branch state, and code audit.'],
  drive: ['Drive','Apps Script bridge','Admin Command Drive folder structure, registry sheets, audit logs, and quarantine sync.'],
  supabase: ['Supabase','Postgres backend','Schema, RLS, edge functions, realtime channels, automation jobs, and command data.'],
  shopify: ['Shopify','Commerce control','Draft product, collection, page, analytics, and content operations.'],
  settings: ['Settings','Operator controls','Environment, policies, OAuth providers, capability scopes, PWA, and automation defaults.'],
};

function Pill({ children }: { children: React.ReactNode }) { return <span className="pill">{children}</span>; }
function Toggle({ label, on = true }: { label: string; on?: boolean }) { return <div className="toggle-row"><span>{label}</span><b className={on ? 'toggle on' : 'toggle'}>{on ? 'ON' : 'OFF'}</b></div>; }

export default function AdminShell({ page = 'dashboard' }: { page?: string }) {
  const data = copy[page] ?? copy.dashboard;
  return (
    <div className="shell">
      <aside className="sidebar">
        <Link href="/dashboard" className="brand"><span className="brand-mark" /><span><strong>Admin Command</strong><span>Strategic Minds</span></span></Link>
        <nav className="nav">{nav.map((item) => <Link key={item} href={`/${item}`}>{item}<span>›</span></Link>)}</nav>
      </aside>
      <main className="main">
        <header className="topbar"><div><small>Canonical repo</small><div>Strategic-Minds/ADMIN-COMMAND</div></div><div className="button-row" style={{marginTop:0}}><a className="button" href="https://github.com/Strategic-Minds/ADMIN-COMMAND">Repo</a><a className="button primary" href="https://admin-command-seven.vercel.app">Live</a></div></header>
        <div className="mobile-nav">{nav.slice(0,8).map((item) => <Link key={item} href={`/${item}`}>{item}</Link>)}</div>
        <section className="content">
          <div className="hero"><p className="eyebrow">{data[1]}</p><h1>{data[0]}</h1><p>{data[2]}</p><div className="button-row"><Link className="button primary" href="/vault">Open Vault</Link><Link className="button" href="/workflow">Workflow</Link><Link className="button" href="/settings">Settings</Link></div></div>
          <section className="section grid grid-4">
            <div className="card"><div className="card-top"><b>Supabase</b><Pill>Backend</Pill></div><h3>Postgres Standard</h3><p>Systems, commands, logs, workflow runs, rollback refs, and connector state.</p></div>
            <div className="card"><div className="card-top"><b>Vercel</b><Pill>Deploy</Pill></div><h3>Next.js App Router</h3><p>PWA-ready app shell with mobile and desktop command views.</p></div>
            <div className="card"><div className="card-top"><b>Runner</b><Pill>Codex</Pill></div><h3>Approved Sandbox Queue</h3><p>Only approved sandbox jobs run with audit and rollback metadata.</p></div>
            <div className="card"><div className="card-top"><b>Drive</b><Pill>Bridge</Pill></div><h3>Apps Script Sync</h3><p>Folder creation, registry, logs, quarantine, and QA firewall.</p></div>
          </section>
          <section className="section grid grid-2">
            <div className="panel"><p className="kicker">Capability toggles</p><h2>Control bridge</h2><div className="grid" style={{marginTop:16}}><Toggle label="Read capability" /><Toggle label="Write capability" /><Toggle label="Admin configuration" /><Toggle label="Delete capability" on={false} /><Toggle label="Quarantine behavior" /><Toggle label="Audit log required" /><Toggle label="Rollback reference required" /><Toggle label="Sandbox-first execution" /></div></div>
            <div className="panel"><p className="kicker">Workflow lock</p><h2>Standard phases</h2><div className="grid" style={{marginTop:16}}>{phases.map((phase, index) => <div className="toggle-row" key={phase}><span>P0{index+1} — {phase}</span><Pill>LOCK</Pill></div>)}</div></div>
          </section>
          <section className="section panel"><p className="kicker">Connectors</p><h2>Operational accounts</h2><div className="grid grid-4" style={{marginTop:18}}>{connectors.map((item) => <div className="card" key={item}><div className="card-top"><span>{item}</span><Pill>Ref</Pill></div><p>Server-side connector reference. Secrets stay in environment, OAuth, or provider vault.</p><div className="action-strip"><span>Read</span><span>Write</span><span>Admin</span><span>Log</span></div></div>)}</div></section>
          <section className="section panel"><p className="kicker">Systems</p><h2>Tracked systems</h2><table className="table"><thead><tr><th>ID</th><th>System</th><th>Status</th></tr></thead><tbody>{systems.map((system, i) => <tr key={system}><td>SYS-{String(i+1).padStart(3,'0')}</td><td>{system}</td><td><Pill>Tracked</Pill></td></tr>)}</tbody></table></section>
        </section>
      </main>
    </div>
  );
}
