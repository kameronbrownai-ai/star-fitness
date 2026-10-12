// Analytics configuration.
//
// Both values below are PUBLIC client-side identifiers, the same category as
// the Stripe Payment Links in src/config/stripe.js and the Supabase
// publishable key. The PostHog project key is write-only: it can send events
// and nothing else. The GA4 measurement ID is visible in any page source on
// the web. Neither is a secret and neither belongs in server/.env.
//
// The GA4 Measurement Protocol *api_secret* used for server-side events IS a
// secret. That one lives in server/.env as GA4_API_SECRET and never appears
// in this file or anywhere in the frontend.
//
// Until these are filled in, src/lib/analytics.js is a no-op. Nothing breaks,
// nothing is sent.

/** PostHog project API key, from Project settings, starts with `phc_`. */
export const POSTHOG_KEY = ''

/** PostHog region host: https://us.i.posthog.com or https://eu.i.posthog.com */
export const POSTHOG_HOST = 'https://us.i.posthog.com'

/** GA4 measurement ID, from Admin > Data streams, looks like G-XXXXXXXXXX. */
export const GA4_ID = ''

// Supabase user ids that must never produce analytics. Founder and staff
// accounts go here. Test data from these accounts has already corrupted a real
// athlete's progress chart in this project; in analytics the same mistake
// would be quieter and much harder to spot, so the guard is in the code rather
// than in a dashboard filter.
//
// Anyone on the `comp` tier (boss-code holders) is excluded automatically and
// does not need to be listed here.
export const INTERNAL_USER_IDS = []

// Analytics only runs on the real production hostnames. Local development,
// preview tunnels and anything else stay silent.
export const PRODUCTION_HOSTS = ['starmat.app', 'www.starmat.app']
