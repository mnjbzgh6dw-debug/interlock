# Interlock — working agreement

## What this is

A demo-only proof of concept for statutory lift inspection. It is shown once, to a small group, on a phone and a projected laptop. It is not production software and will not be maintained.

The specification is `BRIEF.md` in this directory. Read it in full before writing any code. On detail, `BRIEF.md` wins. On process, this file wins.

## Working agreement

- Build in the Tier 1 order in section 13 of the brief, items 1 to 21. Finish Tier 1 completely before Tier 2. Never start Tier 3.
- After each numbered item, stop. Say what changed, what to click to see it, and wait. Do not chain items together because they seem related.
- If a decision is not covered by the brief, make the smallest reasonable choice and say what you chose in one line. Do not stop for trivia. Do stop and ask if the choice changes the data model, a persona's scope, or the demo script.
- Never add a dependency that is not already named in the brief without saying why first.
- Commit after every working item, with the item number in the message.
- Before starting Tier 2, re-read the brief and report contradictions the same way you did at the start. That review has already caught seven real problems; it is worth repeating.
- When I paste a screenshot, it is the source of truth about what the app currently looks like, over your own assumptions.

## Settled — do not reopen

These were contradictions in v2. They are resolved in v3. If you find yourself about to raise one, it is already answered in the brief.

- **Seed data lives in Kestrel on purpose.** Both open defects sit on `lift-k2`, which is Vertex-maintained and Kestrel-owned, so the one technician persona and the one owner persona can both see them. Do not move defects to Bellmont, do not add a second technician, do not widen the technician scope.
- **Section completion is reporting, not gating.** Navigation is free, submit is permitted with items unanswered, and no confirmation dialog appears. The demo control "Fill remaining as pass" handles the rest. The only hard gate is photo-required-on-fail.
- **Three lifts have `formId: null`**: `lift-k3`, `lift-b3`, `lift-w2`. They show a scope statement, not an error.
- **Live defect titles come from the item's `failDescription`**, never from its `text`. Item text is phrased as a pass condition and inverts if used as a defect title.
- **Reminders are computed, never stored.** Rendering must not mutate state.
- **The certificate beat happens on the projected laptop**, not the phone.
- **There is no server, no two-device sync, and no speech capture.** Not in Tier 1, not in Tier 2, not as a stretch goal.

## Non-negotiables

- No authentication, login, splash screen, settings page, profile, or onboarding. Personas switch from the demo controls panel.
- No backend. All state in React context, mirrored to `localStorage` on every write.
- Every write hits local state first, with no network in the path.
- The `BroadcastChannel` outbound push is gated on `navigator.onLine` and flushed on the `online` event. Without that gate the airplane-mode beat in the demo script is dishonest.
- Every captured image is downscaled to roughly 1000px on the long edge, JPEG 0.6, before it reaches state or storage. Seeded photos are committed asset files, never inline base64. Persistence is wrapped in try/catch and degrades to in-memory rather than throwing.
- Measurements evaluate on commit, never on keystroke. The stop-use interstitial fires once, on commit.
- Real SANS clause text is copyrighted. Only the brief's placeholder text appears, and the placeholder banner is never removed.
- The three status colours are used only for status. The brand blues are never used for status.
- `slate` is only for field labels and metadata the inspector never acts on. Any value they read to do the job is `shaft`.
- `font-variant-numeric: tabular-nums` is global and overridden nowhere.
- Minimum tap target 48x48px.
- No gradients, no drop shadows, no entrance animations on lists, no hover transitions on rows.
- Sentence case everywhere. No all-caps labels.
- Seed data matches the brief's tables exactly, including official numbers, dates and inspector names.

## Stack

Vite + React + TypeScript + Tailwind. IBM Plex Sans and IBM Plex Mono. Demo date defaults to 2026-09-08.

Tailwind colour names, used by name in all code: `shaft` `#0A2540`, `hoist` `#123A5E`, `signal` `#1668A8`, `slate` `#5B7186`, `rail` `#C9D6E0`, `paper` `#F5F8FB`, `stop` `#B02525`, `open` `#B07208`, `verified` `#1B6E52`.

## Definition of done

The demo script in section 14 of the brief runs end to end from a public URL — phone for the inspection, projected laptop for the certificate and the closure — without a crash, without a dead button, and without me having to explain a screen that should have been obvious.
