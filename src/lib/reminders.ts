/**
 * Reminders, per brief 7.2. Computed, never stored.
 *
 * Nothing writes a reminder. If rendering a view appended one, they would
 * duplicate on every render, every persona switch and every date change, and the
 * history shown at the Day 31 beat would be garbage. So this is a pure function
 * of the defect and the demo date, and the Defect type carries no reminder array.
 *
 * Schedule, for days30 and days90 only:
 *   - 7 days before the due date
 *   - on the due date
 *   - every 7 days after it, up to the demo date
 *
 * An `immediate` defect is not chased on a schedule: it is notified once, at the
 * moment of the stop-use order. A `nextInspection` defect is never chased.
 */

import type { Building, Defect, ServiceCompany } from '../types'
import { addDays, daysBetween } from './dates'

export const CHASED_SEVERITIES = ['days30', 'days90'] as const

export type Reminder = {
  date: string
  reason: string
  recipients: string[]
}

/** Who a reminder goes to: the responsible party, the owner, and the issuer. */
export function reminderRecipients(
  defect: Defect,
  building: Building,
  company: ServiceCompany,
): string[] {
  const responsible =
    defect.responsibility === 'owner' ? building.ownerEntity : company.name
  const list = [responsible]
  // The owner is liable for the machine whoever is fixing it.
  if (defect.responsibility !== 'owner') list.push(building.ownerEntity)
  list.push('Cape Vertical Inspections')
  return list
}

export function remindersFor(
  defect: Defect,
  demoDate: string,
  recipients: string[],
): Reminder[] {
  if (!CHASED_SEVERITIES.includes(defect.severity as 'days30' | 'days90')) return []

  /** Chasing stops when the obligation is met. */
  const horizon =
    defect.status === 'closed' && defect.closedAt
      ? [defect.closedAt.slice(0, 10), demoDate].sort()[0]
      : demoDate

  const due = defect.dueDate
  const dates: { date: string; reason: string }[] = []

  const warning = addDays(due, -7)
  if (warning <= horizon) dates.push({ date: warning, reason: 'Due in 7 days' })
  if (due <= horizon) dates.push({ date: due, reason: 'Due today' })

  let next = addDays(due, 7)
  while (next <= horizon) {
    dates.push({ date: next, reason: `Overdue by ${daysBetween(due, next)} days` })
    next = addDays(next, 7)
  }

  // Most recent first.
  return dates.reverse().map((entry) => ({ ...entry, recipients }))
}
