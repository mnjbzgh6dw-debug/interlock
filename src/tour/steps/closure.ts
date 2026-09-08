/**
 * The closure loop. Brief section 2 calls this the differentiator: everyone has
 * seen a digital form, almost nobody demos the obligation being closed.
 */

import { ANCHOR } from '../anchors'
import { fresh } from '../preconditions'
import type { TourStep } from '../types'

export function closureSteps(): TourStep[] {
  return [
    {
      id: 'closure-worklist',
      route: '/worklist',
      persona: 'technician',
      precondition: fresh,
      anchor: ANCHOR.worklistSummary,
      title: 'Day 0, 14:20 — the technician’s list',
      body: 'S. Ndlovu of Vertex Lift Services sees defects assigned to their company across every building, overdue first. Not a copy of the inspector’s report: the work, and only the work that is theirs.',
    },
    {
      id: 'closure-open',
      route: '/defect/def-002',
      persona: 'technician',
      precondition: fresh,
      anchor: ANCHOR.defectIdentity,
      title: 'One obligation, with its origin',
      body: 'The cracked car mirror, raised on 20 July against clause 4.6.1, due 18 October. It carries the checklist item it came from, so the technician can see exactly what was tested and why it failed.',
    },
    {
      id: 'closure-evidence',
      route: '/defect/def-002',
      persona: 'technician',
      precondition: fresh,
      anchor: ANCHOR.defectClosure,
      title: 'A photograph and a signature, or it does not close',
      body: 'Both are required. The loop is worth nothing if an obligation can be ticked off without proof, and the signature is what puts a named person behind the claim that the work was done.',
    },
    {
      id: 'closure-action',
      route: '/defect/def-002',
      persona: 'technician',
      precondition: fresh,
      anchor: ANCHOR.defectAction,
      title: 'Close defect produces defect closed',
      body: 'The action keeps its name through the flow. Closing the last immediate defect on a lift also lifts the stop-use order, which is the whole idea: nothing moves until it is closed, and once it is closed the lift is released.',
      interactive: true,
    },
  ]
}
