-- ─── GovTrace Schema ────────────────────────────────────────────────────────
-- Run this entire file in: Supabase → SQL Editor → New query → Run

-- Citizens
create table if not exists citizens (
  id                text primary key,
  masked_pan_id     text not null,
  name              text not null,
  annual_income     bigint not null,
  direct_tax        bigint not null,
  indirect_tax      bigint not null,
  total_tax         bigint not null,
  tax_bracket       text not null,
  occupation_type   text not null,
  avatar_initials   text not null,
  traces_verified   boolean not null default true
);

-- Representatives
create table if not exists representatives (
  id                      text primary key,
  level                   text not null,
  name                    text not null,
  party                   text not null,
  constituency            text not null,
  constituency_body       text not null,
  constituency_tax_pool   bigint not null,
  house_vote_weight       float not null,
  elected                 date not null,
  term                    text not null,
  photo_initials          text not null,
  bio                     text not null
);

-- Bills
create table if not exists bills (
  id            text primary key,
  title         text not null,
  date          date not null,
  level         text not null,
  description   text not null,
  rep_vote      text not null,
  rep_id        text references representatives(id),
  aye_count     int not null,
  nay_count     int not null,
  abstain_count int not null,
  result        text not null
);

-- Spending items (category headers)
create table if not exists spending_items (
  id            text primary key,
  head          text not null,
  pct           int not null,
  amount        bigint not null,
  accent_color  text not null
);

-- Spending line items
create table if not exists spending_line_items (
  id                text primary key,
  spending_item_id  text references spending_items(id),
  name              text not null,
  amount            bigint not null,
  pct_of_head       int not null,
  status            text not null,
  days_in_status    int not null,
  vendor            text not null,
  vendor_link       text not null,
  ratings_on_track  int not null default 0,
  ratings_neutral   int not null default 0,
  ratings_stalled   int not null default 0
);

-- Budget vs Actuals
create table if not exists budget_actuals (
  id            text primary key,
  head          text not null,
  budgeted      bigint not null,
  actual        bigint not null,
  accent_color  text not null
);

-- Agenda items
create table if not exists agenda_items (
  id                        text primary key,
  title                     text not null,
  description               text not null,
  raised_by                 text not null,
  level                     text not null,
  cumulative_weighted_vote  bigint not null default 0
);

-- Manifesto promises
create table if not exists manifesto_promises (
  id                    text primary key,
  rep_id                text references representatives(id),
  promise               text not null,
  status                text not null,
  evidence              text not null,
  verifications_delivered int not null default 0,
  verifications_partial   int not null default 0,
  verifications_not       int not null default 0
);

-- Comments
create table if not exists comments (
  id                text primary key default gen_random_uuid()::text,
  thread_id         text not null,
  masked_pan_id     text not null,
  name              text not null,
  avatar_initials   text not null,
  tax_contribution  bigint not null,
  text              text not null,
  weighted_upvotes  bigint not null default 0,
  created_at        timestamptz not null default now()
);

-- Notifications
create table if not exists notifications (
  id          text primary key,
  type        text not null,
  read        boolean not null default false,
  timestamp   timestamptz not null,
  title       text not null,
  description text not null,
  target_tab  text not null
);

-- Forum agenda (aggregated)
create table if not exists forum_agenda (
  id                  text primary key,
  title               text not null,
  description         text not null,
  level               text not null,
  aggregated_tokens   int not null default 0,
  top_raised_by       text not null
);

-- ─── Enable Row Level Security (public read-only) ─────────────────────────────
alter table citizens             enable row level security;
alter table representatives      enable row level security;
alter table bills                enable row level security;
alter table spending_items       enable row level security;
alter table spending_line_items  enable row level security;
alter table budget_actuals       enable row level security;
alter table agenda_items         enable row level security;
alter table manifesto_promises   enable row level security;
alter table comments             enable row level security;
alter table notifications        enable row level security;
alter table forum_agenda         enable row level security;

-- Allow public read on all tables
create policy "public read citizens"            on citizens            for select using (true);
create policy "public read representatives"     on representatives     for select using (true);
create policy "public read bills"               on bills               for select using (true);
create policy "public read spending_items"      on spending_items      for select using (true);
create policy "public read spending_line_items" on spending_line_items for select using (true);
create policy "public read budget_actuals"      on budget_actuals      for select using (true);
create policy "public read agenda_items"        on agenda_items        for select using (true);
create policy "public read manifesto_promises"  on manifesto_promises  for select using (true);
create policy "public read comments"            on comments            for select using (true);
create policy "public read notifications"       on notifications       for select using (true);
create policy "public read forum_agenda"        on forum_agenda        for select using (true);

-- Allow public insert on comments (citizens can post)
create policy "public insert comments" on comments for insert with check (true);

-- Allow public update on comments upvotes, ratings, verifications
create policy "public update comments"              on comments             for update using (true);
create policy "public update spending_line_items"   on spending_line_items  for update using (true);
create policy "public update manifesto_promises"    on manifesto_promises   for update using (true);
create policy "public update agenda_items"          on agenda_items         for update using (true);
create policy "public update notifications"         on notifications        for update using (true);
