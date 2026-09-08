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
import marais from '../assets/signatures/j-marais.svg'
import botha from '../assets/signatures/m-botha.svg'
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

/**
 * A fresh inspection on Kestrel Lift 1, with the given responses already in.
 *
 * The id and verification code are fixed rather than generated. `createInspection`
 * derives both from the clock and a random, which would mean a step whose route
 * contains the id could never match the state built when that step runs.
 */
export const TOUR_INSPECTION_ID = 'insp-tour-k1'
export const TOUR_VERIFICATION_CODE = 'IL-K1-0809-T0UR'

function inspectionWith(responses: Record<string, { result: 'pass' | 'fail'; value?: string; photo?: string }>): PersistedState {
  const state = base()
  const lift = state.lifts.find((entry) => entry.id === 'lift-k1')!
  const inspection = createInspection(
    lift,
    personaById.get('inspector')!,
    state.demoDate,
    false,
  )
  inspection.id = TOUR_INSPECTION_ID
  inspection.verificationCode = TOUR_VERIFICATION_CODE
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
 * A report issued today on Kestrel Lift 1: signed, distributed, three defects
 * raised and the lift out of service. What the demo script produces by 08:56,
 * and the starting point for everything downstream of the certificate.
 */
export const issuedReport: Precondition = {
  key: 'issued-report',
  build: () => {
    const state = readyToSign.build()
    const inspection = state.inspections[state.inspections.length - 1]
    const at = `${state.demoDate}T08:56:00+02:00`
    inspection.completedAt = at
    inspection.finalSignature = marais
    inspection.sectionSignatures = Object.fromEntries(
      formPassengerA.sections.map((section) => [section.id, marais]),
    )
    inspection.distributedTo = [
      { recipient: 'N. Mokoena, n.mokoena@kestrelprop.example', role: 'Building owner', sentAt: at },
      { recipient: 'dispatch@vertexlifts.example', role: 'Lift company', sentAt: at },
      { recipient: 'records@capevertical.example', role: 'Inspection service provider', sentAt: at },
      { recipient: 'lifts@labour.example', role: 'Regulator', sentAt: at },
    ]
    // Issuing a report restarts the clock, per brief 7.1.
    state.lifts = state.lifts.map((lift) =>
      lift.id === 'lift-k1'
        ? { ...lift, lastReportDate: state.demoDate, nextDueDate: '2028-09-08' }
        : lift,
    )
    return state
  },
}

/** The same report, with its car-mirror defect closed by the technician. */
export const closedDefect: Precondition = {
  key: 'closed-defect',
  build: () => {
    const state = issuedReport.build()
    const inspection = state.inspections[state.inspections.length - 1]
    state.defects = state.defects.map((defect) =>
      defect.inspectionId === inspection.id && defect.itemId === 'D1'
        ? {
            ...defect,
            status: 'closed' as const,
            evidencePhoto: pitWater,
            closureSignature: botha,
            closedBy: 'N. Mokoena, Kestrel Property Holdings',
            closedAt: `${state.demoDate}T14:20:00+02:00`,
          }
        : defect,
    )
    return state
  },
}

/** Day 31: nobody fixed the pit, and the reminders have been firing. */
export const day31: Precondition = {
  key: 'day-31',
  build: base,
  demoDate: '2026-10-09',
}

/** Day 45: the owner's view of what the portfolio is carrying. */
export const day45: Precondition = {
  key: 'day-45',
  build: issuedReport.build,
  demoDate: '2026-10-23',
}

/**
 * Mid-inspection with no signal. The queued count cannot be seeded, because it
 * only rises when the push effect sees a changed payload while offline, so the
 * tour has to make a real write to move it. Faking it is impossible, which is
 * the same honesty the navigator.onLine gate exists for.
 */
export const offlineCapture: Precondition = {
  key: 'offline-capture',
  build: midInspection,
  connection: 'offline',
}

/**
 * Note on continuing: there is no separate "carry on" precondition. A group
 * reuses the same precondition object for every one of its steps, and the
 * engine skips the load when the key already matches. That way a group works
 * standalone, where its first step loads the state cold, and inside a long tour,
 * where the group before it has already applied the same key.
 */
