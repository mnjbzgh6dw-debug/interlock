/** Who was told, and the honesty about it. */

import { ANCHOR } from '../anchors'
import { TOUR_INSPECTION_ID, issuedReport } from '../preconditions'
import type { TourStep } from '../types'

export function distributionSteps(): TourStep[] {
  const base = {
    persona: 'inspector' as const,
    route: `/inspection/${TOUR_INSPECTION_ID}/distribution`,
  }
  return [
    {
      ...base,
      precondition: issuedReport,
      id: 'distribution-list',
      anchor: ANCHOR.distributionList,
      title: 'Day 0, 08:56 — four recipients, timestamped',
      body: 'The building owner, the lift company, the inspection firm and the regulator, each recorded at the moment the report was issued. The same four the stop-use order named.',
    },
    {
      ...base,
      precondition: issuedReport,
      id: 'distribution-simulated',
      anchor: ANCHOR.distributionSimulated,
      title: 'Nothing was actually sent',
      body: 'Said plainly rather than hidden. There is deliberately no outbox of invented emails: a screen full of fake messages invites scrutiny of the fake messages instead of the question that matters, which is who is accountable for the record.',
    },
  ]
}
