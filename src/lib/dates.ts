/**
 * Date arithmetic for the demo. Everything is a plain ISO day string,
 * 'YYYY-MM-DD', and every calculation runs in UTC so that a demo run in
 * Cape Town never lands a due date a day out.
 */

import type { FailSeverity, Lift } from '../types'

const DAY_MS = 86_400_000

export function parseDay(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`)
}

export function toDay(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function addDays(iso: string, days: number): string {
  return toDay(new Date(parseDay(iso).getTime() + days * DAY_MS))
}

/** Whole days from `from` to `to`. Negative when `to` is in the past. */
export function daysBetween(from: string, to: string): number {
  return Math.round((parseDay(to).getTime() - parseDay(from).getTime()) / DAY_MS)
}

/** Whole months forward, clamped to the end of the target month. */
export function addMonths(iso: string, months: number): string {
  const d = parseDay(iso)
  const day = d.getUTCDate()
  d.setUTCDate(1)
  d.setUTCMonth(d.getUTCMonth() + months)
  const lastDay = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0),
  ).getUTCDate()
  d.setUTCDate(Math.min(day, lastDay))
  return toDay(d)
}

/**
 * The statutory cycle in the seed data: every lift's next due date is two years
 * after its last report.
 */
export const INSPECTION_INTERVAL_MONTHS = 24

/** '2026-09-08' -> '8 September 2026'. */
export function formatDay(iso: string): string {
  const d = parseDay(iso)
  return `${d.getUTCDate()} ${d.toLocaleString('en-ZA', { month: 'long', timeZone: 'UTC' })} ${d.getUTCFullYear()}`
}

/** '2026-09-08' -> '0809', for the verification code. */
export function dayMonthCode(iso: string): string {
  return iso.slice(8, 10) + iso.slice(5, 7)
}

/** Due date per brief 7.1. */
export function dueDateFor(
  severity: FailSeverity,
  raisedDate: string,
  lift: Pick<Lift, 'nextDueDate'>,
): string {
  switch (severity) {
    case 'immediate':
      return raisedDate
    case 'days30':
      return addDays(raisedDate, 30)
    case 'days90':
      return addDays(raisedDate, 90)
    case 'nextInspection':
      return lift.nextDueDate ?? raisedDate
  }
}
