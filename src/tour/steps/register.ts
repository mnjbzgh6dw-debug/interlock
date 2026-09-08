/**
 * The register.
 *
 * Copy rule for every tour, from brief section 14: a dated story, not a screen
 * tour. Titles carry the consequence, not the name of the feature.
 */

import { ANCHOR } from '../anchors'
import { fresh, stopUse } from '../preconditions'
import type { TourStep } from '../types'

export function registerSteps(): TourStep[] {
  return [
    {
      id: 'register-open',
      route: '/register',
      persona: 'inspector',
      precondition: fresh,
      anchor: ANCHOR.registerBuilding('bld-kestrel'),
      title: 'Eight lifts, three buildings, one list',
      body: 'This is what an inspector opens on arrival. Lifts are grouped by building, because that is how the work is scheduled: you attend a site, not a lift.',
    },
    {
      id: 'register-clock',
      route: '/register',
      persona: 'inspector',
      precondition: fresh,
      anchor: ANCHOR.registerClock('lift-k1'),
      title: 'Twenty-five days overdue',
      body: 'The clock comes before the lift’s own name on every row. It is the number that decides what happens next, so it leads. Kestrel House Lift 1 was last inspected on 14 August 2024 and fell due on 14 August 2026.',
    },
    {
      id: 'register-never',
      route: '/register',
      persona: 'inspector',
      precondition: fresh,
      anchor: ANCHOR.registerRow('lift-w2'),
      title: 'Never inspected reads as its own state',
      body: 'The Waterfall dumbwaiter has no last report at all. That is not the same as being overdue and it does not pretend to be a countdown.',
    },
    {
      id: 'register-scope',
      route: '/register',
      persona: 'inspector',
      precondition: fresh,
      anchor: ANCHOR.registerRow('lift-k3'),
      title: 'Three of the eight have no form loaded',
      body: 'Only the passenger lift form is populated in this demonstration. Open the goods lift and it says so plainly, rather than failing. The checklist is data, so adding an annexure is configuration and not a rebuild.',
    },
    {
      id: 'register-search',
      route: '/register',
      persona: 'inspector',
      precondition: fresh,
      anchor: ANCHOR.registerSearch,
      title: 'Finding one lift among a portfolio',
      body: 'Search matches a building name, a lift label, or the official number painted on the door. On a real register of several hundred lifts, the official number is what an inspector is holding.',
    },
    {
      id: 'register-stop-use',
      route: '/register',
      persona: 'inspector',
      precondition: stopUse,
      anchor: ANCHOR.registerRow('lift-k1'),
      title: 'A lift under a stop-use order',
      body: 'Kestrel House Lift 1 now carries a red edge and reads not for use. An order raised in a machine room shows on the register immediately, so nobody schedules work against a lift that may not be moved.',
    },
  ]
}
