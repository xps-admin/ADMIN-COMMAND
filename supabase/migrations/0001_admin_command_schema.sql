-- Admin Command production schema
-- Backend standard: Supabase Postgres
-- Secrets are referenced, never stored raw in browser-facing tables.

create extension if not exists pgcrypto;

create table if not exists systems (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  lane text,
  status text not null default 'planned',
  owner text,
  repo_url text,
  drive_url text,
  vercel_project_id text,
  supabase_project_ref text,
  shopify_store text,
  revenue_path jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  system_id uuid references systems(id) on delete set null,
  name text not null,
  status text not null default 'planned',
  priority text default 'medium',
  owner text,
  links jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  system_id uuid references systems(id) on delete set null,
  provider text not null,
  account_name text not null,
  account_ref text,
  status text not null default 'not_connected',
  owner text,
  scopes text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists connectors (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references accounts(id) on delete set null,
  system_id uuid references systems(id) on delete set null,
  provider text not null,
  connector_name text not null,
  status text not null default 'planned',
  read_enabled boolean not null default true,
  write_enabled boolean not null default false,
  admin_enabled boolean not null default false,
  delete_enabled boolean not null default false,
  quarantine_required boolean not null default true,
  audit_required boolean not null default true,
  rollback_required boolean not null default true,
  last_sync_at timestamptz,
  last_rotation_at timestamptz,
  risk_level text not null default 'medium',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists capabilities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  description text,
  recommended_stack text,
  workflow_stage text,
  default_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists capability_tags (
  id uuid primary key default gen_random_uuid(),
  capability_id uuid references capabilities(id) on delete cascade,
  tag text not null,
  definition text,
  recommended_stack text,
  caution text,
  recommendation_logic text,
  created_at timestamptz not null default now()
);

create table if not exists workflows (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  locked boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists workflow_steps (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid references workflows(id) on delete cascade,
  step_number int not null,
  phase text not null,
  purpose text,
  required_output text,
  gate text,
  validation_rule text,
  fallback_rule text,
  created_at timestamptz not null default now(),
  unique(workflow_id, step_number)
);

create table if not exists workflow_runs (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid references workflows(id) on delete set null,
  system_id uuid references systems(id) on delete set null,
  project_id uuid references projects(id) on delete set null,
  status text not null default 'intake',
  current_step int not null default 1,
  operator text,
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  gate_status text default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists commands (
  id uuid primary key default gen_random_uuid(),
  workflow_run_id uuid references workflow_runs(id) on delete set null,
  system_id uuid references systems(id) on delete set null,
  actor text not null default 'operator',
  command_type text not null,
  command_text text not null,
  target_provider text,
  target_ref text,
  zone text not null default 'sandbox',
  status text not null default 'queued',
  approval_required boolean not null default true,
  approved boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists command_queue (
  id uuid primary key default gen_random_uuid(),
  command_id uuid references commands(id) on delete cascade,
  queue_name text not null default 'pending',
  priority int not null default 50,
  available_at timestamptz not null default now(),
  locked_at timestamptz,
  completed_at timestamptz,
  failed_at timestamptz,
  error text,
  created_at timestamptz not null default now()
);

create table if not exists runner_jobs (
  id uuid primary key default gen_random_uuid(),
  command_id uuid references commands(id) on delete set null,
  repo text not null default 'Strategic-Minds/ADMIN-COMMAND',
  zone text not null default 'sandbox',
  status text not null default 'pending',
  approved boolean not null default false,
  audit_log_required boolean not null default true,
  rollback_required boolean not null default true,
  success_criteria text,
  job_payload jsonb not null default '{}'::jsonb,
  log_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint runner_jobs_safe_execution check (approved = false or (zone = 'sandbox' and audit_log_required = true and rollback_required = true))
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  command_id uuid references commands(id) on delete set null,
  system_id uuid references systems(id) on delete set null,
  actor text,
  action text not null,
  provider text,
  target_ref text,
  before_state jsonb,
  after_state jsonb,
  status text not null default 'logged',
  rollback_snapshot_id uuid,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists rollback_snapshots (
  id uuid primary key default gen_random_uuid(),
  command_id uuid references commands(id) on delete set null,
  system_id uuid references systems(id) on delete set null,
  provider text,
  target_ref text,
  snapshot_type text not null default 'before_state',
  snapshot jsonb not null default '{}'::jsonb,
  restore_instruction text,
  created_at timestamptz not null default now()
);

alter table audit_logs add constraint if not exists audit_logs_rollback_fk foreign key (rollback_snapshot_id) references rollback_snapshots(id) on delete set null;

create table if not exists quarantine_items (
  id uuid primary key default gen_random_uuid(),
  command_id uuid references commands(id) on delete set null,
  system_id uuid references systems(id) on delete set null,
  provider text not null,
  original_ref text not null,
  quarantine_ref text,
  reason text not null,
  status text not null default 'quarantined',
  restore_instruction text,
  retention_until timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists vault_references (
  id uuid primary key default gen_random_uuid(),
  connector_id uuid references connectors(id) on delete set null,
  provider text not null,
  secret_name text not null,
  secret_location text not null,
  secret_ref text not null,
  visible_to_browser boolean not null default false,
  rotation_policy text default 'manual',
  last_rotation_at timestamptz,
  next_rotation_at timestamptz,
  status text not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint no_browser_secret_exposure check (visible_to_browser = false)
);

create table if not exists env_references (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  env_key text not null,
  environment text not null default 'production',
  required boolean not null default true,
  description text,
  status text not null default 'missing',
  created_at timestamptz not null default now()
);

create table if not exists chat_sessions (
  id uuid primary key default gen_random_uuid(),
  workflow_run_id uuid references workflow_runs(id) on delete set null,
  title text,
  operator text,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  chat_session_id uuid references chat_sessions(id) on delete cascade,
  role text not null,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists drive_registry (
  id uuid primary key default gen_random_uuid(),
  system_id uuid references systems(id) on delete set null,
  folder_name text not null,
  folder_id text,
  folder_url text,
  folder_type text,
  status text not null default 'planned',
  last_sync_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists github_registry (
  id uuid primary key default gen_random_uuid(),
  system_id uuid references systems(id) on delete set null,
  repo text not null,
  project_url text,
  default_branch text default 'main',
  status text not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists vercel_registry (
  id uuid primary key default gen_random_uuid(),
  system_id uuid references systems(id) on delete set null,
  project_id text not null,
  team_id text,
  project_name text,
  production_url text,
  framework text,
  status text not null default 'unknown',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists supabase_registry (
  id uuid primary key default gen_random_uuid(),
  system_id uuid references systems(id) on delete set null,
  project_ref text,
  project_url text,
  status text not null default 'connected',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists shopify_registry (
  id uuid primary key default gen_random_uuid(),
  system_id uuid references systems(id) on delete set null,
  store_domain text,
  status text not null default 'planned',
  draft_only boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists content_queue (
  id uuid primary key default gen_random_uuid(),
  system_id uuid references systems(id) on delete set null,
  campaign text,
  content_type text,
  platform text,
  title text,
  body text,
  status text not null default 'draft',
  approval_status text not null default 'pending',
  scheduled_for timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists social_queue (
  id uuid primary key default gen_random_uuid(),
  content_queue_id uuid references content_queue(id) on delete cascade,
  platform text not null,
  post_body text,
  media_refs jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  approval_required boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists reply_queue (
  id uuid primary key default gen_random_uuid(),
  system_id uuid references systems(id) on delete set null,
  platform text,
  source_ref text,
  inbound_text text,
  suggested_reply text,
  classification text,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists lead_sources (
  id uuid primary key default gen_random_uuid(),
  system_id uuid references systems(id) on delete set null,
  source_name text not null,
  source_url text,
  source_type text,
  permission_status text not null default 'unknown',
  status text not null default 'planned',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists lead_campaigns (
  id uuid primary key default gen_random_uuid(),
  system_id uuid references systems(id) on delete set null,
  name text not null,
  offer text,
  lead_magnet text,
  primary_cta text,
  status text not null default 'draft',
  kpis jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists lead_contacts (
  id uuid primary key default gen_random_uuid(),
  lead_campaign_id uuid references lead_campaigns(id) on delete set null,
  source_id uuid references lead_sources(id) on delete set null,
  name text,
  company text,
  email text,
  phone text,
  qualification_score numeric,
  status text not null default 'new',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists benchmark_targets (
  id uuid primary key default gen_random_uuid(),
  system_id uuid references systems(id) on delete set null,
  target_name text not null,
  target_url text,
  category text,
  permission_status text not null default 'public_review',
  status text not null default 'planned',
  created_at timestamptz not null default now()
);

create table if not exists benchmark_results (
  id uuid primary key default gen_random_uuid(),
  benchmark_target_id uuid references benchmark_targets(id) on delete cascade,
  workflow_pattern text,
  ux_pattern text,
  automation_pattern text,
  lead_gen_pattern text,
  monetization_path text,
  content_system text,
  key_differentiators text,
  reusable_components jsonb not null default '[]'::jsonb,
  implementation_opportunities jsonb not null default '[]'::jsonb,
  risk_notes text,
  upgrade_recommendation text,
  evidence_urls text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists reverse_engineering_runs (
  id uuid primary key default gen_random_uuid(),
  benchmark_target_id uuid references benchmark_targets(id) on delete set null,
  permission_gate text not null default 'required',
  robots_gate text not null default 'required',
  viewport_capture_ref text,
  dom_extract jsonb not null default '{}'::jsonb,
  css_tokens jsonb not null default '{}'::jsonb,
  component_inventory jsonb not null default '{}'::jsonb,
  backend_surface jsonb not null default '{}'::jsonb,
  asset_permission_matrix jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists automation_jobs (
  id uuid primary key default gen_random_uuid(),
  system_id uuid references systems(id) on delete set null,
  job_type text not null,
  provider text,
  schedule text,
  status text not null default 'planned',
  payload jsonb not null default '{}'::jsonb,
  last_run_at timestamptz,
  next_run_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists appscript_jobs (
  id uuid primary key default gen_random_uuid(),
  automation_job_id uuid references automation_jobs(id) on delete set null,
  function_name text not null,
  script_id text,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'queued',
  result jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  system_type text,
  body text,
  source_workbook text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  description text,
  route text,
  provider text,
  capability_tags text[] not null default '{}',
  status text not null default 'planned',
  created_at timestamptz not null default now()
);

create table if not exists ui_components (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  component_type text,
  route text,
  config jsonb not null default '{}'::jsonb,
  editable boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists ui_edit_history (
  id uuid primary key default gen_random_uuid(),
  ui_component_id uuid references ui_components(id) on delete set null,
  actor text,
  before_config jsonb,
  after_config jsonb,
  rollback_snapshot_id uuid references rollback_snapshots(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists qa_checks (
  id uuid primary key default gen_random_uuid(),
  workflow_run_id uuid references workflow_runs(id) on delete set null,
  check_name text not null,
  check_type text,
  status text not null default 'pending',
  evidence_ref text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists approval_gates (
  id uuid primary key default gen_random_uuid(),
  workflow_run_id uuid references workflow_runs(id) on delete set null,
  command_id uuid references commands(id) on delete set null,
  gate_name text not null,
  status text not null default 'pending',
  approver text,
  approved_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists handoff_readiness (
  id uuid primary key default gen_random_uuid(),
  system_id uuid references systems(id) on delete set null,
  project_id uuid references projects(id) on delete set null,
  item text not null,
  required boolean not null default true,
  status text not null default 'pending',
  evidence_ref text,
  created_at timestamptz not null default now()
);

create index if not exists idx_commands_status on commands(status);
create index if not exists idx_workflow_runs_status on workflow_runs(status);
create index if not exists idx_audit_logs_created on audit_logs(created_at desc);
create index if not exists idx_runner_jobs_status on runner_jobs(status);
create index if not exists idx_content_queue_status on content_queue(status);
create index if not exists idx_lead_contacts_status on lead_contacts(status);

insert into systems (code, name, lane, status, owner) values
  ('SYS-001','XPS Intelligence','AI / Ops','tracked','Jeremy + GPT'),
  ('SYS-002','XPS Xpress','Commerce','tracked','Jeremy'),
  ('SYS-003','Polished Concrete University','Education','tracked','Jeremy + GPT'),
  ('SYS-004','XPS Contractor Success','Growth','tracked','Jeremy + GPT'),
  ('SYS-005','Epoxy Changes Lives','Content','tracked','GPT'),
  ('SYS-006','Strategic Minds Advisory','Advisory','tracked','Jeremy'),
  ('SYS-007','AI in Action','Media','tracked','Jeremy + GPT')
on conflict (code) do update set name = excluded.name, lane = excluded.lane, status = excluded.status, owner = excluded.owner, updated_at = now();

insert into workflows (name, description, locked) values
  ('Admin Command 12-Phase Workflow','Intake, discovery, compliance, offer, backend, frontend, automation, QA, approval, release, reporting, optimization.', true)
on conflict do nothing;

with w as (select id from workflows where name = 'Admin Command 12-Phase Workflow' limit 1)
insert into workflow_steps (workflow_id, step_number, phase, purpose, required_output, gate, validation_rule, fallback_rule)
select w.id, s.step_number, s.phase, s.purpose, s.required_output, s.gate, s.validation_rule, s.fallback_rule
from w cross join (values
  (1,'Intake / Source Read','Collect inputs, source links, account/tool availability.','Intake summary + source ledger','No build before intake exists','Required output logged','Set blocked and ask only critical question'),
  (2,'Discovery / Research','Inspect market, user, benchmark, assets, constraints.','Discovery brief','Could not verify items logged','Sources/evidence attached','Set blocked and log reason'),
  (3,'Claims + Compliance Scan','Flag regulated claims, IP, privacy, legal, payment, platform risks.','Compliance gate note','High-risk items block launch','Risk notes complete','Route to approval'),
  (4,'Funnel / Offer Logic','Map offer, CTA, user journey, revenue path.','Funnel map','No vague offer','CTA and revenue path complete','Return to intake'),
  (5,'Backend + Data Model','Define auth, data, API, forms, storage, logs.','Backend contract','No secret exposure','Schema and env refs complete','Use safer native stack'),
  (6,'Frontend / UI Build','Build responsive UI from locked design system.','Next.js page/module','No design drift','Mobile/desktop QA complete','Sandbox only'),
  (7,'Automation Bridge','Map provider actions and command queue.','Bridge contract','No raw tokens in UI','Audit/rollback specified','Disable risky actions'),
  (8,'QA Firewall','Run tests, evidence check, compliance check.','QA report','Failures block release','Smoke tests pass','Log failures'),
  (9,'Operator Approval','Jeremy approves production action.','Approval gate record','No approval, no production','Approver recorded','Keep in sandbox'),
  (10,'Release / Sync','Deploy or sync approved action.','Release note + log','Rollback ref required','Deployment/sync verified','Rollback or quarantine'),
  (11,'Reporting','Capture KPI/report outcome.','Report row','No untracked outcomes','Metrics logged','Create follow-up'),
  (12,'Optimization','Create next sprint/update.','Optimization backlog','No endless drift','Next action assigned','Close or rescope')
) as s(step_number, phase, purpose, required_output, gate, validation_rule, fallback_rule)
on conflict (workflow_id, step_number) do nothing;

insert into env_references (provider, env_key, environment, required, description) values
  ('supabase','NEXT_PUBLIC_SUPABASE_URL','production',true,'Public Supabase project URL'),
  ('supabase','NEXT_PUBLIC_SUPABASE_ANON_KEY','production',true,'Public anon key for browser client'),
  ('supabase','SUPABASE_SERVICE_ROLE_KEY','production',true,'Server-only service role key'),
  ('ai','OPENAI_API_KEY','production',false,'Server-only OpenAI key'),
  ('ai','AI_GATEWAY_API_KEY','production',false,'Server-only Vercel AI Gateway key'),
  ('vercel','VERCEL_TOKEN','production',false,'Server-only Vercel API token'),
  ('github','GITHUB_TOKEN','production',false,'Server-only GitHub token'),
  ('google','GOOGLE_CLIENT_ID','production',false,'OAuth client ID'),
  ('google','GOOGLE_CLIENT_SECRET','production',false,'OAuth client secret'),
  ('shopify','SHOPIFY_ADMIN_TOKEN','production',false,'Server-only Shopify token'),
  ('admin','CRON_SECRET','production',true,'Cron route authorization secret'),
  ('admin','ORCHESTRATOR_SECRET','production',true,'Bridge route authorization secret')
on conflict do nothing;
