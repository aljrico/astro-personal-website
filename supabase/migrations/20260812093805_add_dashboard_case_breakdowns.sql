create table analytics_internal.verdoku_dashboard_case_breakdowns (
  day date primary key,
  environments jsonb not null default '[]'::jsonb,
  difficulties jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  constraint verdoku_dashboard_case_breakdowns_environments_array
    check (jsonb_typeof(environments) = 'array'),
  constraint verdoku_dashboard_case_breakdowns_difficulties_array
    check (jsonb_typeof(difficulties) = 'array')
);

alter table analytics_internal.verdoku_dashboard_case_breakdowns enable row level security;

create or replace function analytics_internal.refresh_verdoku_dashboard_case_breakdowns(
  p_from date default (now() at time zone 'UTC')::date - 2,
  p_to date default (now() at time zone 'UTC')::date
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_from is null or p_to is null or p_from > p_to or p_to - p_from > 62 then
    raise exception 'invalid dashboard case breakdown refresh range';
  end if;

  insert into analytics_internal.verdoku_dashboard_case_breakdowns as target
    (day, environments, difficulties, updated_at)
  with days as (
    select generate_series(p_from, p_to, interval '1 day')::date as day
  ),
  completions as materialized (
    select
      (e.ts at time zone 'UTC')::date as day,
      coalesce(nullif(e.properties->>'casebook', ''), 'unknown') as environment,
      coalesce(nullif(e.properties->>'difficulty', ''), 'unknown') as difficulty
    from public.events e
    where e.project_id = 'verdoku'
      and e.event_name = 'puzzle_completed'
      and e.ts >= p_from::timestamptz
      and e.ts < (p_to + 1)::timestamptz
  ),
  environment_counts as (
    select c.day, c.environment as key, count(*) as cases_solved
    from completions c
    group by c.day, c.environment
  ),
  environment_daily as (
    select
      e.day,
      jsonb_agg(
        jsonb_build_object('key', e.key, 'cases_solved', e.cases_solved)
        order by e.cases_solved desc, e.key
      ) as rows
    from environment_counts e
    group by e.day
  ),
  difficulty_counts as (
    select c.day, c.difficulty as key, count(*) as cases_solved
    from completions c
    group by c.day, c.difficulty
  ),
  difficulty_daily as (
    select
      d.day,
      jsonb_agg(
        jsonb_build_object('key', d.key, 'cases_solved', d.cases_solved)
        order by d.cases_solved desc, d.key
      ) as rows
    from difficulty_counts d
    group by d.day
  )
  select
    days.day,
    coalesce(environments.rows, '[]'::jsonb),
    coalesce(difficulties.rows, '[]'::jsonb),
    now()
  from days
  left join environment_daily environments using (day)
  left join difficulty_daily difficulties using (day)
  on conflict (day) do update set
    environments = excluded.environments,
    difficulties = excluded.difficulties,
    updated_at = excluded.updated_at;
end;
$$;

create or replace function public.get_verdoku_dashboard_case_breakdowns()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'day', b.day,
    'environments', b.environments,
    'difficulties', b.difficulties
  ) order by b.day), '[]'::jsonb)
  from analytics_internal.verdoku_dashboard_case_breakdowns b
  where b.day >= greatest(
      analytics_internal.verdoku_trusted_from(),
      (now() at time zone 'UTC')::date - 30
    )
    and b.day < (now() at time zone 'UTC')::date;
$$;

revoke all on function analytics_internal.refresh_verdoku_dashboard_case_breakdowns(date, date)
  from public, anon, authenticated;
revoke all on function public.get_verdoku_dashboard_case_breakdowns()
  from public, anon, authenticated;
grant execute on function public.get_verdoku_dashboard_case_breakdowns() to service_role;

select cron.schedule(
  'refresh-verdoku-dashboard-case-breakdowns',
  '5-59/10 * * * *',
  $$select analytics_internal.refresh_verdoku_dashboard_case_breakdowns();$$
);

select analytics_internal.refresh_verdoku_dashboard_case_breakdowns(
  greatest(
    analytics_internal.verdoku_trusted_from(),
    (now() at time zone 'UTC')::date - 30
  ),
  (now() at time zone 'UTC')::date
);
