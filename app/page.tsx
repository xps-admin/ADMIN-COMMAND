import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="content">
      <section className="hero">
        <p className="eyebrow">Strategic Minds · Admin Command</p>
        <h1>Ultimate Admin Command</h1>
        <p>Production operator hub for systems, Supabase, Vercel, GitHub, Drive, Shopify, workflow, sandbox, quarantine, logs, rollback, and AI-assisted execution.</p>
        <div className="button-row">
          <Link className="button primary" href="/dashboard">Open Dashboard</Link>
          <Link className="button" href="/vault">Open Vault</Link>
          <Link className="button" href="/settings">Settings</Link>
        </div>
      </section>
    </main>
  );
}
