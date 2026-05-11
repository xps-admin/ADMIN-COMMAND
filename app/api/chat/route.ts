import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'nodejs';

type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const messages = Array.isArray(body.messages) ? body.messages as ChatMessage[] : [];

  if (!process.env.OPENAI_API_KEY && !process.env.AI_GATEWAY_API_KEY) {
    return Response.json({
      message: 'Admin Command chat route is installed. Add OPENAI_API_KEY or AI_GATEWAY_API_KEY in Vercel environment variables to enable live model responses.',
    });
  }

  const safeMessages = messages
    .filter((message) => ['user', 'assistant', 'system'].includes(message.role) && typeof message.content === 'string')
    .slice(-12);

  const system = [
    'You are the Admin Command GPT Bridge.',
    'Use the locked workflow: intake, discovery, compliance, offer, backend, frontend, automation, QA, approval, release, reporting, optimization.',
    'Do not expose secrets. Do not request raw passwords. Use vault references, OAuth, server-side env vars, audit logs, rollback refs, sandbox, and quarantine.',
    'For production-impacting actions, return a command plan requiring operator approval.',
  ].join(' ');

  const result = await generateText({
    model: process.env.AI_GATEWAY_API_KEY ? 'openai/gpt-4o-mini' : openai('gpt-4o-mini'),
    system,
    messages: safeMessages,
  });

  return Response.json({ message: result.text });
}
