/**
 * Clause reference sheet, per brief section 9.
 *
 * One of the three things the demo has to land, so it has to be fast and
 * obvious: it slides up, it carries the placeholder notice because a clause is
 * showing, and "Back to item" returns to the exact scroll position the inspector
 * left. The scroll restore lives in the form, which owns the position.
 *
 * Motion is one of the few places the brief permits it. The slide is a keyframe,
 * not a JS-toggled transform, so the sheet is never left off-screen if the
 * animation does not run. The global prefers-reduced-motion rule flattens it.
 */

import { useEffect } from 'react'
import { PLACEHOLDER_NOTICE } from '../data/form-passenger-a'
import type { FormItem } from '../types'

export function ClauseSheet({ item, onClose }: { item: FormItem; onClose: () => void }) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close clause reference"
        onClick={onClose}
        className="absolute inset-0 bg-shaft/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Clause ${item.clauseRef}`}
        className="sheet-up relative max-h-[85dvh] overflow-y-auto rounded-t-sheet bg-white"
      >
        <div className="mx-auto max-w-[560px] px-4 pb-4 pt-5">
          <p className="text-13 font-medium text-slate">Clause reference</p>
          <h2 className="text-25 font-semibold">{item.clauseRef}</h2>
          <p className="mt-3 text-17">{item.text}</p>
          <p className="mt-3 text-17">{item.clausePlaceholder}</p>
          <p className="mt-4 border-y border-open/40 bg-open-tint px-3 py-2 text-15 text-open">
            {PLACEHOLDER_NOTICE}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 h-tap w-full rounded-card bg-signal text-17 font-medium text-white"
          >
            Back to item
          </button>
        </div>
      </div>
    </div>
  )
}
