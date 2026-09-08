/**
 * Named state preconditions for tour steps.
 *
 * Built on the same builders the demo panel's jump-to-state uses, but
 * deliberately not added to the `scenarios` array: the panel maps that
 * unconditionally, so anything in it becomes a jump-to-state button too.
 */

import { base, midInspection, stopUseInForce } from '../lib/scenarios'
import { formPassengerA } from '../data/form-passenger-a'
import { personaById } from '../data/personas'
import { createInspection } from '../lib/inspection'
import { dueDateFor } from '../lib/dates'
import { defectIdFor } from '../lib/defects'
import pitWater from '../assets/photos/def-001-pit-water.jpg'
import type { PersistedState } from '../state/types'
import type { Precondition } from './types'

/** The seeded register, nothing touched. */
export const fresh: Precondition = { key: 'fresh', build: base }

/** Part-walked section A on Kestrel Lift 1. */
export const midInspectionOnK1: Precondition = { key: 'mid-inspection', build: midInspection }

/** Kestrel Lift 1 out of use, with the immediate defect standing against it. */
export const stopUse: Precondition = { key: 'stop-use', build: stopUseInForce }

const items = formPassengerA.sections.flatMap((section) => section.items)
const itemById = (id: string) => items.find((item) => item.id === id)!

/** A fresh inspection on Kestrel Lift 1, with the given responses already in. */
function inspectionWith(responses: Record<string, { result: 'pass' | 'fail'; value?: string; photo?: string }>): PersistedState {
  const state = base()
  const lift = state.lifts.find((entry) => entry.id === 'lift-k1')!
  const inspection = createInspection(
    lift,
    personaById.get('inspector')!,
    state.demoDate,
    false,
  )
  inspection.responses = responses
  state.inspections = [...state.inspections, inspection]
  return state
}

/**
 * One tap from the failure that raises the stop-use order. Section E is walked
 * up to E3 so the tour's own click is the thing that fires the red screen: the
 * interstitial lives in the form's local state and cannot be loaded.
 */
export const sectionEReady: Precondition = {
  key: 'section-e-ready',
  build: () =>
    inspectionWith({
      E1: { result: 'pass', value: '1' },
      E2: { result: 'pass', value: '12.9' },
    }),
}

/**
 * The pit already failed and photographed, using the committed asset. The tour
 * must never open the camera: a real capture per run is how you reach a full
 * storage quota in front of an audience.
 */
export const pitPhotographed: Precondition = {
  key: 'd1-photographed',
  build: () => inspectionWith({ D1: { result: 'fail', photo: pitWater } }),
}

/** Both pit and safety gear failed, ready for grading. */
export const readyToGrade: Precondition = {
  key: 'ready-to-grade',
  build: () => {
    const state = inspectionWith({
      A2: { result: 'fail', value: '47' },
      D1: { result: 'fail', photo: pitWater },
      E3: { result: 'fail', photo: pitWater },
    })
    const inspection = state.inspections[state.inspections.length - 1]
    const lift = state.lifts.find((entry) => entry.id === 'lift-k1')!
    state.lifts = state.lifts.map((entry) =>
      entry.id === lift.id ? { ...entry, stopUseInForce: true } : entry,
    )
    state.defects = [
      ...state.defects,
      ...['A2', 'D1', 'E3'].map((id) => {
        const item = itemById(id)
        return {
          id: defectIdFor(inspection.id, id),
          inspectionId: inspection.id,
          liftId: lift.id,
          itemId: id,
          description: item.failDescription,
          severity: item.failSeverity,
          responsibility: item.defaultResponsibility,
          raisedDate: state.demoDate,
          dueDate: dueDateFor(item.failSeverity, state.demoDate, lift),
          status: 'open' as const,
          raisedPhoto: inspection.responses[id]?.photo ?? null,
          evidencePhoto: null,
          closedBy: null,
          closedAt: null,
          closureSignature: null,
        }
      }),
    ]
    return state
  },
}

/** Graded and signed, one tap from being issued. */
export const readyToSign: Precondition = {
  key: 'ready-to-sign',
  build: () => {
    const state = readyToGrade.build()
    const inspection = state.inspections[state.inspections.length - 1]
    for (const item of items) {
      if (!inspection.responses[item.id]) {
        inspection.responses[item.id] = {
          result: 'pass',
          ...(item.responseType === 'measurement' ? { value: '12' } : {}),
        }
      }
    }
    return state
  },
}

/**
 * Carry the previous step's state forward untouched. A step group used inside
 * the comprehensive tour uses this so it does not reset what the group before
 * it just built.
 */
export function carryOn(key: string): Precondition {
  return { key, build: base }
}
