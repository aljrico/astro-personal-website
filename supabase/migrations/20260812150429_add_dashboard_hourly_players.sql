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
      current_hour - interval '47 hours',
      current_hour,
      interval '1 hour'
    ) as hour
    from bounds
  ),
  players as (
    select
      date_trunc('hour', event.ts) as hour,
      count(distinct event.install_id) as players
    from public.events event
    cross join bounds
    where event.project_id = 'verdoku'
      and event.event_name = 'session_start'
      and event.ts >= current_hour - interval '47 hours'
      and event.ts < current_hour + interval '1 hour'
    group by 1
  )
  select jsonb_agg(jsonb_build_object(
    'hour', hours.hour,
    'players', coalesce(players.players, 0),
    'partial', hours.hour = bounds.current_hour
  ) order by hours.hour)
  from hours
  cross join bounds
  left join players using (hour);
$$;

revoke execute on function public.get_verdoku_dashboard_hourly_players()
  from public, anon, authenticated;
grant execute on function public.get_verdoku_dashboard_hourly_players() to service_role;
