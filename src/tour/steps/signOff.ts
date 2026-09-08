/** Sign off. What turns a walked checklist into an issued certificate. */

import { ANCHOR } from '../anchors'
import { readyToSign } from '../preconditions'
import type { TourStep } from '../types'

export function signOffSteps(liftId = 'lift-k1'): TourStep[] {
  const route = `/lift/${liftId}/inspection/sign-off`
  const base = { route, persona: 'inspector' as const }
  return [
    {
      ...base,
      precondition: readyToSign,
      id: 'sign-off-summary',
      anchor: ANCHOR.signOffSummary,
      title: 'Day 0, 08:55 — what is about to be issued',
      body: 'Items answered, sections signed, the date, and the verification code this record will carry for the next ten years. Nothing here blocks: a report can be issued with items unanswered, and it will print them as not recorded rather than quietly passing them.',
    },
    {
      ...base,
      precondition: readyToSign,
      id: 'sign-off-inspector',
      anchor: ANCHOR.signOffInspector,
      title: 'A named person with a registration number',
      body: 'J. Marais, RLI-2019-0451, for Cape Vertical Inspections under its accreditation number. A statutory report is a personal act by a registered individual, which is why the identity is on the screen and not in a settings page.',
    },
    {
      ...base,
      precondition: readyToSign,
      id: 'sign-off-signature',
      anchor: ANCHOR.signOffSignature,
      title: 'The one thing that is required',
      body: 'Submit stays disabled until this is signed. Unanswered items are reported, not enforced, but an unsigned statutory report is not a report at all.',
      interactive: true,
    },
  ]
}
