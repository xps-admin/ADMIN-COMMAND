'use client';

import { useState } from 'react';

type Message = { role: 'user' | 'assistant'; content: string };

export default function ChatPanel() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Admin Command bridge ready. Commands are routed through server-side policy, audit, rollback, sandbox, and quarantine rules.' },
  ]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    const next: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setBusy(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const data = await response.json();
      setMessages([...next, { role: 'assistant', content: data.message ?? 'No response returned.' }]);
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Chat API not configured. Add AI_GATEWAY_API_KEY or OPENAI_API_KEY in Vercel environment variables.' }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {open ? (
        <section className="chat-panel" aria-label="Admin Command chat panel">
          <div className="chat-head"><strong>Admin Command GPT Bridge</strong><button type="button" onClick={() => setOpen(false)}>Close</button></div>
          <div className="chat-body">{messages.map((message, index) => <div key={index} className={`msg ${message.role}`}>{message.content}</div>)}</div>
          <form className="chat-form" onSubmit={submit}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Command Admin Command..." /><button type="submit">{busy ? '...' : 'Send'}</button></form>
        </section>
      ) : null}
      <button type="button" className="chat-toggle" onClick={() => setOpen(!open)}>{open ? 'Hide Chat' : 'Open Chat'}</button>
    </>
  );
}
