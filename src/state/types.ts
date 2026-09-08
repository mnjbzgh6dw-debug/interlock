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
  /** Writes made while offline and not yet pushed to other windows. */
  queuedWrites: number
  /** When the queue last flushed, for the confirmation. */
  lastSyncedAt: string | null
  /**
   * navigator.onLine, tracked in state so the indicator reacts the moment
   * airplane mode goes on. The demo script points at it before any write.
   */
  networkOnline: boolean
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
  | { type: 'setQueued'; count: number }
  | { type: 'setNetworkOnline'; online: boolean }
  | { type: 'markSynced'; at: string }
  /** Inbound state from another window. Never carries persona. */
  | { type: 'hydrate'; payload: Omit<PersistedState, 'persona'> }
  /** Jump-to-state from the demo controls. */
  | { type: 'loadScenario'; payload: PersistedState }
  | { type: 'reset' }
