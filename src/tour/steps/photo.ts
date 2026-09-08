/** Photographic evidence, and the one hard gate in the whole form. */

import { ANCHOR } from '../anchors'
import { carryOn, pitPhotographed } from '../preconditions'
import type { TourStep } from '../types'

export function photoSteps(liftId = 'lift-k1'): TourStep[] {
  const route = `/lift/${liftId}/inspection`
  const base = { route, persona: 'inspector' as const }
  return [
    {
      ...base,
      precondition: pitPhotographed,
      id: 'photo-section',
      anchor: ANCHOR.formSection('D'),
      title: 'Day 0, 08:48 — down to the pit',
      body: 'Sections are walked in whatever order the plant allows. The machine room was first because the ladder was free; the pit is next.',
      act: { kind: 'click', anchor: ANCHOR.formSection('D') },
    },
    {
      ...base,
      precondition: carryOn('d1-photographed'),
      id: 'photo-fail',
      anchor: ANCHOR.formItem('D1'),
      title: 'Water in the pit',
      body: 'Six of the thirty items demand a photograph when they fail, and this is one. Standing water reaches the buffers and the safety gear, and it is the building’s problem rather than the lift company’s.',
    },
    {
      ...base,
      precondition: carryOn('d1-photographed'),
      id: 'photo-evidence',
      anchor: ANCHOR.formItemPhoto('D1'),
      title: 'The photograph is part of the record',
      body: 'Taken on the phone in the pit, reduced to about 150KB before it is stored, and printed on the certificate. It is also what the building owner sees when they are asked to pay for a pump.',
    },
    {
      ...base,
      precondition: carryOn('d1-photographed'),
      id: 'photo-gate',
      anchor: ANCHOR.formAction,
      title: 'The one thing the form will not let you skip',
      body: 'Unanswered items never block you, and submit is allowed with items untouched. A failed item that needs a photograph and has none is the single exception: the section will not be left until it has one.',
    },
  ]
}
