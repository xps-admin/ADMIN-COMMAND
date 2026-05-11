# Admin Command Current-State System Audit

Date: 2026-05-11
Canonical repo: `Strategic-Minds/ADMIN-COMMAND`
Canonical project board: `https://github.com/orgs/Strategic-Minds/projects/1/settings`
Vercel project: `admin-command`
Vercel team: `Strategic Minds Advisory`
Vercel project ID: `prj_bnEAqTm6tAopvlpoNR1a8XLF0JYz`
Vercel team ID: `team_aFdds8lsbHMwe2ip4aQdbQ3d`
Backend standard: Supabase Postgres

## Executive status

Admin Command has a functional Next.js App Router scaffold, metallic silver command UI shell, route map, PWA assets, Supabase schema migration, cloud runner workflow, command bridge, GPT automation bridge, Apps Script Drive bridge, and env documentation.

The system is not yet 100% launch-complete because production Vercel deployment has not been verified live after the latest patches, Supabase migration has not been verified applied, Apps Script Web App deployment has not been verified, GitHub Project automation is not yet fully populated, and external provider relays for social/email/SMS/Shopify publish are not yet verified.

## Verified repository state

- GitHub repo exists and is accessible with admin/push capability.
- Repo owner: `Strategic-Minds`.
- Repo: `ADMIN-COMMAND`.
- Visibility: public.
- Default branch: `main`.
- Merge methods are enabled.
- Auto-merge is not currently enabled.

## Verified Vercel state

- Vercel project exists.
- Project: `admin-command`.
- Framework is now set to `nextjs`.
- Node version is `24.x`.
- Latest known deployment was still an old failed production deployment when checked.
- Live status was not verified as green after the latest commits.

## Verified app foundation

The repo contains:

- `package.json` with Next.js build/dev/start/test scripts.
- Next.js dependency.
- React dependency.
- Supabase dependency.
- Vercel AI SDK dependency.
- TypeScript configuration.
- Tailwind/PostCSS configuration.
- Next.js App Router layout/page files.
- Dynamic route shell for command modules.
- Metallic silver CSS system.
- PWA manifest, icon, and service worker.

## Verified routes/modules in design

Admin Command shell includes:

- `/dashboard`
- `/vault`
- `/systems`
- `/workflow`
- `/sandbox`
- `/quarantine`
- `/logs`
- `/rollback`
- `/content`
- `/lead-gen`
- `/benchmark`
- `/reverse-engineering`
- `/capabilities`
- `/github`
- `/drive`
- `/vercel`
- `/supabase`
- `/shopify`
- `/chat`
- `/tools`
- `/templates`
- `/settings`

## Verified bridge routes

### `/api/bridge`

Purpose: create Supabase command records, queue commands, and log audit events.

Status: scaffold exists.

Risk: currently depends on Supabase service env and applied schema. If schema is missing, command insertion will fail.

### `/api/gpt-automation-bridge`

Purpose: execute gated provider actions from Admin Command.

Supported actions:

- `shopify.publish_product`
- `shopify.publish_collection`
- `drive.delete_request`
- `drive.quarantine`
- `social.post`
- `email.send`
- `sms.send`
- `github.workflow_dispatch`
- `vercel.deploy_hook`
- `vercel.workflow_dispatch`

Safety rules:

- Requires `Authorization: Bearer ORCHESTRATOR_SECRET`.
- Defaults to dry run.
- Requires `approved: true` and `dryRun: false` for execution.
- Attempts Supabase audit logging.
- Keeps secrets server-side.

Known limitation:

- Provider-specific env values are required before external actions can execute.
- Missing optional provider env should not block internal system build/audit workflows.

## Supabase status

Migration exists:

`supabase/migrations/0001_admin_command_schema.sql`

Tables included:

- systems
- projects
- accounts
- connectors
- capabilities
- capability_tags
- workflows
- workflow_runs
- workflow_steps
- commands
- command_queue
- runner_jobs
- audit_logs
- rollback_snapshots
- quarantine_items
- vault_references
- env_references
- chat_sessions
- chat_messages
- drive_registry
- github_registry
- vercel_registry
- supabase_registry
- shopify_registry
- content_queue
- social_queue
- reply_queue
- lead_sources
- lead_campaigns
- lead_contacts
- benchmark_targets
- benchmark_results
- reverse_engineering_runs
- automation_jobs
- appscript_jobs
- templates
- tools
- ui_components
- ui_edit_history
- qa_checks
- approval_gates
- handoff_readiness

Verification gap:

- Could not verify migration has been applied in Supabase.
- SQL compatibility note exists for one possible `ADD CONSTRAINT IF NOT EXISTS` issue.

## GitHub Actions / cloud runner status

Existing cloud runner:

`.github/workflows/cloud-command-runner.yml`

Modes:

- test-build
- deploy-preview
- deploy-production
- supabase-migrate
- full-cloud-run

Existing CI:

`.github/workflows/admin-command-ci.yml`

Recent known issue:

- Old reruns used old commit workflow with `cache: npm` and caused lockfile error.
- Current workflow should be triggered fresh from latest `main` instead of rerunning old failed jobs.

Remaining gap:

- Need self-healing/autobuild workflow that reads a backlog manifest and produces PRs/issues/patches automatically.

