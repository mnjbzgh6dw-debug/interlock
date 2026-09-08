# INTERLOCK — Proof of Concept Build Brief v3

**Nothing moves until it's closed.**

Statutory lift inspection, from the machine room to the certificate to the closed defect.

---

## How to use this document

This is the single source of truth. Where it conflicts with anything discussed in a session, this document wins. If a session produces a correction, edit this file rather than carrying the correction in conversation.

Build in the Tier 1 order in section 13. Finish Tier 1 completely before Tier 2. Never start Tier 3.

**Changes from v2, all of them resolutions of contradictions found on first read:** seeded defect activity relocated to Kestrel so both the technician and owner personas can actually see it; owner scope widened to all defects on their lifts; `failDescription` added to form items; reminders are now computed from a defined schedule rather than stored as a render side effect; image persistence rules added; section completion is reporting, not gating; measurement evaluation happens on commit, not keystroke; former Tier 2 items 19 to 23 promoted into Tier 1 because the demo script depends on them; Supabase two-device sync and speech capture removed entirely; the demo script now names which device each beat happens on.

---

## 1. The name

**Interlock.** A landing door interlock prevents a lift from moving unless the doors are closed and locked. The app does the same to accountability: it locks the inspector, the lift company, the building owner and the regulator into one chain of custody around a single record, and nothing is released until the defect is closed.

Use "Interlock" alone. Wordmark in IBM Plex Sans SemiBold, letter-spacing `-0.015em`, sentence case.

## 2. What the demo has to achieve

The audience is the group who came up with the idea. They do not need convincing that the problem is real. Each is carrying a *different* app in their head. The demo's job is convergence, not persuasion: make one shared picture concrete enough that the disagreements surface in the room rather than six weeks into a build.

Three things must land, in order:

1. An inspector can walk a long statutory checklist on a phone, in a pit or machine room, with no signal, without losing work.
2. Failed items become graded, assigned, tracked obligations — not lines in a PDF nobody reads.
3. Those obligations get closed by the responsible party with photo proof and a signature, and the system chases them when they go overdue.

Point 3 is the differentiator. Everyone has seen a digital form. Almost nobody demos the closure loop.

## 3. Non-goals

Do not build, do not simulate, do not mention in the UI:

- Authentication, registration, password reset, profiles, settings, onboarding, splash screens.
- Real email, SMS or push. Notifications are recorded in-app only.
- Any real submission to a regulator.
- Payments, billing, org management, multi-tenancy, audit logs.
- More than one checklist form populated.
- Real SANS clause text. It is SABS copyright and paywalled. Placeholder text only, watermarked wherever a clause appears.
- Analytics, error reporting, test suites beyond what stops you shipping something broken.

## 4. Brand and design system

### 4.1 Design premise

A phone held in one gloved hand, in a machine room that is either dim or blown out by daylight, by someone who does this thirty times a week, cares about speed, and has lost work to a dead app before. The output is a legal certificate that sits in a steel cabinet for ten years.

Two consequences drive everything:

- The **form body reads as a document**, not a feed of cards. Statutory paper heritage is an asset here.
- The **status system is the safety colour code already painted on the equipment in that building**. Red is prohibition, amber is caution, green is verified safe. Those three are reserved absolutely for status and never used decoratively. Brand blues are never used for status.

### 4.2 Palette

| Token | Hex | Role |
|---|---|---|
| `shaft` | `#0A2540` | Deepest navy. Primary text, top chrome, report letterhead. |
| `hoist` | `#123A5E` | Navy. Nav surfaces, section headers, logo container. |
| `signal` | `#1668A8` | Interactive blue. Primary actions, links, focus rings, active states. |
| `slate` | `#5B7186` | Field labels and non-load-bearing metadata only. See 4.5. |
| `rail` | `#C9D6E0` | Borders, dividers, disabled fills, table rules. |
| `paper` | `#F5F8FB` | Page and form background. Blue-tinted off-white. |
| white | `#FFFFFF` | Cards, sheets, inputs, the report body. |

Reserved status colours:

| Token | Hex | Meaning | Background tint |
|---|---|---|---|
| `stop` | `#B02525` | Not for use. Prohibition. | `#FCEBEB` |
| `open` | `#B07208` | Defect open, dated obligation. | `#FAEEDA` |
| `verified` | `#1B6E52` | Passed, closed, compliant. | `#E1F5EE` |

No gradients. No drop shadows except a functional focus ring. No decorative tints.

Register these as Tailwind colour names so they appear in the code and stay disciplined.

### 4.3 Typography

**IBM Plex Sans** throughout, weights 400 / 500 / 600. Genuine tabular figures and an engineering heritage that suits the subject without being a costume.

`font-variant-numeric: tabular-nums` is set globally and overridden nowhere. Columns of readings must not jitter as they are typed.

**IBM Plex Mono** in exactly two places, both genuinely code-like: the lift's official number, and the report verification code. Never for labels, never for decoration. The verification code keeps mono wherever it appears, not only on the report.

One exception, deliberate: the demo controls panel sets its own labels in mono. The panel is the operator's console, not part of the product, and the brief requires it to be unmistakable as such.

| Size / weight | Use |
|---|---|
| 31 / 600 | Report title, stop-use headline |
| 25 / 600 | Screen titles |
| 20 / 500 | Section headers |
| 17 / 400 | Body, checklist item text |
| 17 / 500 | Measurement values, buttons |
| 15 / 400 | Secondary text, metadata |
| 13 / 500 | Field labels, status pills |

