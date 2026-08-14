create or replace function public.get_verdoku_dashboard_hourly_players()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  with bounds as (
    select date_trunc('hour', now()) as current_hour
  ),
  hours as (
    select generate_series(
      current_hour - interval '71 hours',
      current_hour,
      interval '1 hour'
    ) as hour
    from bounds
  ),
  platforms(platform, platform_order) as (
    values ('ios'::text, 1), ('android'::text, 2)
  ),
  players as (
    select
      date_trunc('hour', event.ts) as hour,
      event.platform,
      count(distinct event.install_id) as players
    from public.events event
    cross join bounds
    where event.project_id = 'verdoku'
      and event.event_name = 'session_start'
      and event.ts >= current_hour - interval '71 hours'
      and event.ts < current_hour + interval '1 hour'
    group by 1, event.platform
  )
  select jsonb_agg(jsonb_build_object(
    'hour', hours.hour,
    'platform', platforms.platform,
    'players', coalesce(players.players, 0),
    'partial', hours.hour = bounds.current_hour
  ) order by hours.hour, platforms.platform_order)
  from hours
  cross join bounds
  cross join platforms
  left join players using (hour, platform);
$$;

revoke execute on function public.get_verdoku_dashboard_hourly_players()
  from public, anon, authenticated;
grant execute on function public.get_verdoku_dashboard_hourly_players() to service_role;
