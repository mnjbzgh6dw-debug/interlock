/**
 * The whole application state, per brief section 5.
 *
 * Local-first, unconditionally: every write lands in the reducer and is mirrored
 * to localStorage, with no network anywhere in the path. Cross-window sync
 * arrives at item 16 and sits downstream of this, gated on navigator.onLine, so
 * it can never become a precondition for a write.
 */

import { useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react'
import { clearState, loadState, saveState } from './persistence'
import { reducer, seedState, StoreContext, type Store } from './context'
import type { AppState, PersistedState } from './types'

function initialState(): AppState {
  return {
    ...(loadState() ?? seedState()),
    connection: 'online',
    storageFull: false,
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)
  const lastSaved = useRef<string>('')

  // Mirror to storage on every write. The first pass also writes the seed, so a
  // fresh browser has a record before anything is touched.
  useEffect(() => {
    const persisted: PersistedState = {
      version: state.version,
      demoDate: state.demoDate,
      persona: state.persona,
      lifts: state.lifts,
      inspections: state.inspections,
      defects: state.defects,
    }
    const serialised = JSON.stringify(persisted)
    if (serialised === lastSaved.current) return
    if (saveState(persisted) === 'saved') {
      lastSaved.current = serialised
    } else {
      dispatch({ type: 'storageFull' })
    }
  }, [state])

  const value = useMemo<Store>(
    () => ({
      state,
      setPersona: (persona) => dispatch({ type: 'setPersona', persona }),
      setDemoDate: (date) => dispatch({ type: 'setDemoDate', date }),
      setConnection: (connection) => dispatch({ type: 'setConnection', connection }),
      saveLift: (lift) => dispatch({ type: 'setLift', lift }),
      saveInspection: (inspection) => dispatch({ type: 'putInspection', inspection }),
      saveDefect: (defect) => dispatch({ type: 'putDefect', defect }),
      saveDefects: (defects) => dispatch({ type: 'setDefects', defects }),
      resetDemoData: () => {
        clearState()
        lastSaved.current = ''
        dispatch({ type: 'reset' })
      },
    }),
    [state],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
