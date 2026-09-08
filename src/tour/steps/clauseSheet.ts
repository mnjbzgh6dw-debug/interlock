/**
 * The clause reference. One of the three things the brief says the demo has to
 * land, and the test is that it comes back to the same spot.
 */

import { ANCHOR } from '../anchors'
import { carryOn, midInspectionOnK1 } from '../preconditions'
import type { TourStep } from '../types'

export function clauseSheetSteps(liftId = 'lift-k1'): TourStep[] {
  const route = `/lift/${liftId}/inspection`
  const base = { route, persona: 'inspector' as const }
  return [
    {
      ...base,
      precondition: midInspectionOnK1,
      id: 'clause-ref',
      anchor: ANCHOR.formItemClause('A5'),
      title: 'Every item carries its clause',
      body: 'An inspector challenged on an item needs the reference to hand, in the pit, without a paper copy. It sits on the item rather than behind a menu.',
    },
    {
      ...base,
      precondition: carryOn('mid-inspection'),
      id: 'clause-sheet',
      anchor: ANCHOR.clauseSheet,
      waitFor: ANCHOR.clauseBack,
      title: 'Two or three plain sentences',
      body: 'Written from scratch in plain language, and the amber notice is not decoration: the published standard is copyrighted and paywalled, so none of its text appears anywhere in this app.',
      act: { kind: 'click', anchor: ANCHOR.formItemClause('A5') },
    },
    {
      ...base,
      precondition: carryOn('mid-inspection'),
      id: 'clause-back',
      anchor: ANCHOR.clauseBack,
      title: 'Back to the exact spot',
      body: 'Not back to the top of the form. Losing your place thirty items into a statutory checklist is how an inspector stops trusting an app, so this returns to the scroll position you left.',
      interactive: true,
    },
  ]
}
