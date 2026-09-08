/**
 * The role tours and the comprehensive one.
 *
 * No new copy: every step here comes from a workflow group. That is what the
 * precondition key is for — inside a long tour the group before has already
 * applied the same key, so the state carries forward rather than resetting, and
 * the viewer watches one continuous story instead of six disconnected demos.
 */

import { registerSteps } from './register'
import { liftRecordSteps } from './liftRecord'
import { offlineSteps } from './offline'
import { checklistSteps } from './checklist'
import { clauseSheetSteps } from './clauseSheet'
import { photoSteps } from './photo'
import { stopUseSteps } from './stopUse'
import { defectReviewSteps } from './defectReview'
import { signOffSteps } from './signOff'
import { reportSteps } from './report'
import { distributionSteps } from './distribution'
import { verificationSteps } from './verification'
import { closureSteps } from './closure'
import { addendumSteps } from './addendum'
import { reminderSteps } from './reminders'
import { portfolioSteps } from './portfolio'
import type { TourStep } from '../types'

/** What an inspector's morning actually consists of. */
export function inspectorSteps(): TourStep[] {
  return [
    ...registerSteps().slice(0, 3),
    ...liftRecordSteps(),
    ...checklistSteps(),
    ...clauseSheetSteps().slice(1),
    ...photoSteps(),
    ...stopUseSteps(),
    ...defectReviewSteps(),
    ...signOffSteps(),
    ...reportSteps().slice(0, 4),
  ]
}

/** The obligations that land on the company holding the maintenance contract. */
export function technicianSteps(): TourStep[] {
  return [...closureSteps(), ...addendumSteps().slice(1)]
}

/** What the building owner is carrying, and why it is theirs. */
export function ownerSteps(): TourStep[] {
  return [...reminderSteps(), ...portfolioSteps()]
}

/**
 * Section 14 end to end: seven minutes covering ninety days. The same beats in
 * the same order, on rails.
 */
export function comprehensiveSteps(): TourStep[] {
  return [
    ...registerSteps().slice(0, 3),
    ...liftRecordSteps().slice(0, 2),
    ...offlineSteps().slice(0, 2),
    ...checklistSteps().slice(1),
    ...clauseSheetSteps().slice(1),
    ...photoSteps(),
    ...stopUseSteps(),
    ...defectReviewSteps(),
    ...signOffSteps(),
    ...reportSteps(),
    ...distributionSteps(),
    ...verificationSteps(),
    ...closureSteps(),
    ...addendumSteps(),
    ...reminderSteps().slice(1),
    ...portfolioSteps(),
  ]
}
