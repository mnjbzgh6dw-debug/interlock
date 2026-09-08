/**
 * A lift's inspection history, per Tier 2 item 22.
 *
 * The point is browsability: 25 seeded inspections going back to 2018 are worth
 * nothing as a list you scroll past. Here the record reads as a sequence, with
 * the interval between inspections stated, and each report one tap away and
 * navigable from the next without coming back here.
 *
 * Deliberately no trend charting of readings across inspections. That is Tier 3.
 */

import { Link, useParams } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { StatusPill } from '../components/StatusPill'
import { elapsedLabel, LIFT_TYPE_LABEL } from '../lib/compliance'
import { formatDay, monthsBetween } from '../lib/dates'
import { buildingFor, failedItemIds, inspectionsFor, liftById } from '../state/selectors'
import { useStore } from '../state/useStore'

export default function LiftHistory() {
  const { liftId } = useParams()
  const { state } = useStore()
  const lift = liftId ? liftById(state, liftId) : undefined

  if (!lift) {
    return (
      <div className="min-h-dvh bg-paper">
        <AppHeader />
        <main className="mx-auto max-w-[560px] px-4 pt-6">
          <h1 className="text-25 font-semibold">Lift not found</h1>
          <p className="mt-2 text-17">
            That lift is not on this register.{' '}
            <Link to="/register" className="text-signal underline">
              Open the register
            </Link>
            .
          </p>
        </main>
      </div>
    )
  }

  const history = inspectionsFor(state, lift.id).filter((i) => i.completedAt !== null)
  const building = buildingFor(lift)

  return (
    <div className="min-h-dvh bg-paper pb-10">
      <AppHeader />
      <main className="mx-auto max-w-[560px] px-4 pt-5">
        <Link to={`/lift/${lift.id}`} className="inline-flex items-center gap-1 text-15 text-signal">
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 5l-7 7 7 7" />
          </svg>
          {lift.label}
        </Link>

        <h1 className="mt-2 text-25 font-semibold">Inspection history</h1>
        <p className="mt-1 text-17">
          {lift.label}, {building.name}
        </p>
        <p className="font-mono text-15">{lift.officialNumber}</p>

        {history.length === 0 ? (
          <p className="mt-6 text-17">
            {LIFT_TYPE_LABEL[lift.type]} has no inspections on record. The first one will appear
            here once a report is issued.
          </p>
        ) : (
          <>
            <p className="mt-3 text-17">
              {history.length} {history.length === 1 ? 'inspection' : 'inspections'} on record,
              {' '}
              {formatDay(history[history.length - 1].startedAt.slice(0, 10))} to{' '}
              {formatDay(history[0].startedAt.slice(0, 10))}.
            </p>

            <ol className="mt-4 divide-y divide-rail border-y border-rail">
              {history.map((inspection, index) => {
                const day = (inspection.completedAt ?? inspection.startedAt).slice(0, 10)
                const previous = history[index + 1]
                const gapMonths = previous
                  ? monthsBetween(previous.startedAt.slice(0, 10), day)
                  : null
                const fails = failedItemIds(inspection).length
                const ago = elapsedLabel(day, state.demoDate)
                return (
                  <li key={inspection.id}>
                    <Link
                      to={`/inspection/${inspection.id}/report`}
                      className="flex items-center gap-3 bg-white px-4 py-3"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline gap-2">
                          <span className="text-17 font-medium">{formatDay(day)}</span>
                          {index === 0 && <StatusPill tone="verified">Most recent</StatusPill>}
                          {fails > 0 && (
                            <StatusPill tone="open">
                              {fails} {fails === 1 ? 'defect' : 'defects'}
                            </StatusPill>
                          )}
                        </span>
                        <span className="block text-15">
                          {inspection.inspectorName} &middot; {inspection.inspectorReg}
                        </span>
                        <span className="block font-mono text-15">
                          {inspection.verificationCode}
                        </span>
                        <span className="block text-15 text-slate">
                          {ago}
                          {gapMonths !== null && ` · ${gapMonths} months after the previous`}
                        </span>
                      </span>
                      <svg
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className="shrink-0 text-slate"
                      >
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                )
              })}
            </ol>
          </>
        )}
      </main>
    </div>
  )
}