Sentence case everywhere. No all-caps labels, no tracked-out eyebrow labels above headings.

### 4.4 Logo

A hoistway crossed by a thrown bolt: reads as a lift shaft and as a lock at once.

```svg
<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Interlock">
  <rect width="32" height="32" rx="7.5" fill="#123A5E"/>
  <rect x="10" y="6.5" width="12" height="19" rx="2" fill="none" stroke="#FFFFFF" stroke-width="1.6"/>
  <rect x="5" y="14.4" width="22" height="3.2" rx="1.6" fill="#FFFFFF"/>
</svg>
```

Reversed variant for light surfaces and the report letterhead: container fill `#FFFFFF` or none, shaft stroke and bolt fill `#0A2540`, stroke-width `1.8`.

Minimum 20px. Never stretch, recolour outside the two variants, or add effects. Lockup: mark, 11px gap at 40px mark size scaling proportionally, wordmark optically centred on the bolt.

### 4.5 Layout laws

- Single column. Left aligned. Never centre body content. These are the app's laws, on a phone. The report in section 11 is a printed document and is exempt: it uses two columns for the identity blocks and right-aligns values against their labels, which is the spec-sheet convention. The lift detail's identity block follows the same convention on screen.
- Minimum tap target 48×48px. Gloves.
- Primary action in a fixed bottom bar, thumb reach.
- Explanatory text under 70 characters per line.
- Assume bad light. Body text on `paper` clears 7:1.
- **`slate` is for field labels and metadata the inspector never has to act on.** Any value they read to do the job — official numbers, measurements, dates, compliance clocks, defect due dates — is `shaft`. When in doubt, `shaft`.
- Borders 1px `rail`. Cards 8px radius, sheets 16px top corners. Pills only where the thing genuinely is a pill.
- Dense lists get bordered rows, not rounded cards. Cards are for bounded objects: a lift record, a defect, the report.

### 4.6 Motion

Only where it shows what changed: the clause sheet sliding up, the stop-use interstitial arriving, a defect moving to closed. Nothing else. No entrance animations on lists, no hover transitions on rows, no page transitions. Respect `prefers-reduced-motion`.

### 4.7 Copy rules

Plain, active, verb-first. "Start inspection", not "Initiate inspection". An action keeps its name through the flow: the button that says "Close defect" produces "Defect closed". Empty states say what to do next, never "Nothing here yet". Errors say what happened and what to do, no apology, no "Error:" prefix. No exclamation marks. Never "simply" or "just".

## 5. Stack and deployment

- Vite + React + TypeScript + Tailwind. One repo. `npm i && npm run dev`.
- State in a React context, seeded from `src/data/seed.ts`, mirrored to `localStorage` on every write.
- **Local-first, unconditionally.** Every write hits local state and storage first, with no network in the path. This is what makes the airplane-mode beat real rather than staged.
- Report output: a print-styled route plus browser print-to-PDF. No PDF library.
- Signatures: `<canvas>` finger draw, stored as a data URL.
- Photos: `<input type="file" accept="image/*" capture="environment">`.
- QR: the `qrcode` npm package, rendered to canvas.
- **Deploy on day one.** Netlify or Vercel. Do this as soon as the register works, not at the end. It removes the worst demo risk, which is a laptop that will not project, and it means every later checkpoint is a link you can open on your phone from anywhere.
  - **What happened instead:** deployed at the end of Tier 1, to GitHub Pages rather than Netlify or Vercel, because that needed no interactive login. Live at `https://mnjbzgh6dw-debug.github.io/interlock/`, published from the `gh-pages` branch by `npm run deploy`. Pages has no rewrite rules, so `404.html` is a copy of `index.html`: deep links such as `/verify/:code` load correctly but return a 404 status. Vite's `base` is set for `build` only, so dev stays at the root.

### 5.1 Cross-window sync

`BroadcastChannel('interlock')` syncs state between windows in the same browser. Two windows side by side on the projected laptop is how the inspector and the technician appear at once.

**The outbound push must be gated on `navigator.onLine`, and flushed on the `online` event.** `BroadcastChannel` works perfectly well offline, so without this gate, real airplane mode changes nothing, the defect appears on the technician window instantly, and the sync beat in the script is a lie. With the gate, airplane mode genuinely queues writes and restoring signal genuinely flushes them. Roughly ten lines. Do not skip it.

Show queue state honestly: a small `open`-coloured indicator reading the queued write count while offline, and a `verified` "synced" confirmation when it flushes. An inspection captured offline carries `capturedOffline: true` and shows a "captured offline, synced at HH:MM" line on the report.

Persona does **not** cross between windows. Two windows are two people, the inspector and the technician, so each keeps its own. Everything else crosses, including the demo date, so advancing to Day 31 moves both. The `storage` event is deliberately not listened to: both windows share `localStorage`, so reacting to it would carry state across the gate and make airplane mode meaningless. The consequence is that a hard refresh of the second window mid-demo picks up the shared store early.

There is no server. There is no second-device sync. Say so in the room.

## 6. Personas

Persistent switcher in the demo controls. No passwords, no login screen.

