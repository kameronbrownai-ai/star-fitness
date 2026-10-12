# Product Model — Star Fitness / Star Mat

## What it is

A physical training mat with 8 calibrated angles (45°–360°) and a LOAD DECIDE
center, sold with a subscription app that prescribes workouts against those
exact angles and measures movement through the device camera.

Two revenue lines that behave very differently:

| Line | Price | Purchase path |
|---|---|---|
| Hardware | Star Mat Pro 2.0 $249, Lite $199, bundles $299 / $379 | One-time, Stripe Payment Link, **off-site** |
| Membership | Free $0 · Training $5/mo · Elite $14.99/mo | Recurring, Stripe, **off-site** |

Pre-launch. Zero analytics installed today.

## Category

Consumer fitness (B2C) with a light B2B edge: coaches run testing sessions for
squads, and a partner program targets facilities. Not classic B2B SaaS — there
is no account/organization above the user.

## Primary value action

**Completing a Star Assessment.** Five moves, sixty seconds, one number (the
Star Score, 0–100, banded Foundation / Developing / Strong / Elite). It is the
thing that turns a mat into a measurable program, it is the feature most likely
to fail silently, and it is the only action that produces a number worth
returning for.

Secondary value actions: generating a workout from the AI Coach, and logging a
training day.

## Entity model

- **User** — the only durable identity. Supabase auth.
- **Team** — the one multi-user structure. A user creates a team, shares a
  code, teammates join and appear on a leaderboard. Users may belong to several.
- **Testing session** — a coach's capture run over a squad. Athletes in a
  session are *not* users; they are identified by jersey number or initials and
  have no account. They must never be treated as people in analytics.

No account or organization layer. Group hierarchy is one level: team.

## Where the funnel can break

1. **Camera permission.** The assessment cannot start without it. A denial is
   invisible today.
2. **Off-site checkout.** `CartSidebar.jsx:25` and `Pricing.jsx:71` hand the
   visitor to `buy.stripe.com`. Everything after that point is unobservable
   from the browser. The revenue path has never been run end to end.
3. **Assessment abandonment.** Five moves on camera is a long way to ask
   someone to go on a phone.
4. **Consent gate.** A waiver and biometric consent modal stands between the
   user and the camera. Its legal text is still placeholder.

## Constraints that shape tracking

- **No PII in analytics at all** (user decision). Anonymous user IDs only. No
  email, no name, anywhere — not in events, not in traits. The product captures
  camera and biometric data and the privacy policy is unfinished; the analytics
  layer should hold nothing that makes a breach worse.
- **Biometric data never leaves the device as analytics.** Pose landmarks, joint
  angles and video frames are never event properties. The derived Star Score is.
- **Internal users must be excluded.** Test data from the two founders' accounts
  has already corrupted a real athlete's progress chart once in this project.
  The tracking layer needs a hard guard, not a dashboard filter.
- **Destinations: PostHog + GA4.** PostHog owns product usage; GA4 owns
  marketing attribution.
