/**
 * The stop-use order. The interstitial lives in the form's local state and is
 * raised on the commit that turns an immediate item to fail, so the tour taps
 * the real control rather than loading a state that pretends.
 */

import { ANCHOR } from '../anchors'
import { carryOn, sectionEReady } from '../preconditions'
import type { TourStep } from '../types'

export function stopUseSteps(liftId = 'lift-k1'): TourStep[] {
  const route = `/lift/${liftId}/inspection`
  const base = { route, persona: 'inspector' as const }
  return [
    {
      ...base,
      precondition: sectionEReady,
      id: 'stop-use-section',
      anchor: ANCHOR.formSection('E'),
      title: 'Day 0, 08:51 — suspension, safety gear and brake',
      body: 'The last section before signing, and the one that carries five of the nine findings that can take a lift out of service on the spot.',
      act: { kind: 'click', anchor: ANCHOR.formSection('E') },
    },
    {
      ...base,
      precondition: carryOn('section-e-ready'),
      id: 'stop-use-item',
      anchor: ANCHOR.formItem('E3'),
      title: 'Day 0, 08:52 — the safety gear will not hold',
      body: 'E3 is what stops the car if the suspension goes. It is graded immediate, which is a different kind of finding from anything else on the form: it does not get a due date, it gets a prohibition.',
    },
    {
      ...base,
      precondition: carryOn('section-e-ready'),
      id: 'stop-use-fire',
      anchor: ANCHOR.stopUseHeadline,
      waitFor: ANCHOR.stopUseAcknowledge,
      dim: false,
      title: 'No person may be conveyed',
      body: 'Full screen, the moment the failure is committed. Everything else in this app is deliberately quiet so that this lands. The order is in force from the failure, not from the acknowledgement.',
      act: { kind: 'click', anchor: ANCHOR.formItemResult('E3', 'fail') },
      expect: (state) => state.lifts.some((lift) => lift.stopUseInForce),
    },
    {
      ...base,
      precondition: carryOn('section-e-ready'),
      id: 'stop-use-notified',
      anchor: ANCHOR.stopUseRecipients,
      dim: false,
      title: 'Four parties, the regulator among them',
      body: 'The building owner, the lift company, the inspection firm and the regulator. Nothing is actually sent anywhere: it is recorded in the app and it says so, because a screen full of invented emails invites scrutiny of the emails.',
    },
    {
      ...base,
      precondition: carryOn('section-e-ready'),
      id: 'stop-use-ack',
      anchor: ANCHOR.stopUseAcknowledge,
      dim: false,
      title: 'Acknowledge, not dismiss',
      body: 'No backdrop to tap away, no Escape, no close control. A prohibition is not a notification. The order lifts only when the responsible party closes the defect with photographic evidence.',
      interactive: true,
    },
  ]
}
