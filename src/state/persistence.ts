/**
 * localStorage mirroring, per brief 7.3.
 *
 * Quota is around 5MB and a raw phone photo base64-encoded is 3 to 8MB, so
 * captured images are downscaled before they ever reach state (item 8). Even so,
 * a write can fail. When it does the app keeps running in memory and says so
 * once. Nothing here is allowed to throw into the render path.
 */

import type { PersistedState } from './types'

export const STORAGE_KEY = 'interlock.v1'
export const STATE_VERSION = 1

export type SaveResult = 'saved' | 'quota' | 'unavailable'

export function loadState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedState
    // A version bump discards the old shape rather than migrating it.
    if (parsed?.version !== STATE_VERSION) return null
    if (!Array.isArray(parsed.lifts) || !Array.isArray(parsed.defects)) return null
    return parsed
  } catch {
    return null
  }
}

export function saveState(state: PersistedState): SaveResult {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return 'saved'
  } catch (error) {
    const quota =
      error instanceof DOMException &&
      (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
    return quota ? 'quota' : 'unavailable'
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing to do. The in-memory reset has already happened.
  }
}