| Persona | Identity | Scope |
|---|---|---|
| Inspector | J. Marais, Registered Lift Inspector, reg. RLI-2019-0451, Cape Vertical Inspections (SANAS placeholder AIS-0042) | Full lift register. Starts, completes and signs inspections. Assigns responsibility for each defect. |
| Technician | S. Ndlovu, Vertex Lift Services | Defects assigned to `serviceCompany` on lifts whose `serviceCompanyId` is `sc-vertex`, across all buildings. Closes with photo and signature. |
| Building owner | N. Mokoena, facilities manager, Kestrel Property Holdings | **All** defects on lifts in `bld-kestrel`, regardless of responsibility, with the responsible party shown on each. Can close only those assigned to `owner`. Sees their reports and the portfolio exposure view. |

The owner scope is deliberately wider than the technician's. An owner is liable for the machine whoever is fixing it, and the portfolio screen cannot show total exposure otherwise.

The inspector lands on the register. The technician and the owner land on their worklist: neither starts inspections, so a register of lifts they cannot act on is the wrong first screen.

A regulator appears only as a recipient in distribution lists and as the audience for a stop-use notification. Do not build a regulator screen.

## 7. Data model

```ts
type ServiceCompany = { id: string; name: string; contactEmail: string }

type Building = {
  id: string; name: string; address: string
  ownerEntity: string; contactName: string; contactEmail: string
}

type Lift = {
  id: string; buildingId: string
  label: string                 // what's painted on the door
  officialNumber: string
  type: 'passenger' | 'goods' | 'escalator' | 'dumbwaiter'
  floorsServed: number
  ratedLoadKg: number | null
  ratedSpeedMs: number | null
  driveType: string
  installedDate: string
  oem: string
  serviceCompanyId: string
  formId: string | null         // null = no form loaded in this demo
  lastReportDate: string | null
  nextDueDate: string | null
  stopUseInForce: boolean
}

type FormItem = {
  id: string; text: string
  failDescription: string       // authored. reads correctly as a defect title.
  responseType: 'passFail' | 'measurement' | 'dateCheck'
  unit?: 'mm' | 'N' | '°C' | 'seconds' | 'count'
  min?: number; max?: number
  expectedLabel?: string        // '≤ 150 N'
  clauseRef: string             // 'Cl. 5.4.2'
  clausePlaceholder: string     // 2–3 plain sentences
  failSeverity: 'immediate' | 'days30' | 'days90' | 'nextInspection'
  defaultResponsibility: 'serviceCompany' | 'owner'
  photoRequiredOnFail: boolean
}

type FormSection = { id: string; title: string; items: FormItem[] }

type FormDefinition = {
  id: string; title: string
  appliesTo: Lift['type'][]
  placeholderNotice: string
  sections: FormSection[]
}

type Inspection = {
  id: string; liftId: string; formId: string
  inspectorName: string; inspectorReg: string
  startedAt: string; completedAt: string | null
  verificationCode: string      // 'IL-K1-2609-4F7B'
  responses: Record<string, {
    result: 'pass' | 'fail' | 'na'
    value?: string; photo?: string; note?: string
  }>
  sectionSignatures: Record<string, string>
  finalSignature: string | null
  distributedTo: { recipient: string; role: string; sentAt: string }[]
  capturedOffline: boolean
  syncedAt: string | null
}

type Defect = {
  id: string; inspectionId: string; liftId: string; itemId: string
  description: string           // from failDescription
  severity: FormItem['failSeverity']
  responsibility: 'serviceCompany' | 'owner'
  raisedDate: string; dueDate: string
  status: 'open' | 'closed'
  raisedPhoto: string | null
  evidencePhoto: string | null
  closedBy: string | null; closedAt: string | null
  closureSignature: string | null
}
```

`Defect` has no stored reminder array. See 7.2.

### 7.1 Severity rules

| Severity | Due date | Behaviour |
|---|---|---|
| `immediate` | Same day | Sets `stopUseInForce` on the lift. Full-bleed stop-use interstitial. Notification list includes the regulator. Acknowledge only, never dismiss. |
| `days30` | +30 days | Tracked, chased. |
| `days90` | +90 days | Tracked, chased. |
| `nextInspection` | Lift's next due date | Listed, not chased. |

Overdue is `status === 'open' && dueDate < demoDate`.

**When a defect record exists, and when it becomes an obligation.** Records are created when the inspector opens defect review, so a responsibility override survives a refresh. They are not obligations until the report is signed: every view that lists obligations counts only defects whose inspection has a `completedAt`. That is what makes the 09:10 sync beat land on submit rather than on grading.

**Issuing a report restarts the compliance clock.** Submit sets the lift's `lastReportDate` to the demo date and `nextDueDate` 24 months on, which is the cycle every lift in the seed uses. Without it a lift reads "25 days overdue" immediately after being inspected, which is the first thing anyone would notice.

**Closing the last open `immediate` defect on a lift clears `stopUseInForce`.** Nothing moves until it's closed, and once it's closed the lift is released. The flag is recomputed from the record rather than toggled, so clearing a mis-tapped failure also lifts the order.

### 7.2 Reminders are computed, never stored

Reminders are a pure function of `(defect, demoDate)`. Nothing writes a reminder. Rendering a view must never mutate state, or reminders duplicate on every render, every persona switch and every date change, and the history shown at the Day 31 beat becomes garbage.

Schedule, for `days30` and `days90` defects only:

