/**
 * The stop-use order, stated wherever a lift under one appears. Per brief 7.1
 * the order surfaces everywhere the lift does, and per 4.7 it says what has to
 * happen next rather than only what is wrong.
 *
 * Compact by default. The full-bleed interstitial is the moment the order is
 * raised; this is the standing reminder that it is still in force.
 */

import { Link } from 'react-router-dom'
import type { Defect } from '../types'

export function StopUseNotice({
  defects,
  linkToDefect,
}: {
  /** The open immediate defects holding the order. */
  defects: Defect[]
  linkToDefect?: boolean
}) {
  const single = defects.length === 1

  return (
    <div className="rounded-card border border-stop bg-stop-tint p-3">
      <p className="text-17 font-medium text-stop">Not for use</p>
      <p className="mt-1 text-17">
        No person may be conveyed in this lift until the{' '}
        {single ? 'defect below is' : 'defects below are'} rectified.
      </p>
      {defects.length > 0 && (
        <ul className="mt-2">
          {defects.map((defect) => (
            <li key={defect.id} className="text-17">
              {linkToDefect ? (
                <Link to={`/defect/${defect.id}`} className="text-signal underline">
                  {defect.description}
                </Link>
              ) : (
                defect.description
              )}
              <span className="text-slate"> &middot; {defect.itemId}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-15 text-slate">
        The order lifts when the responsible party closes it with photographic
        evidence.
      </p>
    </div>
  )
}
