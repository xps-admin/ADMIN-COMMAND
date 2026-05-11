const phases = ['Source Inventory','Benchmark','Reverse Engineer','Refactor','Build Packet','Shopify Draft Build','Frontend/Backend Build','Media + Lead Engine','QA Firewall','Approval','Launch','Optimization','Template Extraction','Recursive Rebuild'];
const workOrders = ['source-inventory','benchmark-pass','reverse-engineer-pass','refactor-pass','shopify-draft-build-packet','content-media-task','lead-crm-task','qa-firewall-task'];
const statusCards = [
  ['ADMIN-COMMAND PR #1','Draft / unmerged / review required'],
  ['Template PR #2','Draft / unmerged / recursive runner scaffold'],
  ['Queue templates', `${workOrders.length} sandbox work-order templates`],
  ['Blocked actions','Deploy, Shopify live publish, main merge, secrets, send, post, paid'],
  ['Vercel status','Could not verify from dashboard runtime yet']
];
const apiCards = [
  ['GitHub status API','/api/strategic-mind-workflow-os/github-status','Reads ADMIN-COMMAND PR #1 and template PR #2 status.'],
  ['Queue status API','/api/strategic-mind-workflow-os/queue-status','Reports available work-order templates and queue connection status.'],
  ['Vercel status API','/api/strategic-mind-workflow-os/vercel-status','Safe placeholder until Vercel token is added outside code.']
];

export default function StrategicMindWorkflowOSPage() {
  return (
    <main className="content">
      <section className="hero">
        <p className="eyebrow">Strategic Mind Workflow OS · Admin Command</p>
        <h1>AutoBuilder Control Dashboard</h1>
        <p>Operational dashboard for the universal template repo, GitHub issue queue, runner queue, Google Sheet queue sync, Apps Script bridge, Shopify draft workflow, and recursive QA firewall.</p>
      </section>
      <section className="section grid grid-4">
        <div className="card"><h3>Mode</h3><p>SANDBOX_ONLY. Production deploy, Shopify live publish, main merge, secrets, sending, posting, and paid actions are blocked.</p></div>
        <div className="card"><h3>Template Repo</h3><p>Strategic Mind Workflow OS master template repo remains in draft PR review until approved.</p></div>
        <div className="card"><h3>Admin Command</h3><p>Operator dashboard for issue conversion, queue sync, recursive validation, and workflow summary output.</p></div>
        <div className="card"><h3>Scheduler</h3><p>GitHub Actions and Apps Script coordinate safe recursive checks and queue processing.</p></div>
      </section>
      <section className="section panel">
        <p className="kicker">Review status</p>
        <h2>Operational status cards</h2>
        <div className="grid grid-4" style={{ marginTop: 18 }}>
          {statusCards.map(([title, text]) => <div className="card" key={title}><h3>{title}</h3><p>{text}</p></div>)}
        </div>
      </section>
      <section className="section panel">
        <p className="kicker">Connected APIs</p>
        <h2>Dashboard data endpoints</h2>
        <div className="grid grid-4" style={{ marginTop: 18 }}>
          {apiCards.map(([title, href, text]) => <a className="card" href={href} key={title}><h3>{title}</h3><p>{text}</p><span className="pill">OPEN</span></a>)}
        </div>
      </section>
      <section className="section grid grid-2">
        <div className="panel"><h2>Canonical workflow</h2>{phases.map((phase, index) => <div className="toggle-row" key={phase}><span>{String(index + 1).padStart(2, '0')} — {phase}</span><span className="pill">GATED</span></div>)}</div>
        <div className="panel"><h2>Work-order templates</h2>{workOrders.map((order) => <div className="toggle-row" key={order}><span>{order}</span><span className="pill">JSON</span></div>)}</div>
      </section>
    </main>
  );
}