## Apps Script / Drive status

Existing script:

`apps-script/AdminCommandDriveBridge.gs`

Capabilities:

- Create Admin Command root structure.
- Create system folder structure.
- Create audit log sheet.
- Create system registry sheet.
- Create index docs.
- Sync folders.
- Quarantine instead of permanent deletion.
- QA firewall.
- Mirror folder structure.

Verification gap:

- Could not verify the script has been pasted/deployed as a Web App.
- Could not verify `APPS_SCRIPT_WEB_APP_URL` is installed in Vercel.

## Shopify status

Bridge supports product/collection publish through Shopify Admin GraphQL.

Verification gap:

- Could not verify `SHOPIFY_SHOP_DOMAIN`.
- Could not verify `SHOPIFY_ADMIN_TOKEN`.
- Publish actions must remain disabled until those are installed.

## Social / email / SMS status

Bridge supports external relays through webhooks:

- `SOCIAL_WEBHOOK_URL`
- `EMAIL_WEBHOOK_URL`
- `SMS_WEBHOOK_URL`

Verification gap:

- Could not verify relay provider setup.
- Outside-system posting/sending must remain blocked until configured.

## GitHub Project status

Target project:

`https://github.com/orgs/Strategic-Minds/projects/1/settings`

Verification gap:

- Current connector set does not expose project field management directly.
- Workaround: create GitHub issues with standard labels and task IDs so they can be added to Project 1 manually or through future GraphQL/project automation.

## System phases left to reach 100%

### Phase 01 — Deployment green

- Fresh GitHub Actions run on latest `main`.
- Fresh Vercel deploy from latest `main`.
- Verify `/dashboard`.
- Verify `/api/health`.
- Verify `/api/gpt-automation-bridge` GET.

### Phase 02 — Supabase live schema

- Confirm Supabase env installed.
- Apply migration.
- Confirm tables exist.
- Insert test command.
- Confirm audit log write.

### Phase 03 — GPT bridge operational

- Confirm `ORCHESTRATOR_SECRET`.
- Test unauthorized request returns 401.
- Test approved dry run returns dry-run success.
- Test Supabase audit logging.
- Test internal GitHub workflow dispatch.

### Phase 04 — Vercel automation operational

- Confirm `VERCEL_TOKEN` or deploy hook.
- Test `vercel.workflow_dispatch` or `vercel.deploy_hook`.
- Confirm production deployment created.
- Confirm deployment health.

### Phase 05 — GitHub Project integration

- Create remaining-work issues.
- Add labels.
- Add issues to Project 1 manually or via later project API.
- Map status fields: Backlog, Ready, Building, QA, Blocked, Done.

### Phase 06 — Apps Script live bridge

- Deploy Apps Script as Web App.
- Install `APPS_SCRIPT_WEB_APP_URL`.
- Test `drive.quarantine` dry run.
- Test Drive audit log entry.

### Phase 07 — Shopify publish bridge

- Install `SHOPIFY_SHOP_DOMAIN`.
- Install `SHOPIFY_ADMIN_TOKEN`.
- Test draft product lookup.
- Test product publish only after approval.
- Log result.

### Phase 08 — Social/email/SMS external relay

- Choose relay providers.
- Install webhook URLs.
- Test dry run.
- Test one approved internal sample only after provider compliance is confirmed.

### Phase 09 — UI controls wired to bridge

- Add bridge action form components.
- Add Vault provider status cards backed by env/vault references.
- Add workflow run creation UI.
- Add command queue UI.
- Add audit log UI.

### Phase 10 — Autonomous builder loop

- Add backlog manifest.
- Add self-healing GitHub Actions workflow.
- Add validation/reflection report.
- Add PR creation path or issue logging path.
- Add iteration count and safe stopping rules.

### Phase 11 — Production hardening

- Add RLS policies.
- Add auth/sign-in.
- Add role model.
- Add rate limits.
- Add error logging.
- Add provider risk gates.

### Phase 12 — Launch readiness

- Final smoke tests.
- Final env check.
- Final route check.
- Final Supabase check.
- Final provider check.
- Launch note.

## Risk register

| Risk | Status | Workaround |
|---|---|---|
| Vercel latest deployment not green | Open | Trigger fresh deploy from latest main |
| Supabase migration not verified | Open | Run `supabase-migrate` cloud workflow |
| Project 1 automation not exposed by connector | Open | Use issues/labels now; automate project later |
| External posting env missing | Expected | Do not block internal system; block external actions only |
| Apps Script Web App not verified | Open | Deploy script manually, store Web App URL |
| Shopify token/domain not verified | Open | Keep publish actions gated |
| SMS compliance | Open | Use provider with consent/opt-out controls |

## Current completion estimate

- Repo scaffold: 70%
- UI shell/routes: 65%
- Bridge scaffolding: 65%
- Supabase schema: 75% created, 0-50% verified depending on migration status
- Vercel deployment: 40% until live deployment verified
- Apps Script bridge: 70% created, not verified deployed
- Provider automation: 35% until env/provider relays are installed
- Autonomous builder: 25% before new workflow is added
- Launch readiness: 45%

Overall current system completion estimate: **55-60% built, not yet launch-complete**.
