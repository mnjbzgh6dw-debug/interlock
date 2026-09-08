/**
 * Distribution, per brief section 10.8.
 *
 * The four recipients with the timestamps recorded when the report was issued,
 * labelled as simulated without apology. There is deliberately no outbox of fake
 * emails: a screen full of invented messages invites scrutiny of the messages.
 */

import { Link, useNavigate, useParams } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { formatDay } from '../lib/dates'
import { buildingFor, liftById } from '../state/selectors'
import { useStore } from '../state/useStore'
import { ANCHOR, tourAnchor } from '../tour/anchors'

export default function Distribution() {
  const { inspectionId } = useParams()
  const navigate = useNavigate()
  const { state } = useStore()
  const inspection = state.inspections.find((i) => i.id === inspectionId)
  const lift = inspection ? liftById(state, inspection.liftId) : undefined

  if (!inspection || !lift) {
    return (
      <div className="min-h-dvh bg-paper px-4 pt-6">
        <p className="text-17">
          That report is not on record.{' '}
          <Link to="/" className="text-signal underline">
            Open the register
          </Link>
          .
        </p>
      </div>
    )
  }

  const building = buildingFor(lift)
  const day = (inspection.completedAt ?? inspection.startedAt).slice(0, 10)

  return (
    <div className="min-h-dvh bg-paper pb-28">
      <AppHeader />
      <main className="mx-auto max-w-[560px] px-4 pt-5">
        <h1 className="text-25 font-semibold">Distribution</h1>
        <p className="mt-1 text-17">
          {lift.label}, {building.name} &middot; {formatDay(day)}
        </p>
        <p className="font-mono text-15">{inspection.verificationCode}</p>

        {inspection.distributedTo.length === 0 ? (
          <p className="mt-5 text-17">
            This report has no distribution recorded. Submit an inspection to issue one.
          </p>
        ) : (
          <ul
            {...tourAnchor(ANCHOR.distributionList)}
            className="mt-5 divide-y divide-rail border-y border-rail"
          >
            {inspection.distributedTo.map((entry) => (
              <li key={entry.role} className="py-3">
                <p className="text-17">{entry.role}</p>
                <p className="text-15">{entry.recipient}</p>
                <p className="text-15 text-slate">
                  Recorded {formatDay(entry.sentAt.slice(0, 10))} at {entry.sentAt.slice(11, 16)}
                </p>
              </li>
            ))}
          </ul>
        )}

        <p
          {...tourAnchor(ANCHOR.distributionSimulated)}
          className="mt-4 rounded-card border border-rail bg-white p-3 text-15"
        >
          Simulated. Distribution is recorded in this app only, and nothing was sent to any
          recipient.
        </p>

        <Link
          to={`/inspection/${inspection.id}/report`}
          className="mt-5 inline-flex h-tap items-center text-17 font-medium text-signal"
        >
          Open the report
        </Link>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-rail bg-white">
        <div className="mx-auto max-w-[560px] px-4 py-3">
          <button
            type="button"
            onClick={() => navigate(`/inspection/${inspection.id}/report?print=1`)}
            className="h-tap w-full rounded-card bg-signal text-17 font-medium text-white"
          >
            Print or save PDF
          </button>
        </div>
      </div>
    </div>
  )
}
