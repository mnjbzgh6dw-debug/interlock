/**
 * What the app looked like before a tour started, so exiting puts it back.
 *
 * Mirrored to sessionStorage under its own key, following the pattern in
 * `state/formPosition.ts`: session-scoped, outside the reducer, outside the
 * payload that syncs between windows. A refresh mid-tour would otherwise leave
 * the app in whatever state a step had loaded with no way home.
 */

import type { PersistedState } from '../state/types'

const KEY = 'interlock.tour-snapshot.v1'

export type TourSnapshot = {
  persisted: PersistedState
  connection: 'online' | 'offline'
  /** Path and query, so the viewer is returned to where they actually were. */
  href: string
}

export function writeSnapshot(snapshot: TourSnapshot): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(snapshot))
  } catch {
    // The in-memory snapshot still works for the common case.
  }
}

export function readSnapshot(): TourSnapshot | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as TourSnapshot) : null
  } catch {
    return null
  }
}

export function clearSnapshot(): void {
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    // Nothing to do.
  }
}
