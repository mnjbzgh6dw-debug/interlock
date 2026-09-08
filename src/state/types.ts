import type { Defect, Inspection, Lift, PersonaId } from '../types'

/** What gets mirrored to localStorage: everything the demo can change. */
export type PersistedState = {
  version: number
  demoDate: string
  persona: PersonaId
  lifts: Lift[]
  inspections: Inspection[]
  defects: Defect[]
}

/**
 * Session-only state, deliberately not persisted:
 *
 * - `connection` resets to online on reload. A simulated offline flag that
 *   survives a refresh is a mystery bug in the middle of a demo.
 * - `storageFull` is a fact about this session, not about the saved data.
 */
export type SessionState = {
  connection: 'online' | 'offline'
  storageFull: boolean
}

export type AppState = PersistedState & SessionState

export type Action =
  | { type: 'setPersona'; persona: PersonaId }
  | { type: 'setDemoDate'; date: string }
  | { type: 'setConnection'; connection: 'online' | 'offline' }
  | { type: 'setLift'; lift: Lift }
  | { type: 'putInspection'; inspection: Inspection }
  | { type: 'putDefect'; defect: Defect }
  | { type: 'setDefects'; defects: Defect[] }
  | { type: 'storageFull' }
  | { type: 'reset' }
