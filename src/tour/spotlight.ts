/**
 * Geometry and scrolling for the spotlight.
 *
 * The scrim is four positioned rectangles rather than the usual
 * `box-shadow: 0 0 0 9999px` trick, because brief 4.2 permits no shadows except
 * a functional focus ring. Four rects also survive something the obvious
 * alternative does not: raising the target above a single scrim with z-index
 * fails silently wherever the target sits inside a stacking context, and the
 * form's progress strip is `sticky z-10`, which creates one.
 */

export type Rect = { left: number; top: number; right: number; bottom: number }

/** How far the hole extends beyond the element. */
const PAD = 6

/**
 * All four scrim rects derive from one rounded rect, so their seams meet
 * exactly. Two semi-transparent fills overlapping by a fraction of a pixel
 * paint a visibly darker hairline down the edge of the hole.
 *
 * No visual-viewport correction here: getBoundingClientRect and a fixed overlay
 * are both in the layout viewport, so they already agree. The visual viewport
 * matters for keeping the card on screen, not for this.
 */
export function rectOf(element: Element, pad = PAD): Rect {
  const r = element.getBoundingClientRect()
  return {
    left: Math.round(r.left - pad),
    top: Math.round(r.top - pad),
    right: Math.round(r.right + pad),
    bottom: Math.round(r.bottom + pad),
  }
}

export function reduceMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * The clause sheet pins the body with `position: fixed` and a negative top.
 * While that is on, `window.scrollY` reads 0 and `window.scrollTo` does
 * nothing, so scrolling the window here would be silently ignored and every
 * measurement would look broken. That offset belongs to the form's cleanup.
 */
export function bodyLocked(): boolean {
  return document.body.style.position === 'fixed'
}

/** The nearest ancestor that actually scrolls, if any. */
export function scrollParent(element: Element): Element | null {
  for (let node = element.parentElement; node; node = node.parentElement) {
    const style = getComputedStyle(node)
    if (/(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight) {
      return node
    }
  }
  return null
}

/**
 * True when the target cannot be scrolled up, which in this app means it is
 * inside one of the fixed bottom action bars. Used to decide card placement.
 */
export function pinnedTarget(element: Element): boolean {
  for (let node: Element | null = element; node; node = node.parentElement) {
    if (getComputedStyle(node).position === 'fixed') return true
  }
  return false
}

type Io = { alive: () => boolean; sleep: (ms: number) => Promise<void> }

/**
 * Wait for an anchor to exist and have a real size. Polled with timeouts rather
 * than requestAnimationFrame: rAF does not fire in a tab that is not painting,
 * which is the same reason the form's scroll restore uses timeouts. An element
 * can also exist with a zero-width rect mid-layout, so re-checking the rect
 * each time is the point.
 */
export async function waitForAnchor(
  value: string,
  io: Io,
  budget = 2500,
): Promise<HTMLElement | null> {
  const step = 60
  for (let waited = 0; waited <= budget; waited += step) {
    if (!io.alive()) return null
    const element = document.querySelector<HTMLElement>(`[data-tour="${value}"]`)
    if (element) {
      const r = element.getBoundingClientRect()
      if (r.width > 0 && r.height > 0) return element
    }
    await io.sleep(step)
  }
  return null
}

/** Where to put the card, given the hole and how tall the card is. */
export function placeFor(
  rect: Rect | null,
  cardHeight: number,
  pinned: boolean,
): 'top' | 'bottom' {
  if (!rect) return 'bottom'
  const gap = 16
  if (pinned) return rect.top > window.innerHeight / 2 ? 'top' : 'bottom'
  /**
   * A target taller than half the viewport cannot have the card sit clear of
   * it, so stop trying. Bottom is the better overlap: it covers the tail of the
   * target and leaves its heading visible, where putting the card on top hides
   * the very thing being named.
   */
  if (rect.bottom - rect.top > window.innerHeight * 0.5) return 'bottom'
  const above = rect.top
  const below = window.innerHeight - rect.bottom
  if (below >= cardHeight + gap) return 'bottom'
  if (above >= cardHeight + gap) return 'top'
  // Neither side fits. Bottom covers the tail of the target; top would cover
  // its heading, which is the part naming the thing being explained.
  return 'bottom'
}

/** Is the element far enough into view to be worth spotlighting? */
function inView(element: Element): boolean {
  const r = element.getBoundingClientRect()
  return r.bottom > 0 && r.top < window.innerHeight
}

/**
 * Bring an anchor into the upper part of the viewport, then wait for it to stop
 * moving.
 *
 * Settling is two consecutive identical rects rather than a fixed delay:
 * measure too early and the hole paints where the element used to be, which is
 * the most visible way this feature can fail on a real phone. `scrollend` is
 * not dependable on whatever device is in the room.
 */
export async function revealAnchor(element: HTMLElement, io: Io): Promise<void> {
  const behavior: ScrollBehavior = reduceMotion() ? 'auto' : 'smooth'

  /** Where the target should end up: the upper part of whatever scrolls. */
  function scrollToward(instant: boolean): void {
    if (pinnedTarget(element)) return
    const how: ScrollBehavior = instant ? 'auto' : behavior
    const container = scrollParent(element)
    if (container) {
      // The clause sheet, the interstitial and the demo panel each scroll in
      // their own box, so scroll that rather than the window.
      const box = container.getBoundingClientRect()
      const r = element.getBoundingClientRect()
      const delta = r.top - box.top - box.height * 0.25
      if (Math.abs(delta) > 8) container.scrollBy({ top: delta, behavior: how })
      return
    }
    if (bodyLocked()) return
    // Body locked with no scrollable ancestor: leave it. The sheet is capped at
    // 85dvh so the target is on screen, and placement handles the rest.
    const r = element.getBoundingClientRect()
    const to = Math.max(0, window.scrollY + r.top - window.innerHeight * 0.28)
    // Skipping a scroll that is not needed matters: without this every Next
    // jitters the page even when nothing had to move.
    if (Math.abs(to - window.scrollY) > 8) window.scrollTo({ top: to, behavior: how })
  }

  async function settle(): Promise<void> {
    let previous = ''
    for (let attempt = 0; attempt < 12; attempt += 1) {
      await io.sleep(60)
      if (!io.alive()) return
      const now = JSON.stringify(rectOf(element, 0))
      if (now === previous) return
      previous = now
    }
  }

  const before = window.scrollY
  scrollToward(false)

  /**
   * A smooth scroll that has not moved at all after a few frames is not going
   * to: it is driven by the compositor, which does not run in a tab that is not
   * painting. Detecting that here rather than waiting out the settle keeps a
   * step from taking an extra second to appear.
   */
  if (!pinnedTarget(element) && !bodyLocked() && !scrollParent(element)) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await io.sleep(60)
      if (!io.alive()) return
      if (window.scrollY !== before) break
      if (attempt === 2 && !inView(element)) scrollToward(true)
    }
  }

  await settle()
  if (!io.alive()) return

  /**
   * Verify, then force. A smooth scroll is driven by the compositor and simply
   * does not advance in a tab that is not painting, which leaves the hole
   * measured over an element still below the fold. Same family as
   * requestAnimationFrame not firing there. So the smooth attempt is treated as
   * an optimisation and correctness is checked afterwards.
   */
  if (!inView(element)) {
    scrollToward(true)
    await settle()
  }
}
