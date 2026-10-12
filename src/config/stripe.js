// Public Stripe Payment Links (safe to ship in the frontend, these are the
// customer-facing checkout URLs, not secret API keys).

// One-time mat purchases, keyed by product id from src/pages/Shop.jsx.
export const STRIPE_LINKS = {
  1: 'https://buy.stripe.com/8x200j5gh7lUaBbc0y67S06', // Star Mat Pro 2.0, $249
  2: 'https://buy.stripe.com/3cIcN56kl0XwdNn4y667S05', // Star Mat Lite, $199
}

// Analytics labels and list prices for the payable products above. Kept here
// beside the links so the two cannot drift apart. Prices are the list price
// used for the checkout.started event only; Stripe remains the source of
// truth for what is actually charged.
export const STRIPE_ITEMS = {
  1: { key: 'mat_pro', value: 249 },
  2: { key: 'mat_lite', value: 199 },
}

// Recurring subscription checkout links.
// NOTE: these collect payment, but do NOT unlock gated content on their own, // that requires the account/login + backend tier system (not built yet).
export const SUBSCRIPTION_LINKS = {
  tier2: 'https://buy.stripe.com/dRm7sLgYZgWueRre8G67S07', // Tier 2, $5/mo
  tier3: 'https://buy.stripe.com/9B6fZh389gWu4cNe8G67S08', // Tier 3, $14.99/mo
}
