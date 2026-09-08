/** The closure loop reaching the document. */

import { ANCHOR } from '../anchors'
import { TOUR_INSPECTION_ID, closedDefect } from '../preconditions'
import type { TourStep } from '../types'

export function addendumSteps(): TourStep[] {
  const base = { persona: 'inspector' as const }
  return [
    {
      ...base,
      route: `/inspection/${TOUR_INSPECTION_ID}/report`,
      precondition: closedDefect,
      id: 'addendum-link',
      anchor: ANCHOR.reportAddendumLink,
      dim: false,
      title: 'The certificate records what was wrong',
      body: 'It is a statement about one morning and it does not change. What happened next needs its own document, and the link only appears once something has actually been closed.',
    },
    {
      ...base,
      route: `/inspection/${TOUR_INSPECTION_ID}/addendum`,
      precondition: closedDefect,
      id: 'addendum-closed',
      anchor: ANCHOR.addendumClosed,
      dim: false,
      title: 'What was done about it',
      body: 'The defect, when it was raised and when it closed, who closed it, the photograph of the rectified condition and their signature. It references the parent report’s verification code rather than inventing its own, because there is one record per inspection.',
    },
    {
      ...base,
      route: `/inspection/${TOUR_INSPECTION_ID}/addendum`,
      precondition: closedDefect,
      id: 'addendum-outstanding',
      anchor: ANCHOR.addendumOutstanding,
      dim: false,
      title: 'And what still is not done',
      body: 'Anything still open, with how many times it has been chased. A closure document that only listed successes would be worth nothing to the person deciding whether the lift can go back into service.',
    },
  ]
}