- 7 days before due date
- On the due date
- Every 7 days after the due date, up to the demo date

Return the computed list, most recent first, and render it inline on the defect. `immediate` defects are not chased on a schedule — they are notified once, at the moment of the stop-use order. `nextInspection` defects are never chased.

Recipients on each reminder: the responsible party, the building owner, and Cape Vertical Inspections. The owner is on every reminder because they are liable whoever is fixing it.

Chasing stops at closure, not at the demo date, so a defect closed late shows the reminders that actually fired and no more.

### 7.3 Persistence rules

`localStorage` quota is around 5MB. A raw phone photo base64-encoded is 3 to 8MB. Unmanaged, this throws `QuotaExceededError` mid-inspection and takes the airplane-mode beat down with it, which is the one thing that cannot fail.

- Downscale every captured image to roughly 1000px on the long edge, JPEG quality 0.6, before it reaches state or storage. Roughly 100 to 200KB each.
- Seeded photos are small committed asset files, never inline base64.
- Signature canvases are PNG and small enough to store as data URLs.
- Wrap persistence in a try/catch. On `QuotaExceededError`, keep working in memory and show one honest line: "Storage full. This session won't survive a refresh." Never lose the current inspection to a storage failure.

### 7.4 Verification codes

Every completed inspection gets `IL-{liftShort}-{DDMM}-{4 hex}`. `/verify/:code` shows a minimal record: lift, official number, inspection date, inspector name and registration, validity, open defect count. The report carries a QR pointing at that route. Costs almost nothing and does more for perceived legitimacy than any other single feature.

`/verify/:code` ships in Tier 1 alongside the report. A QR that resolves to a 404 breaks the no-dead-button rule.

## 8. Seed data

All fictitious. Demo date defaults to **2026-09-08**.

Everything the demo script touches lives in Kestrel House, which is Vertex-maintained and Kestrel-owned. This is deliberate: it means one technician persona and one owner persona can see every defect the script creates or closes. Bellmont and Waterfall exist to populate the register and prove the model handles several buildings, several service companies and several equipment types.

**Service companies**

| id | Name | Email |
|---|---|---|
| `sc-vertex` | Vertex Lift Services | dispatch@vertexlifts.example |
| `sc-summit` | Summit Elevator Co | service@summitelevator.example |
| `sc-apex` | Apex Vertical | support@apexvertical.example |

**Buildings**

| id | Name | Address | Owner | Contact |
|---|---|---|---|---|
| `bld-kestrel` | Kestrel House | 14 Loop Street, Cape Town | Kestrel Property Holdings | N. Mokoena, n.mokoena@kestrelprop.example |
| `bld-bellmont` | Bellmont Chambers | 208 Rivonia Road, Sandton | Bellmont Property Trust | D. Pillay, d.pillay@bellmonttrust.example |
| `bld-waterfall` | Waterfall Corporate Park, Block C | Century City, Cape Town | Waterfall Park Body Corporate | A. Fourie, a.fourie@waterfallpark.example |

**Lifts**

| id | Building | Label | Official no. | Type | Floors | Load kg | Speed | Drive | Installed | OEM | Service co. | formId | Last report | Next due | Demo state |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `lift-k1` | Kestrel | Lift 1 | WC-L-2014-03318 | passenger | 8 | 800 | 1.6 | Geared traction | 2014-03-11 | Meridian Lifts | Vertex | `form-passenger-a` | 2024-08-14 | 2026-08-14 | **Overdue 25 days. Inspected live in the demo.** |
| `lift-k2` | Kestrel | Lift 2 | WC-L-2014-03319 | passenger | 8 | 800 | 1.6 | Geared traction | 2014-03-11 | Meridian Lifts | Vertex | `form-passenger-a` | 2026-07-20 | 2028-07-20 | **Two open defects, one overdue. Closure demo.** |
| `lift-k3` | Kestrel | Goods Lift | WC-L-2016-04871 | goods | 3 | 1600 | 0.5 | Hydraulic | 2016-07-20 | Meridian Lifts | Vertex | `null` | 2025-03-01 | 2027-03-01 | Compliant |
| `lift-b1` | Bellmont | Lift 1 | GP-L-2011-01204 | passenger | 12 | 1000 | 2.5 | Gearless traction | 2011-09-05 | Northgate Vertical | Summit | `form-passenger-a` | 2025-06-18 | 2027-06-18 | Compliant, clean history |
| `lift-b2` | Bellmont | Lift 2 | GP-L-2011-01205 | passenger | 12 | 1000 | 2.5 | Gearless traction | 2011-09-05 | Northgate Vertical | Summit | `form-passenger-a` | 2025-06-18 | 2027-06-18 | Compliant |
| `lift-b3` | Bellmont | Escalator 1 | GP-E-2011-00337 | escalator | 2 | — | 0.5 | Chain drive | 2011-09-05 | Northgate Vertical | Summit | `null` | 2025-10-30 | 2027-10-30 | Compliant |
| `lift-w1` | Waterfall | Lift 1 | WC-L-2021-06642 | passenger | 5 | 630 | 1.0 | Machine-room-less | 2021-02-14 | Cape Vertical | Apex | `form-passenger-a` | 2024-11-02 | 2026-11-02 | Due in 55 days |
| `lift-w2` | Waterfall | Dumbwaiter | WC-L-2021-06643 | dumbwaiter | 2 | 50 | 0.3 | Traction | 2021-02-14 | Cape Vertical | Apex | `null` | — | — | Never inspected |

