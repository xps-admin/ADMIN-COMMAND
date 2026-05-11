#!/usr/bin/env bash
set -euo pipefail

# Admin Command Local Bootstrap
# Purpose: create/connect local repo, install dependencies, prepare env, link Vercel/Supabase, and establish safe bidirectional sync workflow.
# Usage:
#   bash scripts/admin-command-local-bootstrap.sh
# Or from any folder:
#   curl -fsSL https://raw.githubusercontent.com/Strategic-Minds/ADMIN-COMMAND/main/scripts/admin-command-local-bootstrap.sh | bash

REPO_URL="https://github.com/Strategic-Minds/ADMIN-COMMAND.git"
REPO_NAME="ADMIN-COMMAND"
VERCEL_PROJECT="admin-command"
VERCEL_SCOPE="strategic-minds-advisory"
VERCEL_PROJECT_ID="prj_bnEAqTm6tAopvlpoNR1a8XLF0JYz"
VERCEL_TEAM_ID="team_aFdds8lsbHMwe2ip4aQdbQ3d"
DEFAULT_BRANCH="main"

log() { printf '\n[ADMIN COMMAND] %s\n' "$1"; }
warn() { printf '\n[ADMIN COMMAND WARNING] %s\n' "$1"; }
fail() { printf '\n[ADMIN COMMAND ERROR] %s\n' "$1"; exit 1; }
need() { command -v "$1" >/dev/null 2>&1 || fail "Missing required command: $1"; }

log "Checking local prerequisites"
need git
need node
need npm

if ! command -v vercel >/dev/null 2>&1; then
  warn "Vercel CLI not found. Installing globally with npm."
  npm install -g vercel
fi

if ! command -v supabase >/dev/null 2>&1; then
  warn "Supabase CLI not found. Install it manually if you want db push automation. This script will continue."
fi

if [ ! -d "$REPO_NAME/.git" ]; then
  log "Local repo does not exist. Cloning $REPO_URL"
  git clone "$REPO_URL" "$REPO_NAME"
else
  log "Local repo exists. Using $REPO_NAME"
fi

cd "$REPO_NAME"

log "Ensuring canonical remote origin"
git remote set-url origin "$REPO_URL" || git remote add origin "$REPO_URL"

git fetch origin "$DEFAULT_BRANCH"

CURRENT_BRANCH="$(git branch --show-current || true)"
if [ "$CURRENT_BRANCH" != "$DEFAULT_BRANCH" ]; then
  log "Switching to $DEFAULT_BRANCH"
  git checkout "$DEFAULT_BRANCH" || git checkout -b "$DEFAULT_BRANCH" "origin/$DEFAULT_BRANCH"
fi

log "Pulling latest remote changes"
git pull --ff-only origin "$DEFAULT_BRANCH" || warn "Fast-forward pull failed. Resolve local changes before continuing if needed."

log "Creating local operational folders"
mkdir -p RUNNER_QUEUE/{pending,approved,running,completed,failed,quarantine,logs}
mkdir -p LOCAL_SYNC/{inbox,outbox,audit,rollback,quarantine,drive,github,vercel,supabase,shopify,content,lead-gen,benchmark,reverse-engineering}
mkdir -p .admin-command/{snapshots,logs,tmp}

log "Preparing .env.local from .env.example"
if [ ! -f .env.local ]; then
  cp .env.example .env.local 2>/dev/null || cat > .env.local <<'ENVEOF'
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
AI_GATEWAY_API_KEY=
VERCEL_TOKEN=
VERCEL_PROJECT_ID=prj_bnEAqTm6tAopvlpoNR1a8XLF0JYz
VERCEL_TEAM_ID=team_aFdds8lsbHMwe2ip4aQdbQ3d
GITHUB_TOKEN=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SHOPIFY_ADMIN_TOKEN=
CRON_SECRET=
ORCHESTRATOR_SECRET=
APPS_SCRIPT_SHARED_SECRET=
ENVEOF
else
  log ".env.local already exists. Not overwriting."
fi

# Ensure fixed Vercel IDs are present.
grep -q '^VERCEL_PROJECT_ID=' .env.local || echo "VERCEL_PROJECT_ID=$VERCEL_PROJECT_ID" >> .env.local
grep -q '^VERCEL_TEAM_ID=' .env.local || echo "VERCEL_TEAM_ID=$VERCEL_TEAM_ID" >> .env.local

log "Installing dependencies"
npm install

log "Running smoke tests"
npm run test

log "Running local build"
npm run build

log "Linking Vercel project"
vercel link --yes --project "$VERCEL_PROJECT" --scope "$VERCEL_SCOPE" || warn "Vercel link failed. Run 'vercel login' then rerun this script."

if [ -f .vercel/project.json ]; then
  log "Vercel link file created"
  cat .vercel/project.json
else
  warn "No .vercel/project.json found. Vercel may not be linked yet."
fi

if command -v supabase >/dev/null 2>&1; then
  if [ -n "${SUPABASE_PROJECT_REF:-}" ]; then
    log "Linking Supabase project $SUPABASE_PROJECT_REF"
    supabase link --project-ref "$SUPABASE_PROJECT_REF" || warn "Supabase link failed. Check login/project ref."
    log "Pushing Supabase migration"
    supabase db push || warn "Supabase db push failed. Check supabase/README.md for migration compatibility patch."
  else
    warn "SUPABASE_PROJECT_REF not set. Skipping supabase link/db push."
  fi
fi

log "Writing local bidirectional sync policy"
cat > LOCAL_SYNC/README.md <<'SYNCREADME'
# Admin Command Local Bidirectional Sync

This folder is the local staging layer between Codex/local work and Admin Command cloud systems.

## Flow

- `inbox/` receives operator inputs, exports, workbook drops, and provider exports.
- `outbox/` holds approved files ready to push to GitHub, Drive, Supabase, Shopify, Vercel, or content queues.
- `audit/` stores local action logs.
- `rollback/` stores before-state snapshots and restore notes.
- `quarantine/` stores set-aside items instead of deleting.

## Rules

- Pull before work: `git pull --ff-only origin main`
- Work in sandbox/local folders first.
- Run tests/build before push.
- Push with clear commit message.
- Secrets stay in `.env.local` or provider vaults, never in committed files.
- Production-impacting actions require operator approval.
SYNCREADME

log "Writing local command helpers"
cat > admin-command-local.sh <<'HELPER'
#!/usr/bin/env bash
set -euo pipefail

case "${1:-help}" in
  pull)
    git pull --ff-only origin main
    ;;
  test)
    npm run test && npm run build
    ;;
  push)
    msg="${2:-Admin Command local sync}"
    npm run test
    npm run build
    git status --short
    git add .
    git commit -m "$msg" || echo "No changes to commit."
    git push origin main
    ;;
  deploy)
    npm run test
    npm run build
    vercel deploy --prod
    ;;
  supabase)
    supabase db push
    ;;
  queue-check)
    find RUNNER_QUEUE -maxdepth 2 -type f | sort
    ;;
  help|*)
    echo "Admin Command local helper"
    echo "Commands: pull | test | push 'message' | deploy | supabase | queue-check"
    ;;
esac
HELPER
chmod +x admin-command-local.sh

log "Checking Git working tree"
git status --short

log "Local bootstrap complete"
printf '\nNext commands:\n'
printf '  cd %s\n' "$REPO_NAME"
printf '  nano .env.local   # add missing keys locally; never commit secrets\n'
printf '  ./admin-command-local.sh test\n'
printf '  ./admin-command-local.sh deploy\n'
