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
    case 'storageFull':
      // Returning the same object keeps a failing save from looping on itself.
      return state.storageFull ? state : { ...state, storageFull: true }
    case 'reset':
      return { ...seedState(), connection: state.connection, storageFull: false }
  }
}
