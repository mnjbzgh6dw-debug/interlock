/**
 * The whole application state, per brief section 5.
 *
 * Local-first, unconditionally: every write lands in the reducer and is mirrored
 * to localStorage, with no network anywhere in the path.
 *
 * Cross-window sync sits downstream of that and is gated on navigator.onLine,
 * per brief 5.1. BroadcastChannel works perfectly well offline, so without the
 * gate real airplane mode would change nothing, the defect would appear on the
 * technician's window instantly, and the sync beat in the demo script would be a
 * lie. With the gate, airplane mode genuinely queues and restoring signal
 * genuinely flushes.
 */

import { useCallback, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react'
import { clearState, loadState, saveState } from './persistence'
import { reducer, seedState, StoreContext, type Store } from './context'
import { demoTimestamp } from '../lib/dates'
import type { AppState, PersistedState } from './types'

const CHANNEL = 'interlock'

function initialState(): AppState {
  return {
    ...(loadState() ?? seedState()),
    connection: 'online',
    storageFull: false,
    queuedWrites: 0,
    lastSyncedAt: null,
    networkOnline: navigator.onLine,
  }
}

function persisted(state: AppState): PersistedState {
  return {
    version: state.version,
    demoDate: state.demoDate,
    persona: state.persona,
    lifts: state.lifts,
    inspections: state.inspections,
    defects: state.defects,
  }
}

/** What crosses between windows. Persona stays local: two windows, two people. */
function shared(state: AppState): Omit<PersistedState, 'persona'> {
  const { persona: _persona, ...rest } = persisted(state)
  return rest
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)
  const lastSaved = useRef<string>('')
  const channelRef = useRef<BroadcastChannel | null>(null)
  /** The last payload this window has pushed or accepted. */
  const lastShared = useRef<string>('')
  /** Set while applying a remote payload, so it is never echoed back. */
  const applyingRemote = useRef(false)
  /**
   * The last payload counted into the offline queue. Without this the effect
   * re-fires on its own count dispatch and the queue runs away, because
   * `lastShared` is only advanced by a successful push.
   */
  const pendingShared = useRef<string>('')

  const offline = state.connection === 'offline' || !state.networkOnline

  // Mirror to storage on every write, per brief 7.3. Nothing here can throw
  // into the render path: a failure keeps the session in memory and says so.
  useEffect(() => {
    const payload = persisted(state)
    const serialised = JSON.stringify(payload)
    if (serialised === lastSaved.current) return
    if (saveState(payload) === 'saved') {
      lastSaved.current = serialised
    } else {
      dispatch({ type: 'storageFull' })
    }
  }, [state])

  // One channel for the life of the window.
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return
    const channel = new BroadcastChannel(CHANNEL)
    channelRef.current = channel
    channel.onmessage = (event: MessageEvent<Omit<PersistedState, 'persona'>>) => {
      applyingRemote.current = true
      lastShared.current = JSON.stringify(event.data)
      dispatch({ type: 'hydrate', payload: event.data })
    }
    return () => {
      channel.close()
      channelRef.current = null
    }
  }, [])

  /**
   * Outbound push. While offline nothing leaves this window and the queue count
   * rises. queuedWrites is session-only and never part of the payload, so
   * updating it cannot re-trigger this effect.
   */
  useEffect(() => {
    const payload = shared(state)
    const serialised = JSON.stringify(payload)
    if (serialised === lastShared.current) return

    if (applyingRemote.current) {
      applyingRemote.current = false
      lastShared.current = serialised
      return
    }

    if (offline) {
      if (serialised !== pendingShared.current) {
        pendingShared.current = serialised
        dispatch({ type: 'setQueued', count: state.queuedWrites + 1 })
      }
      return
    }

    channelRef.current?.postMessage(payload)
    lastShared.current = serialised
    pendingShared.current = ''
    if (state.queuedWrites > 0) dispatch({ type: 'setQueued', count: 0 })
  }, [state, offline])

  const flush = useCallback(() => {
    const payload = shared(state)
    const serialised = JSON.stringify(payload)
    if (serialised !== lastShared.current) {
      channelRef.current?.postMessage(payload)
      lastShared.current = serialised
    }
    pendingShared.current = ''
    const at = demoTimestamp(state.demoDate)
    // Stamps "captured offline, synced at HH:MM" on anything taken offline.
    dispatch({ type: 'markSynced', at })
    dispatch({ type: 'setQueued', count: 0 })
  }, [state])

  /**
   * Real airplane mode. Both events are tracked, not just `online`: the
   * indicator has to appear the instant signal drops, before any write, because
   * that is the moment the demo script points at it.
   */
  useEffect(() => {
    function onOffline() {
      dispatch({ type: 'setNetworkOnline', online: false })
    }
    function onOnline() {
      dispatch({ type: 'setNetworkOnline', online: true })
      if (state.connection === 'offline') return
      flush()
    }
    window.addEventListener('offline', onOffline)
    window.addEventListener('online', onOnline)
    return () => {
      window.removeEventListener('offline', onOffline)
      window.removeEventListener('online', onOnline)
    }
  }, [flush, state.connection])

  const value = useMemo<Store>(
    () => ({
      state,
      offline,
      setPersona: (persona) => dispatch({ type: 'setPersona', persona }),
      setDemoDate: (date) => dispatch({ type: 'setDemoDate', date }),
      setConnection: (connection) => {
        dispatch({ type: 'setConnection', connection })
        // Coming back online through the toggle flushes the same way signal does.
        if (connection === 'online' && state.networkOnline) flush()
      },
      saveLift: (lift) => dispatch({ type: 'setLift', lift }),
      saveInspection: (inspection) =>
        dispatch({
          type: 'putInspection',
          // An inspection touched while offline is an offline capture.
          inspection: { ...inspection, capturedOffline: inspection.capturedOffline || offline },
        }),
      saveDefect: (defect) => dispatch({ type: 'putDefect', defect }),
      saveDefects: (defects) => dispatch({ type: 'setDefects', defects }),
      loadScenario: (payload) => {
        lastShared.current = ''
        pendingShared.current = ''
        dispatch({ type: 'loadScenario', payload })
      },
      resetDemoData: () => {
        clearState()
        lastSaved.current = ''
        lastShared.current = ''
        pendingShared.current = ''
        dispatch({ type: 'reset' })
      },
    }),
    [state, offline, flush],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
