/** Escalation, and the fact that none of it is stored. */

import { ANCHOR } from '../anchors'
import { day31, fresh } from '../preconditions'
import type { TourStep } from '../types'

export function reminderSteps(): TourStep[] {
  return [
    {
      id: 'reminders-before',
      route: '/defect/def-001',
      persona: 'owner',
      precondition: fresh,
      anchor: ANCHOR.defectReminders,
      title: 'Day 0 — water in the pit, twenty days overdue',
      body: 'Four reminders have already gone out: one seven days before the date, one on it, then every seven days since. They are computed from the date and the schedule, never written down, so they cannot drift or duplicate.',
    },
    {
      id: 'reminders-day-31',
      route: '/defect/def-001',
      persona: 'owner',
      precondition: day31,
      anchor: ANCHOR.defectReminders,
      title: 'Day 31 — nobody fixed the pit',
      body: 'The same defect, the date moved on. The history has filled in to nine entries without anything being sent or saved, and every party on the list is named on each one. This is what thirty days of being chased looks like.',
    },
    {
      id: 'reminders-recipients',
      route: '/defect/def-001',
      persona: 'owner',
      precondition: day31,
      anchor: ANCHOR.defectIdentity,
      title: 'Chased, but only where chasing is the point',
      body: 'Thirty and ninety day defects are chased on this schedule. An immediate one is not: it is notified once, at the order, because a lift that may not be used does not need a weekly email. Anything left to the next inspection is recorded and never chased.',
    },
  ]
}
