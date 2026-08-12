create table analytics_internal.verdoku_dashboard_revenue_sources (
  day date not null,
  source text not null,
  revenue_usd numeric(14, 4) not null default 0 check (revenue_usd >= 0),
  updated_at timestamptz not null default now(),
  primary key (day, source)
);

alter table analytics_internal.verdoku_dashboard_revenue_sources enable row level security;
revoke all on analytics_internal.verdoku_dashboard_revenue_sources
  from public, anon, authenticated;

create or replace function analytics_internal.refresh_verdoku_dashboard_revenue_sources(
  p_from date default greatest(date '2026-07-14', (now() at time zone 'UTC')::date - 2),
  p_to date default (now() at time zone 'UTC')::date
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
    raise exception 'invalid dashboard revenue source refresh range';
  end if;

  delete from analytics_internal.verdoku_dashboard_revenue_sources
  where day between p_from and p_to;

  insert into analytics_internal.verdoku_dashboard_revenue_sources (
    day,
    source,
    revenue_usd,
    updated_at
  )
  with iap as (
    select
      (purchase.purchased_at at time zone 'UTC')::date as day,
      case
        when purchase.product_id like '%no_ads%' then 'remove_ads'
        when purchase.product_id like 'tinycrimes_hints%' then 'hints'
        when purchase.product_id like 'tinycrimes_%_unlock' then
          replace(replace(purchase.product_id, 'tinycrimes_', ''), '_unlock', '')
        else 'other_iap'
      end as source,
      sum(purchase.price_usd) as revenue_usd
    from public.purchases purchase
    where purchase.project_id = 'verdoku'
      and purchase.environment = 'PRODUCTION'
      and purchase.event_type in ('INITIAL_PURCHASE', 'NON_RENEWING_PURCHASE', 'RENEWAL')
      and purchase.price_usd > 0
      and purchase.purchased_at >= p_from::timestamptz
      and purchase.purchased_at < (p_to + 1)::timestamptz
    group by 1, 2
  ),
  ads as (
    select
      daily.day,
      'ads'::text as source,
      daily.ad_revenue_usd as revenue_usd
    from analytics_internal.verdoku_dashboard_daily daily
    where daily.day between p_from and p_to
      and daily.ad_revenue_usd > 0
  ),
  revenue as (
    select * from iap
    union all
    select * from ads
  )
  select
    revenue.day,
    revenue.source,
    round(sum(revenue.revenue_usd), 4),
    now()
  from revenue
  group by revenue.day, revenue.source;
end;
$$;

revoke execute on function analytics_internal.refresh_verdoku_dashboard_revenue_sources(date, date)
  from public, anon, authenticated;

create or replace function public.get_verdoku_dashboard_revenue_sources()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'day', revenue.day,
    'source', revenue.source,
    'revenue_usd', revenue.revenue_usd
  ) order by revenue.day, revenue.source), '[]'::jsonb)
  from analytics_internal.verdoku_dashboard_revenue_sources revenue
  where revenue.day >= greatest(
      date '2026-07-14',
      (now() at time zone 'UTC')::date - 30
    )
    and revenue.day < (now() at time zone 'UTC')::date;
$$;

revoke execute on function public.get_verdoku_dashboard_revenue_sources()
  from public, anon, authenticated;
grant execute on function public.get_verdoku_dashboard_revenue_sources() to service_role;

select analytics_internal.refresh_verdoku_dashboard_revenue_sources(
  date '2026-07-14',
  (now() at time zone 'UTC')::date
);

select cron.schedule(
  'refresh-verdoku-dashboard-revenue-sources',
  '7-59/10 * * * *',
  $$set statement_timeout to '2min';
    select analytics_internal.refresh_verdoku_dashboard_revenue_sources();$$
);
