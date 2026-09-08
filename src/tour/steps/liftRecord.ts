/** One lift, end to end: identity, clock, history, obligations. */

import { ANCHOR } from '../anchors'
import { fresh } from '../preconditions'
import type { TourStep } from '../types'

export function liftRecordSteps(liftId = 'lift-k1'): TourStep[] {
  const route = `/lift/${liftId}`
  const base = { route, persona: 'inspector' as const, precondition: fresh }
  return [
    {
      ...base,
      id: 'lift-open',
      anchor: ANCHOR.liftClock,
      title: 'Day 0, 08:40 — arrival at Kestrel House',
      body: 'A sticker on the machine opens this record directly. The clock is restated at the top, because the first question on arrival is whether this lift should be running at all.',
    },
    {
      ...base,
      id: 'lift-identity',
      anchor: ANCHOR.liftIdentity,
      title: 'What the certificate has to name',
      body: 'Official number, type, floors, rated load and speed, drive, install date, manufacturer, who maintains it, and who owns the building. All of it prints on the report, because a certificate that cannot identify its machine is worthless.',
    },
    {
      ...base,
      id: 'lift-defects',
      anchor: ANCHOR.liftOpenDefects,
      title: 'What is already outstanding',
      body: 'Anything still open against this lift, with the party who carries it and the date it falls due. An inspector arriving needs to know what was found last time before finding anything new.',
    },
    {
      ...base,
      id: 'lift-history',
      anchor: ANCHOR.liftHistory,
      title: 'Inspected every two years since 2018',
      body: 'Four inspections by three different inspectors, each with its own verification code. Tapping one opens that certificate. This is the record that lives in the steel cabinet, and it is why the app has to look three years old rather than three days old.',
    },
    {
      ...base,
      id: 'lift-start',
      anchor: ANCHOR.liftAction,
      title: 'One action, in thumb reach',
      body: 'Start inspection is the only thing this screen asks you to do, and it sits at the bottom where a thumb already is. Only the inspector sees it: switch role and it says who does start inspections instead.',
    },
  ]
}
