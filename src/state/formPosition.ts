/**
 * Where the inspector was in the form, per Tier 2 item 23.
 *
 * Kept in its own storage key, deliberately outside the data model and outside
 * the payload that crosses between windows. A scroll offset is not part of a
 * statutory record, and the technician's window has no interest in where the
 * inspector had scrolled to.
 *
 * Everything here is wrapped: a failure to remember a position must never cost
 * anyone an inspection.
 */

const KEY = 'interlock.form-position.v1'

export type FormPosition = { sectionId: string; scrollY: number }

type Store = Record<string, FormPosition>

function read(): Store {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Store) : {}
  } catch {
    return {}
  }
}

function write(store: Store): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(store))
  } catch {
    // The position is a convenience. Losing it is not worth a thrown error.
  }
}

export function loadPosition(inspectionId: string): FormPosition | null {
  return read()[inspectionId] ?? null
}

export function savePosition(inspectionId: string, position: FormPosition): void {
  const store = read()
  store[inspectionId] = position
  write(store)
}

/** Called on sign-off: a completed inspection has no position to return to. */
export function clearPosition(inspectionId: string): void {
  const store = read()
  if (!(inspectionId in store)) return
  delete store[inspectionId]
  write(store)
}