`stopUseInForce` is `false` on all lifts at seed.

Tapping a lift with `formId: null` shows a scope statement, not an error: "Goods lift form not loaded in this demo." Handled well, three of eight lifts saying that makes the forms-are-data point land harder, because it shows the app knows which form it needs and simply hasn't been given it.

**Inspection history.** Empty apps read as prototypes. Seed prior inspections so it looks three years old. Each needs a date, inspector, verification code and defect count; responses can be all-pass because nobody will open them.

| Lift | History |
|---|---|
| `lift-k1` | 2018-07-02 (T. van Wyk, RLI-2011-0188), 2020-08-05 (T. van Wyk), 2022-08-11 (P. Mkhize, RLI-2016-0302), 2024-08-14 (J. Marais) |
| `lift-k2` | 2018-07-12 (T. van Wyk), 2020-07-09 (T. van Wyk), 2022-07-15 (P. Mkhize), 2024-07-18 (J. Marais), 2026-07-20 (J. Marais) |
| `lift-k3` | 2019-08-01, 2021-08-30, 2023-02-14, 2025-03-01 |
| `lift-b1` | 2019-05-14, 2021-06-02, 2023-06-09, 2025-06-18 |
| `lift-b2` | 2019-05-16, 2021-06-04, 2023-06-11, 2025-06-18 |
| `lift-w1` | 2021-02-20, 2022-11-06, 2024-11-02 |

`lift-b3` is not in the history table above, but its `lastReportDate` is 2025-10-30, so it carries the single record that date implies. Inspector names for entries the table leaves unnamed are assigned from the three known inspectors, chronologically.

**Open defects, both on `lift-k2`, from the 2026-07-20 inspection by J. Marais**

| id | Item | Description | Severity | Responsibility | Raised | Due | Status |
|---|---|---|---|---|---|---|---|
| `def-001` | D1 | Water present in lift pit | `days30` | `owner` | 2026-07-20 | 2026-08-19 | Open, 20 days overdue. Has a raised photo. |
| `def-002` | B5 | Car mirror cracked | `days90` | `serviceCompany` | 2026-07-20 | 2026-10-18 | Open, on time. **Closed live in the demo.** |

By the default demo date, `def-001`'s computed reminder history is 2026-08-12, 2026-08-19, 2026-08-26, 2026-09-02. Do not seed these; let 7.2 compute them.

**One closed defect on `lift-k1`**, so the closed state has a worked example in the technician's own worklist: item C3, "Landing call button not functional", `days90`, `serviceCompany`, raised 2024-08-14, closed 2024-09-02 by "M. Botha, Vertex Lift Services", with a committed evidence photo asset and a signature.

## 9. The checklist form

One form: `form-passenger-a`, **Comprehensive Inspection Report — Passenger Lift**, `appliesTo: ['passenger']`. Thirty items across six sections.

Persistent amber banner at the top of every form screen and on the report:

> Demonstration content. Checklist items and clause references are illustrative placeholders, not the published standard.

Clause references read `Cl. 5.4.2` with no standard named. Each carries two or three sentences of plainly written placeholder explanation. Tapping opens a bottom sheet; "Back to item" returns to the exact scroll position. This must be fast and obvious — it is one of the three things the demo has to land.

### Behaviour

- **Navigation is free.** Sections can be entered, left and revisited in any order. The progress strip reports completion; it does not gate it.
- **Submit is permitted with items unanswered.** No blocking confirmation. Use the demo control in section 12 to fill the remainder before sign-off so the printed certificate is complete.
- **Photo-required-on-fail is the one hard gate.** An item with `photoRequiredOnFail` that has been failed cannot be left until a photo is attached.
- **Measurements evaluate on commit, not on keystroke.** Blur, or an explicit done action. Typing `50` on the way to `500`, or `1` on the way to `12.4`, must not fire a stop-use interstitial mid-keystroke.
- **A `dateCheck` item records the date of the last certified test** and fails when that date is more than the stated interval ago, or is in the future. Judged against the demo date, not today. E4's interval is 12 months.
- **An out-of-range measurement result is not overridable.** Retyping the value is the only way to change it, because the range is the rule.
- **The stop-use interstitial fires on commit of an `immediate` failure**, once, and sets `stopUseInForce` on the lift.
- Each section ends with an inspector signature pad.

### Sections and items

Format: `id` · text · fail description · type · expected · clause · severity · responsibility · photo

**A. Machine compartment**
- A1 · Access route safe and unobstructed · Machine compartment access obstructed · passFail · — · Cl. 3.1.1 · days30 · owner
- A2 · Machine compartment temperature · Machine compartment temperature out of range · measurement °C · 5–40 · Cl. 3.2.4 · days30 · owner
- A3 · Guarding of rotating parts secure · Rotating parts inadequately guarded · passFail · — · Cl. 3.4.1 · **immediate** · serviceCompany · photo
- A4 · Lighting level adequate at machine · Inadequate lighting at machine · passFail · — · Cl. 3.2.1 · days30 · owner
- A5 · Hand-winding instructions displayed and legible · Hand-winding instructions missing or illegible · passFail · — · Cl. 3.6.2 · days90 · serviceCompany
- A6 · Report copy present in machine compartment · No report copy in machine compartment · passFail · — · Cl. 9.1.1 · days30 · owner

