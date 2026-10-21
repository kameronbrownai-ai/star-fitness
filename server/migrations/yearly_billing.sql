-- Yearly membership option.
--
-- Records whether a subscription is billed monthly or yearly. Needed because
-- the webhook can no longer infer the tier from the payment amount alone:
-- Training is $5/month or $50/year and Elite is $14.99/month or $149.99/year,
-- so a $50 yearly Training payment is larger than a monthly Elite one. The
-- interval has to be stored, not guessed.
--
-- Safe to re-run. Existing rows are monthly, which is what they are.

alter table public.subscriptions
  add column if not exists billing_interval text default 'month';

-- Only the two values Stripe gives us for these plans.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'subscriptions_billing_interval_check'
  ) then
    alter table public.subscriptions
      add constraint subscriptions_billing_interval_check
      check (billing_interval in ('month', 'year'));
  end if;
end $$;

comment on column public.subscriptions.billing_interval is
  'month | year. Set from the Stripe price''s recurring.interval by the webhook.';

-- PostgREST caches the schema; without this the API reports the new column
-- as missing until the next restart.
notify pgrst, 'reload schema';
