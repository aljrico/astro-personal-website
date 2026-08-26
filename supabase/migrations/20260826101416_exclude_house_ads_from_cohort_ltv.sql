-- House interstitials are in-product Remove Ads promotions. They emit
-- `ad_shown` for funnel measurement but earn no AdMob revenue, so cohort LTV
-- must never apply an eCPM to them.
do $migration$
declare
  function_signature text;
  definition text;
  patched_definition text;
  needle constant text := 'and e.event_name = ''ad_shown''';
  replacement constant text := 'and e.event_name = ''ad_shown''
      and e.properties->>''type'' is distinct from ''house_interstitial''';
begin
  for function_signature in
    select unnest(array[
      'analytics_internal.refresh_verdoku_dashboard_revenue_cohorts(date,date)',
      'analytics_internal.refresh_verdoku_dashboard_mix_adjusted_revenue_cohorts(date,date)'
    ])
  loop
    select pg_get_functiondef(function_signature::regprocedure)
    into definition;

    if (
      length(definition) - length(replace(definition, needle, ''))
    ) / length(needle) <> 1 then
      raise exception 'expected one paid-ad predicate in %', function_signature;
    end if;

    patched_definition := replace(definition, needle, replacement);
    execute patched_definition;
  end loop;
end;
$migration$;

select analytics_internal.refresh_verdoku_dashboard_revenue_cohorts();
select analytics_internal.refresh_verdoku_dashboard_mix_adjusted_revenue_cohorts();
