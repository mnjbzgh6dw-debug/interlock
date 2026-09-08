/**
 * Capture with no signal. The first of the three things the brief says must
 * land, and the one beat that has to be real rather than staged.
 */

import { ANCHOR } from '../anchors'
import { offlineCapture } from '../preconditions'
import type { TourStep } from '../types'

export function offlineSteps(liftId = 'lift-k1'): TourStep[] {
  const route = `/lift/${liftId}/inspection`
  const base = { route, persona: 'inspector' as const }
  return [
    {
      ...base,
      precondition: offlineCapture,
      id: 'offline-indicator',
      anchor: ANCHOR.syncIndicator,
      title: 'Day 0, 08:41 — no signal',
      body: 'Airplane mode, in a pit, which is where lifts are actually inspected. The indicator appears the moment signal drops rather than waiting for something to fail.',
    },
    {
      ...base,
      precondition: offlineCapture,
      id: 'offline-write',
      anchor: ANCHOR.syncIndicator,
      title: 'Work carries on, and the queue is honest',
      body: 'That answer was recorded with no network anywhere in the path, and the count is a real number of writes waiting to go out. It cannot be faked: it only moves when there is genuinely something held.',
      act: { kind: 'click', anchor: ANCHOR.formItemResult('A1', 'pass') },
      expect: (state) => state.queuedWrites > 0,
    },
    {
      ...base,
      precondition: offlineCapture,
      id: 'offline-honest',
      anchor: ANCHOR.formProgress,
      title: 'Why this is gated on purpose',
      body: 'Writes reach other windows over a browser channel that works perfectly well offline. Without a deliberate gate on the real connection state, airplane mode would change nothing and the whole beat would be a lie. So the push is gated, and the queue you can see is the truth.',
    },
  ]
}
