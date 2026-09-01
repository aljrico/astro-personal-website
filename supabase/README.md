# Supabase ownership

This repository owns only the `verdoku-dashboard` Edge Function and its website
client.

The database schema, migrations, RPCs, cron jobs, retention policy, and access
controls belong to `../flama-backend/supabase`. Do not create or push database
migrations from this repository. A fresh environment must apply the backend
migrations before deploying this Edge Function.

When the dashboard needs a database change:

1. Implement, test, and deploy the migration from `flama-backend`.
2. Update `supabase/functions/verdoku-dashboard` or the Astro page here if the
   RPC contract changed.
3. Test the live RPC response before deploying the website.
