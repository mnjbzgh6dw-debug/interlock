/**
 * Queue state, told honestly, per brief 5.1.
 *
 * `open` while writes are held, `verified` briefly when they flush, and nothing
 * at all when there is nothing to say. The count is real: it is the number of
 * writes this window has made since it lost the ability to push them.
 */

import { useEffect, useState } from 'react'
import { useStore } from '../state/useStore'

/** How long the flush confirmation stays up. */
const CONFIRM_MS = 8000

export function SyncIndicator() {
  const { state, offline } = useStore()
  const [showSynced, setShowSynced] = useState(false)

  useEffect(() => {
    if (!state.lastSyncedAt) return
    setShowSynced(true)
    const timer = setTimeout(() => setShowSynced(false), CONFIRM_MS)
    return () => clearTimeout(timer)
  }, [state.lastSyncedAt])

  if (offline) {
    return (
      <p className="rounded-full border border-open bg-open-tint px-3 py-1.5 text-13 font-medium text-open">
        Offline
        {state.queuedWrites > 0 && (
          <>
            {' '}
            &middot; {state.queuedWrites} {state.queuedWrites === 1 ? 'write' : 'writes'} queued
          </>
        )}
      </p>
    )
  }

  if (showSynced && state.lastSyncedAt) {
    return (
      <p className="rounded-full border border-verified bg-verified-tint px-3 py-1.5 text-13 font-medium text-verified">
        Synced {state.lastSyncedAt.slice(11, 16)}
      </p>
    )
  }

  return null
}
