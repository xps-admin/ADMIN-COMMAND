# Admin Command Cloud-Only Operations

Admin Command is configured to run from the cloud using GitHub Actions, Vercel, Supabase, and Apps Script bridges.

## Primary runner

GitHub Actions workflow:

```text
.github/workflows/cloud-command-runner.yml
```

## Manual run path

1. Open GitHub.
2. Go to `Strategic-Minds/ADMIN-COMMAND`.
3. Open `Actions`.
4. Select `Admin Command Cloud Runner`.
5. Click `Run workflow`.
6. Choose a mode.

## Modes

```text
test-build          Runs install, smoke tests, and Next.js build.
deploy-preview      Runs test-build, then deploys a Vercel preview.
deploy-production   Runs test-build, then deploys Vercel production.
supabase-migrate    Runs test-build, then pushes Supabase migrations.
full-cloud-run      Runs test-build, deploy preview, deploy production, and Supabase migration jobs.
```

## Required GitHub repository secrets

Set these in:

```text
GitHub → Strategic-Minds/ADMIN-COMMAND → Settings → Secrets and variables → Actions
```

Required secrets:

```text
VERCEL_TOKEN
SUPABASE_ACCESS_TOKEN
SUPABASE_PROJECT_REF
```

Recommended secrets:

```text
OPENAI_API_KEY
AI_GATEWAY_API_KEY
SUPABASE_SERVICE_ROLE_KEY
ORCHESTRATOR_SECRET
```

Recommended variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Vercel project

```text
Team: Strategic Minds Advisory
Scope: strategic-minds-advisory
Project: admin-command
Project ID: prj_bnEAqTm6tAopvlpoNR1a8XLF0JYz
Team ID: team_aFdds8lsbHMwe2ip4aQdbQ3d
```

## Important Vercel relink

If deployments still show old GitHub metadata pointing to `xps-admin/ADMIN-COMMAND`, relink the Vercel Git integration:

```text
Vercel → admin-command → Settings → Git
Disconnect old repo
Connect Strategic-Minds/ADMIN-COMMAND
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run build
```

## Cloud-only rule

Local Codex is optional. The default execution model is:

```text
GitHub Actions → tests/build → Vercel deploy → Supabase migration → audit/runner policy
```

## Security rule

No raw secrets in repo, UI, logs, docs, sheets, or Apps Script files. Use provider secrets, Vercel environment variables, GitHub Actions secrets, Supabase Vault, or OAuth.
