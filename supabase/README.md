# Admin Command Supabase Setup

## Backend standard

Supabase Postgres is the backend standard for Admin Command.

## Apply schema

Preferred local workflow:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

If the first migration fails on this line because of local Postgres syntax support:

```sql
alter table audit_logs add constraint if not exists audit_logs_rollback_fk foreign key ...
```

Use this safe replacement in the SQL Editor or patch the migration locally:

```sql
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'audit_logs_rollback_fk'
  ) THEN
    ALTER TABLE audit_logs
      ADD CONSTRAINT audit_logs_rollback_fk
      FOREIGN KEY (rollback_snapshot_id)
      REFERENCES rollback_snapshots(id)
      ON DELETE SET NULL;
  END IF;
END $$;
```

## Required env vars

Set these in Vercel and local `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ORCHESTRATOR_SECRET=
OPENAI_API_KEY=
AI_GATEWAY_API_KEY=
```

## Important

- Do not store raw passwords, API keys, or tokens in browser tables.
- Use `vault_references` to reference secrets stored in Vercel Env, Supabase Vault, Google Secret Manager, OAuth, or provider-managed storage.
- Production-impacting commands require approval and rollback references.
