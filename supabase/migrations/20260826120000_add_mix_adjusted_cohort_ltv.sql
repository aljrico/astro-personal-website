-- Directly standardize each daily cohort to one immutable country x platform
-- distribution. The raw cohort plot remains the source of actual business LTV;
-- this series isolates within-stratum changes in product monetization.
create table analytics_internal.verdoku_dashboard_mix_adjusted_revenue_cohorts (
  cohort_day date not null,
  day_n smallint not null check (day_n in (0, 3, 7, 14, 28)),
  cohort_size bigint not null check (cohort_size >= 0),
  revenue_per_install_usd numeric(14, 6) not null default 0,
  reference_mix_coverage numeric(7, 6) not null check (
    reference_mix_coverage between 0 and 1
  ),
  updated_at timestamptz not null default now(),
  primary key (cohort_day, day_n)
);

alter table analytics_internal.verdoku_dashboard_mix_adjusted_revenue_cohorts
  enable row level security;
revoke all on analytics_internal.verdoku_dashboard_mix_adjusted_revenue_cohorts
  from public, anon, authenticated;

create or replace function analytics_internal.refresh_verdoku_dashboard_mix_adjusted_revenue_cohorts(
  p_from date default greatest(date '2026-07-14', (now() at time zone 'UTC')::date - 60),
  p_to date default (now() at time zone 'UTC')::date - 1
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_from is null
    or p_to is null
    or p_from > p_to
    or p_from < date '2026-07-14'
    or p_to > (now() at time zone 'UTC')::date
    or p_to - p_from > 62
  then
    raise exception 'invalid mix-adjusted cohort revenue refresh range';
  end if;

  delete from analytics_internal.verdoku_dashboard_mix_adjusted_revenue_cohorts
  where cohort_day between p_from and p_to;

  insert into analytics_internal.verdoku_dashboard_mix_adjusted_revenue_cohorts (
    cohort_day,
    day_n,
    cohort_size,
    revenue_per_install_usd,
    reference_mix_coverage,
    updated_at
  )
  with
  ecpm(country, ecpm_eur) as (
    values
      ('ES', 3.51::numeric), ('US', 16.09), ('UA', 3.44), ('NL', 6.55),
      ('PT', 3.39), ('DE', 6.59), ('CA', 8.42), ('AR', 2.31),
      ('CO', 3.28), ('GB', 7.73), ('MX', 5.46), ('CL', 3.61),
      ('IT', 2.80), ('AU', 13.03), ('PL', 4.25), ('BE', 4.66),
      ('PE', 2.65), ('TW', 7.74), ('GR', 3.89), ('BR', 3.38),
      ('FR', 4.64), ('NO', 6.24), ('RU', 0.00)
  ),
  reference_country_counts as materialized (
    select
      coalesce(i.first_country, 'ZZ') as country,
      count(*)::bigint as installs
    from public.installs i
    where i.project_id = 'verdoku'
      and i.first_seen_day between date '2026-07-14' and date '2026-08-12'
    group by 1
  ),
  reference_countries as materialized (
    select country
    from reference_country_counts
    where installs >= 100
  ),
  reference_strata as materialized (
    select
      case
        when reference_country.country is not null then coalesce(i.first_country, 'ZZ')
        else 'OTHER'
      end as country_group,
      i.first_platform as platform,
      count(*)::numeric as installs
    from public.installs i
    left join reference_countries reference_country
      on reference_country.country = coalesce(i.first_country, 'ZZ')
    where i.project_id = 'verdoku'
      and i.first_seen_day between date '2026-07-14' and date '2026-08-12'
    group by 1, 2
  ),
  reference_weights as materialized (
    select
      country_group,
      platform,
      installs / sum(installs) over () as weight
    from reference_strata
  ),
  cohort_strata as materialized (
    select
      i.first_seen_day as cohort_day,
      case
        when reference_country.country is not null then coalesce(i.first_country, 'ZZ')
        else 'OTHER'
      end as country_group,
      i.first_platform as platform,
      count(*)::bigint as installs
    from public.installs i
    left join reference_countries reference_country
      on reference_country.country = coalesce(i.first_country, 'ZZ')
    where i.project_id = 'verdoku'
      and i.first_seen_day between p_from and p_to
    group by 1, 2, 3
  ),
  cohort_sizes as materialized (
    select cohort_day, sum(installs)::bigint as cohort_size
    from cohort_strata
    group by cohort_day
  ),
  ad_daily as materialized (
    select
      i.first_seen_day as cohort_day,
      case
        when reference_country.country is not null then coalesce(i.first_country, 'ZZ')
        else 'OTHER'
      end as country_group,
      i.first_platform as platform,
      ((e.ts at time zone 'UTC')::date - i.first_seen_day)::int as age_day,
      sum(coalesce(x.ecpm_eur, 3.82) * 1.09 / 1000.0) as revenue_usd
    from public.events e
    join public.installs i
      on i.project_id = e.project_id
     and i.install_id = e.install_id
    left join reference_countries reference_country
      on reference_country.country = coalesce(i.first_country, 'ZZ')
    left join ecpm x on x.country = e.country
    where e.project_id = 'verdoku'
      and e.event_name = 'ad_shown'
      and e.ts >= p_from::timestamptz
      and e.ts < (p_to + 29)::timestamptz
      and i.first_seen_day between p_from and p_to
      and (e.ts at time zone 'UTC')::date between i.first_seen_day and i.first_seen_day + 28
    group by 1, 2, 3, 4
  ),
  iap_daily as materialized (
    select
      i.first_seen_day as cohort_day,
      case
        when reference_country.country is not null then coalesce(i.first_country, 'ZZ')
        else 'OTHER'
      end as country_group,
      i.first_platform as platform,
      ((purchase.purchased_at at time zone 'UTC')::date - i.first_seen_day)::int as age_day,
      sum(purchase.price_usd) as revenue_usd
    from public.purchases purchase
    cross join lateral (
      select e.install_id
      from public.events e
      where e.project_id = 'verdoku'
        and e.event_name = 'purchase'
        and e.properties->>'product' = purchase.product_id
        and (
          (purchase.store = 'APP_STORE' and e.platform = 'ios')
          or (purchase.store = 'PLAY_STORE' and e.platform = 'android')
        )
        and e.ts between purchase.purchased_at - interval '3 minutes'
                     and purchase.purchased_at + interval '3 minutes'
      order by abs(extract(epoch from (e.ts - purchase.purchased_at))), e.event_id
      limit 1
    ) matched_event
    join public.installs i
      on i.project_id = 'verdoku'
     and i.install_id = matched_event.install_id
    left join reference_countries reference_country
      on reference_country.country = coalesce(i.first_country, 'ZZ')
    where purchase.project_id = 'verdoku'
      and purchase.environment = 'PRODUCTION'
      and purchase.event_type in ('INITIAL_PURCHASE', 'NON_RENEWING_PURCHASE', 'RENEWAL')
      and purchase.price_usd > 0
      and purchase.purchased_at >= p_from::timestamptz
      and purchase.purchased_at < (p_to + 29)::timestamptz
      and i.first_seen_day between p_from and p_to
      and (purchase.purchased_at at time zone 'UTC')::date
        between i.first_seen_day and i.first_seen_day + 28
    group by 1, 2, 3, 4
  ),
  revenue_daily as (
    select * from ad_daily
    union all
    select * from iap_daily
  ),
  checkpoints(day_n) as (
    values (0::smallint), (3::smallint), (7::smallint), (14::smallint), (28::smallint)
  ),
  stratum_ltv as (
    select
      cohort.cohort_day,
      checkpoint.day_n,
      cohort.country_group,
      cohort.platform,
      cohort.installs,
      coalesce(sum(revenue.revenue_usd), 0) / nullif(cohort.installs, 0) as ltv_usd
    from cohort_strata cohort
    cross join checkpoints checkpoint
    left join revenue_daily revenue
      on revenue.cohort_day = cohort.cohort_day
     and revenue.country_group = cohort.country_group
     and revenue.platform = cohort.platform
     and revenue.age_day between 0 and checkpoint.day_n
    where cohort.cohort_day + checkpoint.day_n < (now() at time zone 'UTC')::date
    group by 1, 2, 3, 4, 5
  ),
  adjusted as (
    select
      cell.cohort_day,
      cell.day_n,
      size.cohort_size,
      sum(weight.weight * cell.ltv_usd) / nullif(sum(weight.weight), 0)
        as revenue_per_install_usd,
      sum(weight.weight) as reference_mix_coverage
    from stratum_ltv cell
    join reference_weights weight
      on weight.country_group = cell.country_group
     and weight.platform = cell.platform
    join cohort_sizes size on size.cohort_day = cell.cohort_day
    where size.cohort_size >= 100
    group by 1, 2, 3
  )
  select
    adjusted.cohort_day,
    adjusted.day_n,
    adjusted.cohort_size,
    round(adjusted.revenue_per_install_usd, 6),
    round(adjusted.reference_mix_coverage, 6),
    now()
  from adjusted
  where adjusted.reference_mix_coverage >= 0.8;
end;
$$;

revoke execute on function analytics_internal.refresh_verdoku_dashboard_mix_adjusted_revenue_cohorts(date, date)
  from public, anon, authenticated;

create or replace function public.get_verdoku_dashboard_mix_adjusted_cohort_revenue()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  with bounds as (
    select (now() at time zone 'UTC')::date as today
  ),
  eligible as (
    select revenue.*, bounds.today
    from analytics_internal.verdoku_dashboard_mix_adjusted_revenue_cohorts revenue
    cross join bounds
    where revenue.cohort_day + revenue.day_n < bounds.today
      and revenue.cohort_day >= greatest(
        date '2026-07-14',
        bounds.today - (revenue.day_n::int + 30)
      )
      and revenue.cohort_size >= 100
      and revenue.reference_mix_coverage >= 0.8
  ),
  by_checkpoint as (
    select
      revenue.day_n,
      revenue.today - revenue.day_n::int - 1 as matured_through,
      greatest(date '2026-07-14', revenue.today - (revenue.day_n::int + 30)) as window_from,
      min(revenue.cohort_day) as cohort_from,
      max(revenue.cohort_day) as cohort_to,
      count(*) as cohorts,
      sum(revenue.cohort_size) as cohort_size,
      round(avg(revenue.reference_mix_coverage), 6) as reference_mix_coverage,
      jsonb_agg(jsonb_build_object(
        'cohort_day', revenue.cohort_day,
        'cohort_size', revenue.cohort_size,
        'revenue_per_install_usd', revenue.revenue_per_install_usd,
        'reference_mix_coverage', revenue.reference_mix_coverage
      ) order by revenue.cohort_day) as points
    from eligible revenue
    group by revenue.day_n, revenue.today
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'day_n', checkpoint.day_n,
    'matured_through', checkpoint.matured_through,
    'window_from', checkpoint.window_from,
    'cohort_from', checkpoint.cohort_from,
    'cohort_to', checkpoint.cohort_to,
    'cohorts', checkpoint.cohorts,
    'cohort_size', checkpoint.cohort_size,
    'reference_mix_coverage', checkpoint.reference_mix_coverage,
    'min_cohort_size', 100,
    'min_reference_mix_coverage', 0.8,
    'reference_mix_from', '2026-07-14',
    'reference_mix_to', '2026-08-12',
    'points', checkpoint.points
  ) order by checkpoint.day_n), '[]'::jsonb)
  from by_checkpoint checkpoint;
$$;

revoke execute on function public.get_verdoku_dashboard_mix_adjusted_cohort_revenue()
  from public, anon, authenticated;
grant execute on function public.get_verdoku_dashboard_mix_adjusted_cohort_revenue()
  to service_role;

select analytics_internal.refresh_verdoku_dashboard_mix_adjusted_revenue_cohorts();

select cron.schedule(
  'verdoku-dashboard-mix-adjusted-cohort-revenue-daily',
  '31 0 * * *',
  $$set statement_timeout to '8min';
    select analytics_internal.refresh_verdoku_dashboard_mix_adjusted_revenue_cohorts();$$
);
