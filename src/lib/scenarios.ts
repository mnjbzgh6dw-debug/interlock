/**
 * Jump-to-state, per brief section 12. Each scenario builds a whole state from
 * the seed, so jumping is repeatable and never depends on what happened before.
 */

import { seedState } from '../state/context'
import type { PersistedState } from '../state/types'
import { formPassengerA } from '../data/form-passenger-a'
import { personaById } from '../data/personas'
import { createInspection } from './inspection'
import { dueDateFor } from './dates'
import { defectIdFor } from './defects'

export type Scenario = {
  id: string
  label: string
  /** Where to land after loading. */
  path: (state: PersistedState) => string
  build: () => PersistedState
}

/**
 * Exported for the guided walkthrough's preconditions. Deliberately not added to
 * the `scenarios` array below: DemoControls maps that unconditionally, so
 * anything in it also becomes a jump-to-state button in the panel.
 */
export function base(): PersistedState {
  return { ...seedState(), persona: 'inspector' }
}

/** A part-walked section A, so the form opens with work already in it. */
export function midInspection(): PersistedState {
  const state = base()
  const lift = state.lifts.find((l) => l.id === 'lift-k1')!
  const inspection = createInspection(
    lift,
    personaById.get('inspector')!,
    state.demoDate,
    false,
  )
  inspection.responses = {
    A1: { result: 'pass' },
    A2: { result: 'pass', value: '24' },
    A3: { result: 'pass' },
  }
  state.inspections = [...state.inspections, inspection]
  return state
}

/** Kestrel Lift 1 out of use, with the immediate defect standing against it. */
export function stopUseInForce(): PersistedState {
  const state = base()
  const lift = state.lifts.find((l) => l.id === 'lift-k1')!
  const inspection = createInspection(
    lift,
    personaById.get('inspector')!,
    state.demoDate,
    false,
  )
  const item = formPassengerA.sections
    .flatMap((section) => section.items)
    .find((entry) => entry.id === 'E3')!

  inspection.responses = { E3: { result: 'fail' } }
  inspection.completedAt = `${state.demoDate}T09:05:00+02:00`
  inspection.finalSignature = null

  state.inspections = [...state.inspections, inspection]
  state.lifts = state.lifts.map((entry) =>
    entry.id === lift.id ? { ...entry, stopUseInForce: true } : entry,
  )
  state.defects = [
    ...state.defects,
    {
      id: defectIdFor(inspection.id, item.id),
      inspectionId: inspection.id,
      liftId: lift.id,
      itemId: item.id,
      description: item.failDescription,
      severity: item.failSeverity,
      responsibility: item.defaultResponsibility,
      raisedDate: state.demoDate,
      dueDate: dueDateFor(item.failSeverity, state.demoDate, lift),
      status: 'open',
      raisedPhoto: null,
      evidencePhoto: null,
      closedBy: null,
      closedAt: null,
      closureSignature: null,
    },
  ]
  return state
}

export const scenarios: Scenario[] = [
  {
    id: 'fresh',
    label: 'Fresh register',
    build: base,
    path: () => '/',
  },
  {
    id: 'mid-inspection',
    label: 'Mid-inspection on Kestrel Lift 1',
    build: midInspection,
    path: () => '/lift/lift-k1/inspection',
  },
  {
    id: 'two-defects',
    label: 'Two open defects on Kestrel Lift 2',
    build: base,
    path: () => '/lift/lift-k2',
  },
  {
    id: 'stop-use',
    label: 'Stop-use in force',
    build: stopUseInForce,
    path: () => '/',
  },
]
