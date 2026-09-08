/**
 * The spotlight and the card.
 *
 * Four scrim rectangles rather than a box-shadow, because brief 4.2 permits no
 * shadows except a functional focus ring. All four derive from one rounded rect
 * so their seams meet exactly: two semi-transparent fills overlapping by a
 * fraction of a pixel paint a visible dark hairline down the edge of the hole.
 *
 * The rect never enters React state. It is written straight to element styles
 * inside a frame callback, so tracking a scroll costs no renders.
 */

import { useEffect, useRef, useState } from 'react'
import { findAnchor } from './anchors'
import { placeFor, pinnedTarget, rectOf, type Rect } from './spotlight'
import { useTourControl, useTourRun } from './useTour'

/** Routes whose whole job is to not look like an app. */
const UNDIMMED = [/\/report$/, /\/addendum$/, /^\/stickers$/]

function scrimStyle(): string {
  return 'absolute bg-shaft/25 pointer-events-auto'
}

export function TourOverlay() {
  const run = useTourRun()
  const { next, back, exit } = useTourControl()

  const topRef = useRef<HTMLDivElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const leftRef = useRef<HTMLDivElement | null>(null)
  const rightRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)
  const shieldRef = useRef<HTMLDivElement | null>(null)
  const cardRef = useRef<HTMLElement | null>(null)

  const [place, setPlace] = useState<'top' | 'bottom'>('bottom')
  const [hasHole, setHasHole] = useState(false)

  const step = run ? run.tour.steps[run.index] : null
  const anchor = step?.anchor
  const dim = step ? step.dim !== false && !UNDIMMED.some((p) => p.test(window.location.pathname)) : false

  useEffect(() => {
    if (!run || !step) return
    const element = anchor ? findAnchor(anchor) : null
    setHasHole(Boolean(element))
    if (!element) {
      // No hole: the scrim covers everything and the card carries the step.
      write(null)
      return
    }

    /**
     * Written synchronously, throttled by a timestamp. Not via
     * requestAnimationFrame: that does not fire in a tab which is not
     * painting, so the hole would keep the position it had before a scroll.
     * Six style assignments are cheap enough to do on the event.
     */
    let last = 0
    const measure = () => {
      const now = Date.now()
      if (now - last < 16) return
      last = now
      write(rectOf(element))
    }

    write(rectOf(element))

    /**
     * Capture is required: the clause sheet, the interstitial and the demo
     * panel each scroll inside their own box, and scroll events do not bubble.
     */
    window.addEventListener('scroll', measure, { passive: true, capture: true })
    window.addEventListener('resize', measure)
    window.addEventListener('orientationchange', measure)
    window.visualViewport?.addEventListener('resize', measure)
    window.visualViewport?.addEventListener('scroll', measure)
    const observer = new ResizeObserver(measure)
    observer.observe(element)

    return () => {
      window.removeEventListener('scroll', measure, { capture: true } as EventListenerOptions)
      window.removeEventListener('resize', measure)
      window.removeEventListener('orientationchange', measure)
      window.visualViewport?.removeEventListener('resize', measure)
      window.visualViewport?.removeEventListener('scroll', measure)
      observer.disconnect()
    }

    function write(rect: Rect | null) {
      const height = window.innerHeight
      const width = window.innerWidth
      const top = topRef.current
      const bottom = bottomRef.current
      const left = leftRef.current
      const right = rightRef.current
      const ring = ringRef.current
      const shield = shieldRef.current

      if (!rect) {
        // One full-bleed scrim, no hole.
        if (top) Object.assign(top.style, { left: '0px', top: '0px', width: `${width}px`, height: `${height}px` })
        for (const node of [bottom, left, right, ring, shield]) {
          if (node) node.style.height = '0px'
        }
        return
      }

      const clamped = {
        left: Math.max(0, rect.left),
        top: Math.max(0, rect.top),
        right: Math.min(width, rect.right),
        bottom: Math.min(height, rect.bottom),
      }

      if (top) {
        Object.assign(top.style, {
          left: '0px',
          top: '0px',
          width: `${width}px`,
          height: `${Math.max(0, clamped.top)}px`,
        })
      }
      if (bottom) {
        Object.assign(bottom.style, {
          left: '0px',
          top: `${clamped.bottom}px`,
          width: `${width}px`,
          height: `${Math.max(0, height - clamped.bottom)}px`,
        })
      }
      if (left) {
        Object.assign(left.style, {
          left: '0px',
          top: `${clamped.top}px`,
          width: `${Math.max(0, clamped.left)}px`,
          height: `${Math.max(0, clamped.bottom - clamped.top)}px`,
        })
      }
      if (right) {
        Object.assign(right.style, {
          left: `${clamped.right}px`,
          top: `${clamped.top}px`,
          width: `${Math.max(0, width - clamped.right)}px`,
          height: `${Math.max(0, clamped.bottom - clamped.top)}px`,
        })
      }
      if (ring) {
        Object.assign(ring.style, {
          left: `${clamped.left}px`,
          top: `${clamped.top}px`,
          width: `${Math.max(0, clamped.right - clamped.left)}px`,
          height: `${Math.max(0, clamped.bottom - clamped.top)}px`,
        })
      }
      if (shield) {
        Object.assign(shield.style, {
          left: `${clamped.left}px`,
          top: `${clamped.top}px`,
          width: `${Math.max(0, clamped.right - clamped.left)}px`,
          height: `${Math.max(0, clamped.bottom - clamped.top)}px`,
        })
      }

      const cardHeight = cardRef.current?.offsetHeight ?? 200
      setPlace(step!.place && step!.place !== 'auto' ? step!.place : placeFor(rect, cardHeight, pinnedTarget(element!)))
    }
    /**
     * Keyed on the phase as well as the step. On the first pass of a step the
     * anchor often has not rendered yet, and a single measurement then leaves
     * no hole at all; the engine's move to `settling` and `ready` is the signal
     * that it now exists and has stopped moving.
     */
  }, [run?.tour.id, run?.index, run?.phase, anchor, step])

  useEffect(() => {
    if (!run) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') exit()
      if (event.key === 'ArrowRight') next()
      if (event.key === 'ArrowLeft') back()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [run, exit, next, back])

  if (!run || !step) return null

  const total = run.tour.steps.length
  const position = run.index + 1
  const scrim = dim ? scrimStyle() : 'absolute pointer-events-auto'

  return (
    <div className="no-print pointer-events-none fixed inset-0 z-tour" aria-live="polite">
      {/* Four rects, one hole. Taps outside the hole land on the scrim. */}
      <div ref={topRef} className={scrim} />
      <div ref={bottomRef} className={scrim} />
      <div ref={leftRef} className={scrim} />
      <div ref={rightRef} className={scrim} />

      {hasHole && (
        <div
          ref={ringRef}
          className="pointer-events-none absolute rounded border-2 border-signal"
        />
      )}

      {/* Present unless the step invites a tap, in which case the hole is a real gap. */}
      {hasHole && !step.interactive && (
        <div ref={shieldRef} className="pointer-events-auto absolute" />
      )}

      <aside
        ref={cardRef}
        role="dialog"
        aria-modal="false"
        aria-label={`${run.tour.label}, step ${position} of ${total}`}
        className={`pointer-events-auto fixed inset-x-0 ${
          place === 'bottom' ? 'bottom-0' : 'top-0'
        } mx-auto max-w-[560px] border border-rail bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3`}
      >
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-13 font-medium text-slate">
            {run.tour.label} &middot; {position} of {total}
          </p>
          <button type="button" onClick={exit} className="h-tap px-1 text-15 text-signal">
            End walkthrough
          </button>
        </div>

        <h2 className="mt-1 text-20 font-medium">{step.title}</h2>
        <p className="mt-1 text-17">{step.body}</p>

        {run.phase === 'stuck' && (
          <p className="mt-2 text-15 text-slate">
            This step could not find what it wanted to point at. The description above still
            holds.
          </p>
        )}

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={back}
            disabled={run.index === 0}
            className="h-tap flex-1 rounded-card border border-signal text-17 font-medium text-signal disabled:border-rail disabled:text-slate"
          >
            Back
          </button>
          <button
            type="button"
            onClick={next}
            className="h-tap flex-[2] rounded-card bg-signal text-17 font-medium text-white"
          >
            {position === total ? 'Finish' : 'Next'}
          </button>
        </div>
      </aside>
    </div>
  )
}
