alter table analytics_internal.verdoku_dashboard_revenue_cohorts
  drop constraint verdoku_dashboard_revenue_cohorts_day_n_check,
  add constraint verdoku_dashboard_revenue_cohorts_day_n_check
    check (day_n in (0, 3, 7, 14, 28));

create or replace function analytics_internal.refresh_verdoku_dashboard_revenue_cohorts(
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
    raise exception 'invalid dashboard cohort revenue refresh range';
  end if;

  delete from analytics_internal.verdoku_dashboard_revenue_cohorts
  where cohort_day between p_from and p_to;

  insert into analytics_internal.verdoku_dashboard_revenue_cohorts (
    cohort_day,
    day_n,
    cohort_size,
    ad_revenue_usd,
    iap_revenue_usd,
    revenue_usd,
    revenue_per_install_usd,
    iap_transactions,
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
  cohorts as materialized (
    select
      i.first_seen_day as cohort_day,
      count(*)::bigint as cohort_size
    from public.installs i
    where i.project_id = 'verdoku'
      and i.first_seen_day between p_from and p_to
    group by i.first_seen_day
  ),
  ad_daily as materialized (
    select
      i.first_seen_day as cohort_day,
      ((e.ts at time zone 'UTC')::date - i.first_seen_day)::int as age_day,
      sum(coalesce(x.ecpm_eur, 3.82) * 1.09 / 1000.0) as ad_revenue_usd
    from public.events e
    join public.installs i
      on i.project_id = e.project_id
     and i.install_id = e.install_id
    left join ecpm x on x.country = e.country
    where e.project_id = 'verdoku'
      and e.event_name = 'ad_shown'
      and e.ts >= p_from::timestamptz
      and e.ts < (p_to + 29)::timestamptz
      and i.first_seen_day between p_from and p_to
      and (e.ts at time zone 'UTC')::date between i.first_seen_day and i.first_seen_day + 28
    group by 1, 2
  ),
  iap_daily as materialized (
    select
      i.first_seen_day as cohort_day,
      ((purchase.purchased_at at time zone 'UTC')::date - i.first_seen_day)::int as age_day,
      sum(purchase.price_usd) as iap_revenue_usd,
      count(*)::bigint as iap_transactions
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
    where purchase.project_id = 'verdoku'
      and purchase.environment = 'PRODUCTION'
      and purchase.event_type in ('INITIAL_PURCHASE', 'NON_RENEWING_PURCHASE', 'RENEWAL')
      and purchase.price_usd > 0
      and purchase.purchased_at >= p_from::timestamptz
      and purchase.purchased_at < (p_to + 29)::timestamptz
      and i.first_seen_day between p_from and p_to
      and (purchase.purchased_at at time zone 'UTC')::date
        between i.first_seen_day and i.first_seen_day + 28
    group by 1, 2
  ),
  revenue_daily as (
    select
      cohort_day,
      age_day,
      ad_revenue_usd,
      0::numeric as iap_revenue_usd,
      0::bigint as iap_transactions
    from ad_daily
    union all
    select
      cohort_day,
      age_day,
      0::numeric,
      iap_revenue_usd,
      iap_transactions
    from iap_daily
  ),
  checkpoints(day_n) as (
    values (0::smallint), (3::smallint), (7::smallint), (14::smallint), (28::smallint)
  ),
  totals as (
    select
      c.cohort_day,
      checkpoint.day_n,
      c.cohort_size,
      coalesce(sum(revenue.ad_revenue_usd), 0) as ad_revenue_usd,
      coalesce(sum(revenue.iap_revenue_usd), 0) as iap_revenue_usd,
      coalesce(sum(revenue.iap_transactions), 0)::bigint as iap_transactions
    from cohorts c
    cross join checkpoints checkpoint
    left join revenue_daily revenue
      on revenue.cohort_day = c.cohort_day
     and revenue.age_day between 0 and checkpoint.day_n
    where c.cohort_day + checkpoint.day_n < (now() at time zone 'UTC')::date
      and c.cohort_size >= 100
    group by c.cohort_day, checkpoint.day_n, c.cohort_size
  )
  select
    t.cohort_day,
    t.day_n,
    t.cohort_size,
    round(t.ad_revenue_usd, 4),
    round(t.iap_revenue_usd, 4),
    round(t.ad_revenue_usd + t.iap_revenue_usd, 4),
    round((t.ad_revenue_usd + t.iap_revenue_usd) / nullif(t.cohort_size, 0), 6),
    t.iap_transactions,
    now()
  from totals t;
end;
$$;

revoke execute on function analytics_internal.refresh_verdoku_dashboard_revenue_cohorts(date, date)
  from public, anon, authenticated;

select analytics_internal.refresh_verdoku_dashboard_revenue_cohorts(
  date '2026-07-14',
  (now() at time zone 'UTC')::date - 1
);
