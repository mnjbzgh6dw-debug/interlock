/**
 * Grading. The second of the three things the brief says must land: failures
 * becoming graded, assigned, dated obligations rather than lines in a PDF.
 */

import { ANCHOR } from '../anchors'
import { carryOn, readyToGrade } from '../preconditions'
import type { TourStep } from '../types'

export function defectReviewSteps(liftId = 'lift-k1'): TourStep[] {
  const route = `/lift/${liftId}/inspection/defects`
  const base = { route, persona: 'inspector' as const }
  return [
    {
      ...base,
      precondition: readyToGrade,
      id: 'review-counts',
      anchor: ANCHOR.reviewCounts,
      title: 'Day 0, 08:55 — three failures, two grades',
      body: 'One immediate and two within thirty days. The grade is not a priority label an inspector picks: it comes from the item, so the same failure grades the same way whoever found it.',
    },
    {
      ...base,
      precondition: carryOn('ready-to-grade'),
      id: 'review-dates',
      anchor: ANCHOR.reviewDefect('D1'),
      title: 'Every obligation has a date',
      body: 'Water in the pit is thirty days, so it falls due on 8 October. The immediate one is due the same day and takes the lift out of service until it is closed. This is where a failed line becomes somebody’s dated obligation.',
    },
    {
      ...base,
      precondition: carryOn('ready-to-grade'),
      id: 'review-responsibility',
      anchor: ANCHOR.reviewResponsibility('D1'),
      title: 'Who carries it, named',
      body: 'Water in the pit defaults to the building owner and the safety gear to the lift company, and the inspector can move either. This toggle is the whole argument about who pays, made concrete: the report will name a party, not a department.',
      interactive: true,
    },
  ]
}
