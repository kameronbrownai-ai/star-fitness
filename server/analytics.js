// Server-side analytics.
//
// Stripe Payment Links send the buyer to buy.stripe.com, so the browser never
// sees a completed payment. Tracking "purchase" on the redirect would count
// every abandoned checkout as a sale. These four events therefore fire here,
// from the webhook, where Stripe has actually confirmed the money.
//
// Same rules as the client module (src/lib/analytics.js):
//   - No PII. Never a Stripe customer email, name, or address.
//   - Nothing is sent unless the keys are configured.
//   - A tracking failure must never fail a webhook. Stripe retries on a
//     non-2xx, and a retry would re-run the real business logic.
//
// Config (server/.env):
//   POSTHOG_KEY       project API key, same public phc_ key as the frontend
//   POSTHOG_HOST      https://us.i.posthog.com or the EU host
//   GA4_MEASUREMENT_ID   G-XXXXXXXXXX
//   GA4_API_SECRET    Admin > Data streams > Measurement Protocol API secrets.
//                     This one IS a secret and belongs only in .env.

const POSTHOG_KEY = process.env.POSTHOG_KEY || ''
const POSTHOG_HOST = process.env.POSTHOG_HOST || 'https://us.i.posthog.com'
const GA4_MEASUREMENT_ID = process.env.GA4_MEASUREMENT_ID || ''
const GA4_API_SECRET = process.env.GA4_API_SECRET || ''

// GA4 rejects dots in event names and reserves `purchase` for its own
// ecommerce reporting, which is exactly where these belong.
const GA4_RENAMES = {
  'order.completed': 'purchase',
  'subscription.started': 'purchase',
  'subscription.cancelled': 'refund',
}

/**
 * Sends one server-side event to PostHog and GA4.
 *
 * @param {string} event      name from .telemetry/tracking-plan.yaml
 * @param {string|null} userId  Supabase user id, or null when unknown
 * @param {object} props      event properties. No PII.
 *
 * Never throws and never rejects. Fire and forget.
 */
export async function trackServer(event, userId, props = {}) {
  const tasks = []

  if (POSTHOG_KEY) {
    tasks.push(
      fetch(`${POSTHOG_HOST}/i/v0/e/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: POSTHOG_KEY,
          event,
          // A purchase with no known user still matters; bucket it under a
          // stable anonymous id rather than dropping the revenue entirely.
          distinct_id: userId || `anon_stripe_${props.stripe_event_id || 'unknown'}`,
          properties: { ...props, $lib: 'star-fitness-api' },
          timestamp: new Date().toISOString(),
        }),
      })
    )
  }

  if (GA4_MEASUREMENT_ID && GA4_API_SECRET) {
    const name = GA4_RENAMES[event] || event.replace(/\./g, '_')
    tasks.push(
      fetch(
        `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // GA4 requires a client_id. Server events have no browser, so the
            // user id stands in; sessions will not stitch to the web journey,
            // which is the accepted tradeoff for seeing revenue at all.
            client_id: userId || `server.${Date.now()}`,
            ...(userId ? { user_id: userId } : {}),
            non_personalized_ads: true,
            events: [{ name, params: props }],
          }),
        }
      )
    )
  }

  if (!tasks.length) return

  try {
    await Promise.allSettled(tasks)
  } catch (err) {
    // Swallowed on purpose. A 500 here would make Stripe retry the webhook
    // and re-run the subscription logic above it.
    console.error('analytics (server):', err?.message)
  }
}
