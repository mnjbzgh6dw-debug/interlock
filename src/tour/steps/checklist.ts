/**
 * Walking the checklist. The first of the three things the brief says must land:
 * a long statutory form on a phone, in a pit, with no signal, without losing
 * work.
 */

import { ANCHOR } from '../anchors'
import { midInspectionOnK1 } from '../preconditions'
import type { TourStep } from '../types'

export function checklistSteps(liftId = 'lift-k1'): TourStep[] {
  const route = `/lift/${liftId}/inspection`
  const base = { route, persona: 'inspector' as const }
  const started = { ...base, precondition: midInspectionOnK1 }
  const going = { ...base, precondition: midInspectionOnK1 }
  return [
    {
      ...started,
      id: 'checklist-progress',
      anchor: ANCHOR.formProgress,
      title: 'Thirty items, six sections, any order',
      body: 'The strip stays visible while you scroll and reports what is answered. It does not gate anything: an inspector works in the order the plant allows, not the order a form prefers, and the machine room comes before the pit only if the ladder is free.',
    },
    {
      ...going,
      id: 'checklist-document',
      anchor: ANCHOR.formItem('A1'),
      title: 'It reads as a document, not a feed',
      body: 'Hairline rules, one column, item number then requirement. Statutory paper heritage is an asset here: this is a form the trade already knows how to read.',
    },
    {
      ...going,
      id: 'checklist-measure',
      anchor: ANCHOR.formItemInput('A2'),
      title: 'Day 0, 08:45 — 47 degrees in the machine room',
      body: 'The expected range sits beside the field. Watch what happens when the value is committed: nobody decides this is a failure, the range does.',
      act: { kind: 'fill', anchor: ANCHOR.formItemInput('A2'), value: '47' },
      expect: (state) =>
        state.inspections.some((i) => i.responses.A2?.result === 'fail'),
    },
    {
      ...going,
      id: 'checklist-autofail',
      anchor: ANCHOR.formItem('A2'),
      title: 'Out of range fails itself',
      body: 'Recorded as a failure against 5 to 40 degrees, and the wording is the defect rather than the inverted item text. It commits when you leave the field, never as you type: 5 on the way to 50 must not fail anything.',
    },
    {
      ...going,
      id: 'checklist-signature',
      anchor: ANCHOR.formSignature,
      title: 'Every section is signed where it is done',
      body: 'A finger signature closes each section, not just the report. The inspector signs the machine room in the machine room, which is what makes each section a statement rather than a draft.',
    },
  ]
}
