/**
 * The compliance clock, per brief section 10.1. It is the hero element on the
 * register, so it computes to a phrase and a status tone, and nothing else in
 * the row competes with it.
 *
 * Tone: an overdue statutory inspection reads `stop`, because that is the most
 * serious thing on the register and red is the code already painted on the
 * equipment. `open` is the caution band inside 30 days. A lift under a stop-use
 * order is a different statement and carries its own border and pill, so the
 * two never have to be told apart by colour alone.
 */

import type { Lift, LiftType } from '../types'
import { daysBetween, monthsBetween } from './dates'

export type ComplianceTone = 'stop' | 'open' | 'verified'

export type Compliance = {
  /** The clock itself. 'Due in 55 days', '25 days overdue'. */
  label: string
  tone: ComplianceTone
  /** Days to the next due date. Negative when overdue, null when never inspected. */
  days: number | null
}

/** Inside this many days the clock moves to caution. */
export const CAUTION_DAYS = 30

/**
 * Beyond this, the countdown is stated in months.
 *
 * Days are what matter when something is overdue or close, and the brief asks
 * for a countdown rather than a date. But "Due in 681 days" is a number nobody
 * converts while holding a phone, and six of the eight seeded lifts sit that far
 * out, which left the hero element on the register doing no work. Ninety days is
 * already a meaningful line here: it is the longest horizon the form grades to.
 *
 * The exact date is not lost. It stays in the lift's identity block.
 */
export const DAYS_HORIZON = 90

/**
 * The countdown phrase, shared by the register, the lift, the portfolio and the
 * defect screens so they can never disagree about the same interval.
 */
export function countdownLabel(from: string, to: string): string {
  const days = daysBetween(from, to)
  if (days < 0) return `${Math.abs(days)} days overdue`
  if (days === 0) return 'Due today'
  if (days <= DAYS_HORIZON) return `Due in ${days} days`
  const months = monthsBetween(from, to)
  return `Due in ${months} ${months === 1 ? 'month' : 'months'}`
}

export function complianceFor(lift: Lift, demoDate: string): Compliance {
  if (!lift.nextDueDate) {
    return { label: 'Never inspected', tone: 'stop', days: null }
  }
  const days = daysBetween(demoDate, lift.nextDueDate)
  const label = countdownLabel(demoDate, lift.nextDueDate)
  if (days <= 0) return { label, tone: 'stop', days }
  return { label, tone: days <= CAUTION_DAYS ? 'open' : 'verified', days }
}

export const TONE_TEXT: Record<ComplianceTone, string> = {
  stop: 'text-stop',
  open: 'text-open',
  verified: 'text-verified',
}

export const TONE_TINT: Record<ComplianceTone, string> = {
  stop: 'bg-stop-tint text-stop',
  open: 'bg-open-tint text-open',
  verified: 'bg-verified-tint text-verified',
}

export const LIFT_TYPE_LABEL: Record<LiftType, string> = {
  passenger: 'Passenger lift',
  goods: 'Goods lift',
  escalator: 'Escalator',
  dumbwaiter: 'Dumbwaiter',
}

/**
 * Brief section 8: a lift with no form loaded says what is missing rather than
 * failing. Three of eight lifts say this, which makes the point that the form is
 * data and an annexure is configuration.
 */
export function scopeStatementFor(lift: Lift): string {
  return `${LIFT_TYPE_LABEL[lift.type]} form not loaded in this demo.`
}