**B. Lift car**
- B1 · Car lighting functional · Car lighting not functional · passFail · — · Cl. 4.1.2 · days30 · serviceCompany
- B2 · Emergency car lighting functional · Emergency car lighting not functional · passFail · — · Cl. 4.1.3 · days30 · serviceCompany
- B3 · Emergency alarm answered · Emergency alarm not answered within limit · measurement seconds · ≤ 30 · Cl. 4.3.1 · **immediate** · serviceCompany
- B4 · Door reversal device operates on obstruction · Car door reversal device not operating · passFail · — · Cl. 4.5.2 · **immediate** · serviceCompany · photo
- B5 · Car mirror intact · Car mirror cracked · passFail · — · Cl. 4.6.1 · days90 · serviceCompany
- B6 · Rated load and passenger notice legible · Rated load notice missing or illegible · passFail · — · Cl. 4.6.3 · days90 · owner
- B7 · Levelling accuracy, worst floor · Levelling accuracy out of tolerance · measurement mm · ≤ 10 · Cl. 4.4.1 · days30 · serviceCompany

**C. Landing doors and shaft**
- C1 · Landing door interlocks operate correctly · Landing door interlock defective · passFail · — · Cl. 5.2.1 · **immediate** · serviceCompany · photo
- C2 · Door closing force · Door closing force exceeds limit · measurement N · ≤ 150 · Cl. 5.2.4 · days30 · serviceCompany
- C3 · Landing call buttons and indicators functional · Landing call button not functional · passFail · — · Cl. 5.3.2 · days90 · serviceCompany
- C4 · Shaft lighting functional · Shaft lighting not functional · passFail · — · Cl. 5.4.1 · days30 · owner
- C5 · No unauthorised storage or services in shaft · Unauthorised storage or services in shaft · passFail · — · Cl. 5.5.3 · days30 · owner · photo

**D. Pit**
- D1 · Pit clean and free of water · Water present in lift pit · passFail · — · Cl. 6.1.2 · days30 · owner · photo
- D2 · Pit stop switch functional · Pit stop switch not functional · passFail · — · Cl. 6.2.1 · **immediate** · serviceCompany
- D3 · Buffers secure, oil level correct · Buffer insecure or oil level low · passFail · — · Cl. 6.3.1 · days30 · serviceCompany
- D4 · Pit access ladder secure · Pit access ladder insecure · passFail · — · Cl. 6.1.4 · days30 · serviceCompany

**E. Suspension, safety gear and brake**
- E1 · Broken wires per rope lay, worst rope · Broken wires exceed limit · measurement count · ≤ 4 · Cl. 7.1.3 · **immediate** · serviceCompany
- E2 · Rope diameter, minimum measured · Rope diameter below minimum · measurement mm · ≥ 12.4 · Cl. 7.1.5 · **immediate** · serviceCompany
- E3 · Safety gear engages under test · Safety gear failed to engage under test · passFail · — · Cl. 7.3.1 · **immediate** · serviceCompany · photo
- E4 · Overspeed governor test within 12 months · Overspeed governor test overdue · dateCheck · — · Cl. 7.4.2 · days30 · serviceCompany
- E5 · Brake holds 125% of rated load · Brake failed to hold 125% of rated load · passFail · — · Cl. 7.5.1 · **immediate** · serviceCompany

**F. Signage and emergency provisions**
- F1 · Emergency release equipment present and accessible · Emergency release equipment missing or inaccessible · passFail · — · Cl. 8.1.1 · days30 · serviceCompany
- F2 · Emergency contact signage correct and legible · Emergency contact signage incorrect or illegible · passFail · — · Cl. 8.2.1 · days90 · owner
- F3 · Out-of-service notice available · No out-of-service notice available · passFail · — · Cl. 8.3.1 · nextInspection · owner

## 10. Screens

Four of these carry the demo. Build those brilliantly rather than nine adequately: register, inspection form, stop-use interstitial, defect worklist.

1. **Lift register** — landing screen. Grouped by building. Each row: label, official number in Plex Mono, type icon, and a compliance clock reading days to next due or days overdue. The clock is the hero element; lead with it, not with summary tiles. Search by building name, official number, or the lift's label: typing "goods" and getting nothing is a dead end in front of an audience.

