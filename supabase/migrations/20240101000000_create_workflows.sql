create table workflows (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  data jsonb,
  edges jsonb,
  category text default 'General',
  thumbnail text,
  is_published boolean default false,
  is_template boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table node_runs (
  id uuid default uuid_generate_v4() primary key,
  workflow_id uuid references workflows on delete cascade,
  node_id text not null,
  status text,
  result jsonb,
  started_at timestamp default now(),
  completed_at timestamp
);

create table workflow_runs (
  id uuid default uuid_generate_v4() primary key,
  workflow_id uuid references workflows on delete cascade,
  status text,
  started_at timestamp default now(),
  completed_at timestamp,
  cost numeric default 0
);

create index on workflows(user_id);
create index on workflow_runs(workflow_id);
create index on node_runs(workflow_id);