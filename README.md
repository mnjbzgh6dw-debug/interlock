# Interlock

**Nothing moves until it's closed.**

A demo-only proof of concept for statutory lift inspection: from the machine room,
to the certificate, to the closed defect. Shown once, on a phone and a projected
laptop. Not production software.

Live: https://mnjbzgh6dw-debug.github.io/interlock/

## Running it

```
npm i && npm run dev
```

## What this is not

- All data is fictitious. Buildings, lifts, official numbers, people and email
  addresses are invented, and every address is on a `.example` domain.
- Checklist items and clause references are illustrative placeholders written from
  scratch. No text from the published standard appears anywhere: SANS text is SABS
  copyright and paywalled.
- Nothing is ever sent. Notifications, distribution lists and reminders are
  recorded in the app only.
- There is no server and no authentication. State lives in the browser.

## Deploying

```
npm run deploy
```

Builds and publishes to the `gh-pages` branch via a throwaway git worktree.
GitHub Pages has no rewrite rules, so `404.html` is a copy of `index.html`: a deep
link such as `/verify/:code` is served that copy and the router takes it from
there. Deep links therefore load correctly but report a 404 status.

The specification is `BRIEF.md`. The working agreement is `CLAUDE.md`.
