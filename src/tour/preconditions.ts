/**
 * Named state preconditions for tour steps.
 *
 * Built on the same builders the demo panel's jump-to-state uses, but
 * deliberately not added to the `scenarios` array: the panel maps that
 * unconditionally, so anything in it becomes a jump-to-state button too.
 */

import { base, midInspection, stopUseInForce } from '../lib/scenarios'
import type { Precondition } from './types'

/** The seeded register, nothing touched. */
export const fresh: Precondition = { key: 'fresh', build: base }

/** Part-walked section A on Kestrel Lift 1. */
export const midInspectionOnK1: Precondition = { key: 'mid-inspection', build: midInspection }

/** Kestrel Lift 1 out of use, with the immediate defect standing against it. */
export const stopUse: Precondition = { key: 'stop-use', build: stopUseInForce }

/**
 * Carry the previous step's state forward untouched. A step group used inside
 * the comprehensive tour uses this so it does not reset what the group before
 * it just built.
 */
export function carryOn(key: string): Precondition {
  return { key, build: base }
}