**The clock reads days inside 90 days and months beyond it**, and overdue is always in days. Six of the eight seeded lifts sit more than a year out, where "Due in 681 days" is a number nobody converts while holding a phone, which left the hero element doing no work on most of the register. Ninety days is the longest horizon the form grades to. The exact date stays in the lift's identity block. A lift with `stopUseInForce` carries a `stop`-coloured left border and reads as not for use.
2. **Lift detail** — full identity block, inspection history with verification codes, open and closed defects. Primary action: Start inspection. QR entry lands here.
3. **Inspection form** — per section 9.
4. **Stop-use interstitial** — full-bleed `stop`. States plainly that no person may be conveyed until the defect is rectified. Lists who is being notified, regulator included. One action: Acknowledge. The single place to spend visual boldness; everything else stays quiet so this lands.
5. **Defect review** — all fails collected with severity, computed due date, and a responsibility toggle the inspector can override. Running count by severity.
6. **Sign off** — summary, inspector identity and registration, final signature pad, submit.
7. **Report** — see section 11.
8. **Distribution** — four recipients with recorded timestamps, clearly labelled as simulated. Print / save PDF.
9. **Defect worklist** — technician and owner personas, scoped per section 6, overdue first. Open one, attach evidence photo, sign, close. Both a photograph and a signature are required to close: the loop is worth nothing if an obligation can be ticked off without proof. Computed reminder history rendered inline on the defect. There is no separate outbox screen: a screen full of fake emails invites scrutiny of the fake emails.
10. **Portfolio exposure** — owner persona. Kestrel's three lifts, with whatever is actually true at the demo date. The figures quoted here — one overdue inspection, two open defects one of which is overdue — describe the **seeded** state, and the demo script changes exactly those facts before you reach this screen: it inspects Lift 1, which resets its clock, and closes the cracked mirror. At Day 45 after a scripted run the honest figures are no overdue inspections, four open obligations all overdue, and one lift out of service. The screen reports live truth, so it can never be caught disagreeing with the story the room just watched. The number attached to the exposure is counts and days, not currency: there is no cost data in this model and an invented rand figure is fake precision. Whoever in the room is thinking about who pays is thinking about portfolio risk, not checklists. This is where an inspector tool becomes a business.
11. **Verify** — `/verify/:code`. Minimal public record, no chrome, no nav.

## 11. The report

It must not look like an app screen with a download button. This industry's currency is the certificate in the machine compartment. If the output looks like a web page, the room quietly discounts everything else.

- Reversed Interlock mark in the letterhead, inspection service provider name, SANAS placeholder number.
- Building, address, owner entity. Lift identity block with the official number in Plex Mono.
- Every section, every item, every response, measurements with units.
- Inspector name, registration number, rendered signature per section and final signature, dated.
- Defect schedule with severity, responsibility and due dates.
- "Captured offline, synced at HH:MM" where applicable.
- Verification code and QR, and a footer on every page carrying the building, lift, official number, verification code and date.
- The placeholder notice, as the same amber banner the form carries. Not a diagonal watermark.
- A dedicated print stylesheet: A4, hairline rules, no interactive chrome, page-break control so sections do not split mid-item.

**Measured on real A4 proofs**, rendered from the deployed site with headless Chrome:

- A complete certificate is 4 pages. `break-inside: avoid` holds on every item row and defect row, and `break-after: avoid` on every section header, so no item splits across a page.
- **Page `n of m` is not in the document.** Chrome supports neither `@page` margin boxes nor CSS page counters, and section 5 rules out a PDF library. Leave "Headers and footers" ticked in the print dialog and Chrome supplies page numbers. The in-document footer carries the identity instead, which is the part that matters in a steel cabinet.
- **The running footer sits tight to the last line on a page that fills.** A `position: fixed` footer reserves no space in the flow. Three fixes were each proofed on A4 and each traded the problem for a worse one: a negative offset into the page margin is clipped away entirely, and `display: table-footer-group` reserves the space correctly but stops painting its contents. The current version is the best of the three. A gap of a few points, not an overlap, on a full page.

**Demo the certificate on the projected desktop window, not the phone.** iOS Safari's print sheet is a thumbnail with no page-break fidelity, which makes the one beat that has to look like paper the weakest thing on that device. Phone for the pit, laptop for the certificate.

## 12. Demo controls

Slide-over panel, always reachable, visually distinct from the app so nobody mistakes it for a feature.

One exception: the trigger is hidden on the report and the sticker sheet. Those two surfaces exist to not look like an app, and a floating operator pill in the corner of the certificate is the most app-like thing in that frame at the moment the beat has to land as paper. It returns as soon as you navigate off them.

- **Persona switch** — the three roles.
- **Demo date** — defaults 2026-09-08. Changing it recalculates every overdue state and recomputes reminders. This is how the escalation beat happens live instead of in thirty days.
- **Fill remaining as pass** — sets every unanswered item in the current inspection to pass. Lets you sign off a complete certificate after touching only the items the script needs.
- **Connection** — a simulated offline toggle, in addition to real airplane mode working via `navigator.onLine`.
- **Jump to state** — Fresh register · Mid-inspection on Kestrel Lift 1 · Two open defects on Kestrel Lift 2 · Stop-use in force.
- **Reset demo data.**

## 13. The build list

### Tier 1 — the demo does not run without these

1. Scaffold: Vite, Tailwind with the named palette, IBM Plex loaded, tabular numerals global, first commit.
2. Logo component, both variants.
3. Data model, seed file, context, `localStorage` persistence with the 7.3 rules.
4. Lift register with compliance clocks and search.
5. Lift detail with identity block, history, and the `formId: null` scope statement.
6. Inspection form: six sections, three response types, commit-time range evaluation, progress strip, section signature pads, free navigation.
7. Clause bottom sheet with scroll-position return.
8. Photo capture on fail with downscaling and the blocking rule.
9. Stop-use interstitial and `stopUseInForce`.
10. Defect review with severity grading and responsibility override.
11. Sign off and final signature.
12. Report route with print stylesheet, verification code, QR, **and `/verify/:code`**.
13. Distribution list.
14. Defect worklist for technician and owner, scoped per section 6, with photo-evidence closure and signature. Ships with a minimal persona toggle, absorbed by item 17.
15. Computed reminders per 7.2, rendered inline on the defect.
16. `BroadcastChannel` cross-window sync, gated on `navigator.onLine`, with queue indicator and flush.
17. Demo controls panel: persona, date, fill remaining as pass, connection, jump-to-state, reset.
18. QR entry route `/l/:officialNumber` and a printable sticker sheet at `/stickers`.
19. Portfolio exposure screen.
20. Empty and stop-use states written properly.
21. Deploy to a public URL.

