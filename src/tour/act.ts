/**
 * The two things the tour does to real controls on the viewer's behalf.
 *
 * It taps what a person would tap. Nothing here reaches into component state.
 */

import type { TourAct } from './types'
import { findAnchor } from './anchors'

type Io = { alive: () => boolean; sleep: (ms: number) => Promise<void> }

/** React reads the native setter, so a plain assignment is not seen. */
function setNativeValue(input: HTMLInputElement, value: string): void {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(input, value)
}

export async function performAct(act: TourAct, io: Io): Promise<void> {
  const element = findAnchor(act.anchor)
  if (!element) return

  if (act.kind === 'click') {
    /**
     * A result choice toggles: `onSet(selected ? null : result)`. Clicking Fail
     * on an item that is already failing clears it, and the stop-use order the
     * next steps talk about would never arrive. This guard is why the engine
     * can be trusted to fire the red screen.
     */
    if (element.getAttribute('aria-pressed') === 'true') return
    if (element instanceof HTMLButtonElement && element.disabled) return
    element.click()
    return
  }

  const input = element as HTMLInputElement
  input.focus()
  setNativeValue(input, act.value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
  await io.sleep(0)
  if (!io.alive()) return
  /**
   * Both: `blur()` closes the phone keyboard, which would otherwise shift the
   * visual viewport under the card, and the explicit focusout is what React
   * actually listens to for onBlur. The event matters on its own because
   * `focus()` does not take in a tab that is not focused, which leaves `blur()`
   * a no-op and the measurement never committed.
   */
  input.blur()
  input.dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
}
