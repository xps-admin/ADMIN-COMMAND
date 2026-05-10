# Admin Command Automation Stack

## Purpose

Admin Command is the operator hub for controlling projects, accounts, content, automation, and system execution from one repeatable workflow.

## Production Foundation

- Next.js App Router dashboard
- Supabase Postgres standard backend
- Vercel production deployment: https://admin-command-seven.vercel.app
- PWA-enabled mobile/desktop install
- Vercel AI SDK chatbot side panel
- Google Apps Script Drive bridge
- GitHub Projects + Issues + PRs for execution
- Quarantine-first file operations
- Full audit log and rollback references

## Install / Integration Stack

### Core app

1. Next.js App Router
2. TypeScript
3. Tailwind CSS
4. shadcn/ui
5. Supabase Auth + Postgres
6. Supabase Row Level Security
7. Vercel Analytics
8. PWA manifest + service worker
9. Vercel AI SDK / Chat SDK side panel
10. Server Actions / API routes for bridge commands

### Automation layer

1. Vercel Cron Jobs
2. Vercel Webhooks
3. Supabase Edge Functions
4. Supabase Realtime
5. Supabase database webhooks
6. Google Apps Script bridge
7. GitHub Actions
8. GitHub issue/PR automation
9. Codex/local runner queue
10. Postiz or social scheduler adapter

### Discovery / ingestion layer

1. Firecrawl or permissioned web crawler
2. Playwright sandbox browser tester
3. Drive indexer
4. GitHub repo indexer
5. Shopify product/content indexer
6. Supabase vector/search table later

### Content / publishing layer

1. Draft-only social scheduler adapter
2. Shopify draft page/product/collection tooling
3. Gmail draft generator
4. Calendar/task exporter
5. Asset pack generator
6. Analytics loop

## Non-negotiable control model

- No raw passwords or API keys in browser UI.
- No secrets in Google Sheets, Google Docs, GitHub code, or public logs.
- Use Vercel Env, Supabase Vault, Google Secret Manager, or OAuth tokens.
- All write actions must log before/after state where possible.
- All destructive intent routes to quarantine first.
- Production publish/deploy/send requires explicit operator approval.
- Every workflow run must have a source ledger and audit trail.

## Standard workflow gates

1. Intake
2. Source inventory
3. System registry update
4. Sandbox folder and task creation
5. Build / draft
6. QA firewall
7. Operator approval
8. Release / sync
9. Audit log
10. Rollback reference
11. Reporting
12. Optimization

## Recommended Admin Command pages

- `/dashboard` — command overview
- `/chat` — side-panel operator chatbot
- `/vault` — connector registry and secret references
- `/systems` — all brands/projects/systems
- `/workflow` — gated workflow runs
- `/sandbox` — safe build zone
- `/quarantine` — set-aside files/folders/items
- `/logs` — audit history
- `/rollback` — restore references
- `/content` — content generation and schedule queue
- `/social` — post/reply/draft queue
- `/github` — repos/issues/PRs
- `/drive` — Drive structure/sync status
- `/supabase` — DB health/schema/logs
- `/shopify` — products/pages/orders/analytics draft controls
- `/settings` — environment, integrations, policies

## Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=REPLACE_ME
NEXT_PUBLIC_SUPABASE_ANON_KEY=REPLACE_ME
SUPABASE_SERVICE_ROLE_KEY=REPLACE_ME_SERVER_ONLY
AI_GATEWAY_API_KEY=REPLACE_ME_SERVER_ONLY
OPENAI_API_KEY=REPLACE_ME_SERVER_ONLY
GITHUB_TOKEN=REPLACE_ME_SERVER_ONLY
VERCEL_TOKEN=REPLACE_ME_SERVER_ONLY
VERCEL_PROJECT_ID=REPLACE_ME
VERCEL_TEAM_ID=REPLACE_ME
GOOGLE_CLIENT_ID=REPLACE_ME
GOOGLE_CLIENT_SECRET=REPLACE_ME_SERVER_ONLY
SHOPIFY_ADMIN_TOKEN=REPLACE_ME_SERVER_ONLY
CRON_SECRET=REPLACE_ME_SERVER_ONLY
ORCHESTRATOR_SECRET=REPLACE_ME_SERVER_ONLY
APPS_SCRIPT_SHARED_SECRET=REPLACE_ME_SERVER_ONLY
```

## Automation maximizers to install

1. Vercel AI SDK / Chat SDK for side-panel operator chat.
2. Vercel AI Gateway for model routing and cost controls.
3. Vercel Cron Jobs for scheduled sync, audit, and health checks.
4. Supabase Realtime for live dashboard updates.
5. Supabase Edge Functions for backend automation.
6. Supabase Vault for secret references.
7. GitHub Actions for repo QA, tests, linting, and deployment checks.
8. Google Apps Script for Drive/folder/workspace automation.
9. Postiz for social scheduling and content queue operations.
10. Playwright for screenshot QA and UI regression testing.
11. Firecrawl for permissioned web ingestion.
12. Sentry or Logtail/Axiom for production error logging.
13. Upstash QStash/Redis for queues and delayed jobs if needed.
14. Stripe later for consulting/SaaS billing.
15. Resend later for system emails and approval notifications.

## Drive bridge rule

Drive can mirror folder structure and move items to quarantine. True permanent auto-delete is not recommended for Admin Command because it breaks rollback and audit. Use quarantine and retention windows instead.