### Tier 2 — polish, in this order, only if time remains

22. Seeded historical inspections rendered as a browsable history rather than a list. **Built:** `/lift/:liftId/history` states the interval between inspections so the two-year cycle is visible, and the report carries Earlier and Later navigation between that lift's reports. Elapsed time follows the same rule as the clock: days, then months, then whole years. No trend charting of readings, which is Tier 3.
23. Resume a partially completed inspection across a session. **Built:** the section and scroll offset are kept in their own storage key, outside the data model and outside the payload that syncs between windows, and cleared at sign-off.
24. Report page-break refinement. **Built:** orphans and widows set to 3, a section signature can no longer be pushed alone onto the next page, table headers repeat explicitly across a break, and sections carry a bottom margin. Measured on A4: a complete certificate is 4 pages, the addendum 1.
25. A second report variant showing the closed-defect addendum. **Built:** `/inspection/:inspectionId/addendum`, referencing the parent report's verification code rather than minting its own. Per closed defect: severity, responsibility, raised, due and closed dates, who closed it, the evidence photograph and the closure signature. Anything still open is listed with its computed reminder count.

### Tier 3 — do not build

Named so the room can see they were considered, not forgotten. Say this out loud rather than showing it.

Server-backed sync and conflict resolution · two-device sync · real auth and role management · voice-driven capture · inspector scheduling and routing · maintenance job-card integration · owner billing · regulator submission channel · real notification delivery · document versioning and ten-year retention · multi-tenant isolation · escalator, goods and dumbwaiter forms · form builder UI · SANS clause licensing · bulk lift import · photo annotation · rope-condition trending · predictive due-date planning · signature certificate infrastructure · POPIA consent tooling · white-labelling · property management API.

## 14. Demo script

A dated story, not a screen tour. Say the dates out loud. Feature tours are forgettable; a story with dates in it is repeatable, which matters because they will re-tell it without you.

Two surfaces: **phone** in your hand, and **laptop** projected with two browser windows side by side, inspector left and technician right.

**Before you touch anything.** Fifteen seconds on a photographed, handwritten, coffee-stained comprehensive report. Say nothing clever. The contrast does work no feature can.

**Day 0, 08:40 — arrival. Phone.** Scan the QR sticker. Interlock opens on Kestrel House Lift 1. Twenty-five days overdue. Say what that means legally.

**Day 0, 08:41 — no signal. Phone.** Airplane mode on, without announcing it in advance. Then point at the status bar and the queue indicator.

**Day 0, 08:45 — the inspection. Phone.** Section A, type 47 into machine compartment temperature, tap done, let it fail. On A5 tap the clause reference, show the sheet, come straight back to the same spot. Jump to D, fail the pit on water, photograph it. Then E3, safety gear.

**Day 0, 08:52 — stop-use. Phone.** Let the red screen take over. Read the line about no person being conveyed. Acknowledge.

**Day 0, 08:55 — grading. Phone.** Water in the pit goes to the building owner, safety gear stays with the lift company. Fill remaining as pass from the demo panel. Sign. Submit. Note that the queue indicator is still holding everything.

**Day 0, 09:10 — signal returns. Phone, then laptop.** Airplane mode off. The queue flushes. Move to the projected laptop: the defects have landed in the technician window. This beat is only honest because of the `navigator.onLine` gate in 5.1.

**Day 0, 09:15 — the certificate. Laptop.** Open the print preview in the inspector window. Let it sit on screen while you talk about the steel cabinet in the machine room.

**Day 0, 14:20 — closure. Laptop, technician window.** S. Ndlovu closes the cracked mirror on Kestrel Lift 2 with a photo and a signature.

**Day 31 — nobody fixed the pit. Laptop.** Advance the demo date in the panel. The computed reminder history fills in for every party.

**Day 45 — the portfolio. Laptop, owner persona.** N. Mokoena's view. One overdue inspection, one lift out of service, two open obligations, and a number attached to it.

Seven minutes covering ninety days.

## 15. How to end the meeting

The failure mode with this audience is not disbelief. It is polite agreement hiding four incompatible mental models. End deliberately: put up three forks and let them argue.

1. **Who owns the record** — the inspection firm, or the building owner?
2. **Does the inspector re-verify a closure**, or does the technician's photo and signature close it?
3. **Who pays** — the inspector's firm as a tool, the lift company as a workflow, or the building owner as compliance cover?

Watching the app made those questions concrete. Asking them cold at the start of a build would not have.

## 16. Parked regulatory questions

Not needed to build. Needed before anything real gets built.

- Which annexure forms apply to which equipment, and the real item wording.
- Licensing of the standard's text from SABS, or link-only referencing.
- Whether graded defect timeframes are regulatory or industry practice.
- Legal weight of an on-screen signature on a statutory report.
- Whether any electronic submission channel to the regulator exists.
- Offline-first architecture. The single biggest real-build risk.
- Enforcing the separation between inspection service provider and maintenance company, rather than merely recording it.
