-- GradieKAn database v0.1 (Supabase Postgres). Applied with `npm run db:push`.
-- Privacy (CLAUDE.md §7): NO student data. Progress and notes stay on the student's device.
-- These tables only hold anonymous AI usage, for the daily quota, the monthly budget, and research counts.
-- RLS is enabled with no policies: Supabase's public Data API cannot read them; only the Edge Function can.

-- Daily quota per anonymous client (salted SHA-256 of the IP address; not reversible to a person).
create table ai_usage_daily (
  day date not null,
  client_hash varchar(32) not null,
  requests integer not null default 0,
  primary key (day, client_hash)
);

-- Monthly totals for the budget guard (AI_MONTHLY_BUDGET_USD).
create table ai_usage_monthly (
  month varchar(7) primary key, -- YYYY-MM (WIB)
  requests integer not null default 0,
  input_tokens bigint not null default 0,
  output_tokens bigint not null default 0,
  cost_usd numeric(12, 6) not null default 0
);

-- One row per AI request, without the question text or any identifier (research: which RMT phase needs help).
create table ai_requests (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  surface varchar(10) not null check (surface in ('tanya', 'rmt')),
  lesson varchar(40),
  phase varchar(20),
  model varchar(60),
  status varchar(10) not null check (status in ('ok', 'refused', 'busy', 'error')),
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  latency_ms integer not null default 0
);
create index ai_requests_created_at_idx on ai_requests (created_at);

-- Quota rows older than 30 days are not needed (run from the SQL editor or a scheduled job):
--   delete from ai_usage_daily where day < current_date - 30;

alter table ai_usage_daily enable row level security;
alter table ai_usage_monthly enable row level security;
alter table ai_requests enable row level security;
