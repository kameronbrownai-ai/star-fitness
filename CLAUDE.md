# Star Fitness / Star Mat

Directional training mat with 8 calibrated angles (45°–360°) and a LOAD DECIDE
center, paired with an AI Coach that prescribes workouts using those exact
angles. Live at **starmat.app**. Pre-launch, targeting launch ~Sept 2026.

Founder & CEO: Leroy Collins. Co-Founder: Kameron Brown (the person you are
working with). Contact: Info@starmatapp.com.

---

## Deploying — read this before you change anything

**Work on `design-playground`. Deploys come from `main`.** Nothing reaches the
live site until it is pushed to `main`:

```bash
npm run build          # always build before pushing; catches syntax errors
git push origin design-playground:main
```

The VPS auto-deploys from GitHub `main` and the site updates in **35–40
seconds**. There is no manual upload step. `deploy.sh` in this repo is
**obsolete** — ignore it.

### The one exception: images and videos do NOT deploy

The pipeline syncs `assets/` and `index.html` but **never touches `images/` or
`videos/`**. A new image pushed to GitHub will 404 on the live site forever.
Media has to go up over SSH:

```bash
scp public/images/thumbs/new-file.jpg root@2.24.110.179:/var/www/starfitness/images/thumbs/
```

This has caused real bugs. The hero video once existed only on the server and
was missing from the repo entirely.

---

## Infrastructure

| | |
|---|---|
| Host | Hostinger KVM VPS, `2.24.110.179` (`srv1685639.hstgr.cloud`), Ubuntu 24.04 |
| Web root | `/var/www/starfitness` |
| Server code | `/var/www/starfitness/server/` (Express, pm2 process `star-fitness-api`, port 3001, loopback only) |
| Proxy | nginx, `/api/` → `127.0.0.1:3001` |
| DB + auth | Supabase, project `klmeqlouorncytafpbpl` |
| Payments | Stripe Payment Links |
| AI | Anthropic API (Haiku 4.5 text, Sonnet 4.6 vision) |

Root SSH works via installed key: `ssh root@2.24.110.179`.

**Secrets live in `/var/www/starfitness/server/.env` (chmod 600).** Never print
them, never paste keys into chat, never commit them. The repo is **public**.
Only the Supabase *publishable* key and public Stripe Payment Links belong in
frontend code.

### Security posture (hardened 2026-09-05)
ufw allows only 22/80/443 · fail2ban on sshd · API bound to `127.0.0.1` ·
5 security headers via `/etc/nginx/snippets/starfitness-security.conf` ·
rate limiting on `/chat` (40/hr per IP) · nightly backups at 03:20 to
`/root/backups` (config, `.env`, and a JSON export of all Supabase tables).

`Permissions-Policy` deliberately **allows camera and microphone** — the Star
Assessment and voice coaching need them. Do not tighten that without checking.

nginx does **not** inherit `add_header` into a `location` block that sets its
own. Several blocks set caching headers, so security headers are included per
location via a snippet. Adding them once at server level silently drops them
from JS, CSS, images and video.

---

## Content rules — these are not stylistic

The site went through legal compliance passes and a fabricated-content cleanup.
Roughly 13,000 invented product reviews, 10 fake testimonials, 8 fake partner
companies, and a fake `aggregateRating` with `reviewCount: 250000` were removed.
That was FTC exposure and a Google penalty risk.

**Never add, and remove on sight:**

- Testimonials, reviews, star ratings, or review counts that are not from a real
  documented customer
- Named partner companies, sponsors, or endorsements without a signed agreement
- Member counts, country counts, units sold, or any statistic that cannot be
  evidenced
- `aggregateRating` or review markup in structured data
- Superiority claims — "no other workout/training program…", "the most complete
  training tool", "better/faster than". These keep reappearing; two remain in
  hero copy on About and Lessons and Kameron has been told about them.
- "Best Seller" or similar badges on products that have not sold
- Banned medical/technical claims: "prevents injury", "injury prevention",
  "lab-quality", "medical-grade", "clinically accurate", "3D biomechanics" (the
  system uses 2D pose detection), "diagnose", "treats", "corrects dysfunction",
  guaranteed results

**Say instead:** "lower-impact modifications", "movement screen", "built for",
"designed for", "supports recovery", "individual results vary".

**Required disclaimer** anywhere the Star Score or assessment appears:
"Estimate for general fitness purposes, not medical advice."

