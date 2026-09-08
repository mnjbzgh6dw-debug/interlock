/**
 * The guided walkthrough, per the plan agreed with Dene.
 *
 * A demo instrument, not a product feature. It is reachable only from the demo
 * controls panel or an explicit `?tour=` link, and it never starts on its own:
 * that containment is what keeps it out of the onboarding non-goal in brief
 * section 3.
 *
 * The tour drives the app. The viewer presses Next and Back and nothing else,
 * so every step declares the state, persona and route it needs and the engine
 * puts the app there before showing anything.
 */

import type { PersonaId } from '../types'
import type { AppState, PersistedState } from '../state/types'

/**
 * A state precondition, identified by key rather than by content.
 *
 * The key is what makes one set of step copy serve both a short workflow tour
 * and the long comprehensive one. In a workflow tour nothing has been applied
 * yet, so the group's first step loads its state cold. Inside the comprehensive
 * tour the group before it already applied the same key, so the load is skipped
 * and the app carries forward the state the viewer just watched being built.
 *
 * Authoring rule: change the key when the copy needs a reset.
 */
export type Precondition = {
  key: string
  build: () => PersistedState
  /** Session state, applied separately from `build`. */
  demoDate?: string
  connection?: 'online' | 'offline'
}

/**
 * Something the tour does to a real control on the viewer's behalf.
 *
 * Declarative rather than a callback, so all of it can be audited across the
 * catalogue and so the engine can guard it against running twice.
 */
export type TourAct =
  /**
   * The only way to reach the stop-use interstitial: it lives in local state in
   * the form and is raised on the commit that turns an immediate item to fail.
   */
  | { kind: 'click'; anchor: string }
  /**
   * Measurements commit on blur, never on change, so setting a value is not
   * enough on its own.
   */
  | { kind: 'fill'; anchor: string; value: string }

export type TourStep = {
  id: string
  /** The date and the consequence, never the name of a feature. See below. */
  title: string
  body: string
  /** A concrete path with ids already interpolated, never a route pattern. */
  route: string
  persona: PersonaId
  precondition: Precondition
  /** What to spotlight. Absent means a card with no hole in the scrim. */
  anchor?: string
  /** Must exist before the step is ready. Defaults to `anchor`. */
  waitFor?: string
  /**
   * Dim everything but the target. Turned off on the stop-use interstitial and
   * on the printed surfaces, where the whole point is the surface at full
   * strength.
   */
  dim?: boolean
  /** Let the viewer touch the highlighted control. Off by default. */
  interactive?: boolean
  act?: TourAct
  /**
   * Checked after an act. A false result degrades the step honestly instead of
   * letting the next three steps narrate something that never happened.
   */
  expect?: (state: AppState) => boolean
  place?: 'auto' | 'top' | 'bottom'
}

export type TourKind = 'persona' | 'workflow' | 'comprehensive'

export type Tour = {
  id: string
  label: string
  blurb: string
  kind: TourKind
  steps: TourStep[]
}

/**
 * `preparing` is applying state and waiting for the anchor, `settling` is
 * scrolling it into view, `ready` is showing it, and `stuck` is an anchor that
 * never appeared. A stuck step still shows its copy and a working Next: for a
 * viewer with nobody to ask, a missing highlight is a blemish and a dead Next
 * button is the end.
 */
export type TourPhase = 'preparing' | 'settling' | 'ready' | 'stuck'

export type TourRun = { tour: Tour; index: number; phase: TourPhase } | null

export type TourControl = {
  start: (tourId: string, atStep?: number) => void
  exit: () => void
  next: () => void
  back: () => void
}
