/**
 * Context and reducer. Kept out of the file that exports the provider component
 * so that editing the store never breaks Fast Refresh, which tears the provider
 * down and takes every consumer with it.
 */

import { createContext } from 'react'
import type { Defect, Inspection, Lift, PersonaId } from '../types'
import { DEMO_DATE, seedDefects, seedInspections, seedLifts } from '../data/seed'
import { STATE_VERSION } from './persistence'
import type { Action, AppState, PersistedState } from './types'

export type Store = {
  state: AppState
  setPersona: (persona: PersonaId) => void
  setDemoDate: (date: string) => void
  setConnection: (connection: 'online' | 'offline') => void
  saveLift: (lift: Lift) => void
  saveInspection: (inspection: Inspection) => void
  saveDefect: (defect: Defect) => void
  saveDefects: (defects: Defect[]) => void
  loadScenario: (payload: PersistedState) => void
  /** True when writes are not being pushed: real airplane mode or the toggle. */
  offline: boolean
  resetDemoData: () => void
}

export const StoreContext = createContext<Store | null>(null)

export function seedState(): PersistedState {
  return {
    version: STATE_VERSION,
    demoDate: DEMO_DATE,
    persona: 'inspector',
    // Cloned so a reset cannot hand back objects a previous run mutated.
    lifts: structuredClone(seedLifts),
    inspections: structuredClone(seedInspections),
    defects: structuredClone(seedDefects),
  }
}

function replaceById<T extends { id: string }>(list: T[], next: T): T[] {
  const at = list.findIndex((entry) => entry.id === next.id)
  if (at === -1) return [...list, next]
  const copy = list.slice()
  copy[at] = next
  return copy
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'setPersona':
      return { ...state, persona: action.persona }
    case 'setDemoDate':
      return { ...state, demoDate: action.date }
    case 'setConnection':
      return { ...state, connection: action.connection }
    case 'setLift':
      return { ...state, lifts: replaceById(state.lifts, action.lift) }
    case 'putInspection':
      return { ...state, inspections: replaceById(state.inspections, action.inspection) }
    case 'putDefect':
      return { ...state, defects: replaceById(state.defects, action.defect) }
    case 'setDefects':
      return { ...state, defects: action.defects }
    case 'setNetworkOnline':
      return state.networkOnline === action.online ? state : { ...state, networkOnline: action.online }
    case 'setQueued':
      return state.queuedWrites === action.count ? state : { ...state, queuedWrites: action.count }
    case 'markSynced':
      return {
        ...state,
        lastSyncedAt: action.at,
        inspections: state.inspections.map((inspection) =>
          inspection.capturedOffline && !inspection.syncedAt
            ? { ...inspection, syncedAt: action.at }
            : inspection,
        ),
      }
    case 'hydrate':
      // Persona is deliberately not synced: the two windows are two people.
      return { ...state, ...action.payload }
    case 'loadScenario':
      return { ...state, ...action.payload, queuedWrites: 0 }
    case 'storageFull':
      // Returning the same object keeps a failing save from looping on itself.
      return state.storageFull ? state : { ...state, storageFull: true }
    case 'reset':
      return {
        ...seedState(),
        connection: state.connection,
        storageFull: false,
        queuedWrites: 0,
        lastSyncedAt: null,
        networkOnline: state.networkOnline,
      }
  }
}