Community's empty reviews state and the partner *categories* (rather than named
companies) are deliberate. They are not gaps to fill.

---

## Product facts (keep consistent everywhere)

- **Star Mat Pro 2.0 $249** — 8mm TPE foam, two-sided print, 75″×75″, carry strap
- **Star Mat Lite $199** — 4mm, single-sided, 55″×55″, foldable
- Bundles: Starter $299, Elite $379
- **Memberships: Free $0 · Training $5/mo (AI Coach) · Elite $14.99/mo** (voice,
  live camera coaching, unlimited assessments). **There is no "Pro" plan** — that
  error appeared in both the AI system prompt and the homepage FAQ.
- Trial: 30 days for the first 5,000 members, then 14 days. No card required.
- **11 sports:** Football, Basketball, Soccer, Baseball/Softball, Track & Field,
  Pickleball, Tennis, Golf, Hockey, Lacrosse, MMA/Combat — plus a Wellness &
  Rehab track.

If you add or remove a sport, the count is claimed in **five** places: Community
stats card and hero line, About values copy and floating badge, and two
descriptions in `src/components/Seo.jsx`. Sports lists live in `Lessons.jsx`,
`AIOnboarding.jsx`, the `AIWorkoutChat.jsx` system prompt, `FAQ.jsx`,
`Home.jsx`, and the JSON-LD in `index.html`.

---

## Brand

- **Always dark.** Never put the brand on white.
- Font: **Inter** (300–900).
- Colors: `star-yellow #FFD700` (primary accent), `star-blue #007AFF` (AI/tech),
  `star-green #30D158`, `#BF5AF2` (wellness only), grounds `#0A0A0A` / `#121212`,
  card `#1C1C1E`, border `#2C2C2E`, grey `#8E8E93`.
- **No em-dashes anywhere on the site.** Kameron asked for these removed
  site-wide. The removal left orphan-comma artifacts; watch for them.
- Trademarks use ™ not ®: Star Mat™, Star Fitness™, Star Mat AI Coach™,
  Star Assessment™, Star Score™, LOAD DECIDE™.
- Taglines: "Train Without Limits." · "The most important move you can make is
  the next move." · "Every step you take is an impact of improvement."

---

## Notable files

| File | Why it matters |
|---|---|
| `src/components/Seo.jsx` | Per-route titles/descriptions/canonicals. Without it every route served an identical title. |
| `src/lib/speech.js` | Single source for voice rate (0.8) and text-to-speech cleanup. Rate used to be duplicated in three places with different values. |
| `src/components/AIWorkoutChat.jsx` | AI Coach + the system prompt. Prompt asks for <180 words, plain language, no jargon. |
| `src/lib/starScore.js` | Star Score engine. Elite ≥83, Strong ≥65, Developing ≥45, else Foundation. |
| `src/components/ConsentGateModal.jsx` | Liability waiver + biometric consent. **Still contains `[ATTORNEY TO PROVIDE]` placeholders.** |
| `src/pages/Apparel.jsx` | Unused dead code, 362 lines, not routed. Deletion pending Kameron's OK. |

---

## Working style that has worked here

- **Verify against the live site, not just local.** Several bugs only appeared
  in the deployed bundle — a stale `main`, a fake plan name that was fixed in
  one file but still present in another.
- **Check before asserting.** Investigate with real commands rather than
  answering from memory; this codebase has repeatedly contradicted assumptions.
- Kameron is non-technical. Give concrete step-by-step instructions, name exactly
  where to click, and say plainly when something is his call versus yours.
- He cannot act on anything requiring Hostinger panel access from your side —
  browsers are read-only to Claude and the Hostinger domain is blocked.

---

## Open items

- **`[ATTORNEY TO PROVIDE]`** legal texts — waiver, biometric consent, and the
  Privacy/Terms/Cookie bodies. The product captures camera and biometric data.
- **Untested revenue path** — no real signup, login, or Stripe checkout has been
  run end to end. Highest-risk unknown before launch.
- **Boss code `STAR-BOSS-K9F4-7Q2X-3M8L`** grants `comp` (full Elite) and is
  **unlimited-use**. If leaked, revoking it cuts off every legitimate holder.
- **Two superiority claims remain** in hero copy on About and Lessons.
- **AI Coach is free to anonymous users** but pricing puts it in the $5 tier.
  Rate limiting caps abuse; it does not require payment.
- **VPS renewal** — expires 2026-09-19. Billing action, Kameron only.
