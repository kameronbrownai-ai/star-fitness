# Delta: Current → Target

**Current state: greenfield.** I checked the codebase and the live bundle — no
PostHog, no GA4, no Segment, no Plausible, no gtag, no pixel of any kind. There
is nothing to keep, rename, or remove.

So the delta is the whole plan: **24 events to add, 0 to remove, 0 to rename,
0 kept.** (ADD 24 + RENAME 0 + KEEP 0 = 24 target events.)

What follows is the order to build them in, not just a list.

---

## Phase 1 — Before launch, non-negotiable (9 events)

These answer "is the business working". Without them you launch blind on
revenue and on the one feature most likely to fail.

| Event | Source | Why it cannot wait |
|---|---|---|
| `checkout.started` | client | Last thing you can see before Stripe takes over |
| `order.completed` | **server** | Hardware revenue. Webhook only |
| `subscription.started` | **server** | Recurring revenue. Webhook only |
| `subscription.cancelled` | **server** | Churn. Webhook only |
| `user.signed_up` | client | Top of every funnel |
| `assessment.started` | client | Denominator for activation |
| `assessment.completed` | client | The activation moment |
| `assessment.camera_denied` | client | A hard stop that is invisible today |
| `promo_code.redeemed` | server | Early warning if the boss code leaks |

**The one that matters most:** `checkout.started` paired with `order.completed`.
Payment Links send people to `buy.stripe.com`, so right now the entire paid
conversion is unobservable. These two events, and only these two, tell you how
many people reach Stripe and how many come back with money. Given that the
revenue path has never been run end to end, this pair is also your smoke test.

## Phase 2 — First two weeks after launch (8 events)

Once people are arriving, these tell you whether they stay.

| Event | Source | Question it answers |
|---|---|---|
| `user.signed_in` | client | New vs returning |
| `assessment.abandoned` | client | Where in five moves people quit |
| `workout.logged` | client | Is anyone actually training |
| `coach_chat.message_sent` | client | Depth of AI Coach use, and how much of it is anonymous |
| `trial.started` | client | Trial → paid conversion |
| `consent.accepted` | client | Auditable consent count |
| `onboarding.completed` | client | Sport mix of real users |
| `score.shared` | client | Does anyone use sharing |

## Phase 3 — When the features have users (7 events)

No point instrumenting a leaderboard with four people on it.

| Event | Source |
|---|---|
| `team.created` | client |
| `team.joined` | client |
| `team.left` | client |
| `score.share_viewed` | client |
| `test_session.created` | client |
| `test_session.capture_added` | client |
| `test_session.exported` | client |

---

## Architecture decisions

**One tracking module, two destinations.** `src/lib/analytics.js` exposes
`track()`, `identify()`, `group()`. It fans out to PostHog and GA4 so no call
site ever knows which tools exist. Swapping or dropping a destination later is
a one-file change.

**Server events go server-side.** The four Stripe events fire from the webhook
handler in `server/`, using the PostHog Node SDK and the GA4 Measurement
Protocol. A browser cannot see a payment that completes on Stripe's domain —
tracking "purchase" on redirect would count every abandoned checkout as a sale.

**The internal-user guard is a hard return, not a filter.** In `track()`:

```
if (import.meta.env.DEV) return
if (location.hostname !== 'starmat.app') return
if (profile?.is_internal) return
```

Dashboard-side filtering is not enough. Founder test data has already corrupted
a real athlete's progress chart in this project; the same thing in analytics
would be quieter and harder to notice.

**No PII, enforced in the module.** `identify()` takes a user id and the trait
whitelist from the plan. It does not accept an email or a name, so a call site
cannot pass one by accident.

---

## Known gaps this plan does not fix

- **`score.share_viewed` will undercount at first.** Shared score links render
  the generic homepage preview on every social platform, because `og:title` is
  set by JavaScript and scrapers do not run it. People will see a card about
  the mat, not about a score. Fixing that is a rendering change, not a
  tracking one.
- **GA4 needs an SPA pageview shim.** React Router does not reload the page, so
  GA4 sees one pageview per session without one.
- **Cookie consent.** PostHog and GA4 both set cookies. The cookie policy is
  still an `[ATTORNEY TO PROVIDE]` placeholder, and there is no consent banner.
  PostHog can run in cookieless mode as an interim position; that is a legal
  call, not a technical one.

---

## Next

Run **product-tracking-generate-implementation-guide** to turn this into the
actual PostHog + GA4 call sites, or just say "implement phase 1".
