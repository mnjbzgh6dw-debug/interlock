/**
 * Sign off, per brief section 10.6.
 *
 * Summary, the inspector's identity and registration, the final signature, and
 * submit. Submit is permitted with items unanswered and raises no confirmation
 * dialog: completion is reporting, not gating. The one thing held back is the
 * signature itself, because an unsigned statutory report is not a report.
 */

import { Link, useNavigate, useParams } from 'react-router-dom'
import { PlaceholderBanner } from '../components/PlaceholderBanner'
import { SignaturePad } from '../components/SignaturePad'
import { StatusPill } from '../components/StatusPill'
import { personaById } from '../data/personas'
import { formPassengerA } from '../data/form-passenger-a'
import {
  bySeverity,
  countBySeverity,
  notificationRecipients,
  SEVERITY_LABEL,
} from '../lib/defects'
import { addMonths, formatDay, INSPECTION_INTERVAL_MONTHS } from '../lib/dates'
import { inProgressFor, sectionProgress, totalAnswered, totalItems } from '../lib/inspection'
import { buildingFor, liftById, serviceCompanyFor } from '../state/selectors'
import { useStore } from '../state/useStore'

export default function SignOff() {
  const { liftId } = useParams()
  const navigate = useNavigate()
  const { state, saveInspection, saveLift } = useStore()
  const lift = liftId ? liftById(state, liftId) : undefined
  const inspection = lift ? inProgressFor(state.inspections, lift.id) : undefined

  if (!lift || !inspection) {
    return (
      <div className="min-h-dvh bg-paper px-4 pt-6">
        <p className="text-17">
          No inspection in progress.{' '}
          <Link to="/" className="text-signal underline">
            Open the register
          </Link>
          .
        </p>
      </div>
    )
  }

  const form = formPassengerA
  const inspector = personaById.get('inspector')!
  const answered = totalAnswered(form, inspection)
  const total = totalItems(form)
  const progress = sectionProgress(form, inspection)
  const signedSections = progress.filter((entry) => entry.signed).length
  const defects = state.defects
    .filter((defect) => defect.inspectionId === inspection.id)
    .sort(bySeverity)
  const counts = countBySeverity(defects)

  function submit() {
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const at = `${state.demoDate}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}+02:00`
    /**
     * Distribution is recorded at issue, per brief section 10.8. The regulator is
     * on every report's list. Nothing is sent: this is an in-app record.
     */
    const distributedTo = notificationRecipients(
      buildingFor(lift!),
      serviceCompanyFor(lift!),
      true,
    ).map((entry) => ({ ...entry, sentAt: at }))
    saveInspection({ ...inspection!, completedAt: at, distributedTo })
    /**
     * Issuing the report restarts the compliance clock. Without this a lift that
     * has just been inspected still reads "25 days overdue" on the register,
     * which is the first thing anyone would notice.
     */
    saveLift({
      ...lift!,
      lastReportDate: state.demoDate,
      nextDueDate: addMonths(state.demoDate, INSPECTION_INTERVAL_MONTHS),
    })
    navigate(`/inspection/${inspection!.id}/report`)
  }

  return (
    <div className="min-h-dvh bg-paper pb-32">
      <header className="bg-shaft text-white">
        <div className="mx-auto flex max-w-[560px] items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-17 font-medium">
              {lift.label}, {buildingFor(lift).name}
            </p>
            <p className="font-mono text-13">{lift.officialNumber}</p>
          </div>
          <Link
            to={`/lift/${lift.id}/inspection/defects`}
            className="shrink-0 text-15 underline"
          >
            Back
          </Link>
        </div>
      </header>

      <PlaceholderBanner />

      <main className="mx-auto max-w-[560px] px-4 pt-5">
        <h1 className="text-25 font-semibold">Sign off</h1>

        <dl className="mt-4 divide-y divide-rail rounded-card border border-rail bg-white px-4">
          <div className="flex items-baseline justify-between gap-4 py-2">
            <dt className="text-13 font-medium text-slate">Items answered</dt>
            <dd className="text-17">
              {answered} of {total}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-2">
            <dt className="text-13 font-medium text-slate">Sections signed</dt>
            <dd className="text-17">{signedSections} of {progress.length}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-2">
            <dt className="text-13 font-medium text-slate">Inspection date</dt>
            <dd className="text-17">{formatDay(state.demoDate)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-2">
            <dt className="text-13 font-medium text-slate">Verification code</dt>
            <dd className="font-mono text-17">{inspection.verificationCode}</dd>
          </div>
        </dl>

        <section className="mt-6">
          <h2 className="text-20 font-medium">Defects</h2>
          {defects.length === 0 ? (
            <p className="mt-1 text-17">No defects raised on this inspection.</p>
          ) : (
            <>
              <ul className="mt-2 flex flex-wrap gap-2">
                {counts.map(({ severity, count }) => (
                  <li key={severity}>
                    <StatusPill
                      tone={
                        severity === 'immediate'
                          ? 'stop'
                          : severity === 'nextInspection'
                            ? 'verified'
                            : 'open'
                      }
                    >
                      {`${count} ${SEVERITY_LABEL[severity].toLowerCase()}`}
                    </StatusPill>
                  </li>
                ))}
              </ul>
              <ul className="mt-3 divide-y divide-rail border-y border-rail">
                {defects.map((defect) => (
                  <li key={defect.id} className="py-2">
                    <p className="text-17">{defect.description}</p>
                    <p className="text-15">
                      {defect.itemId} &middot; due {formatDay(defect.dueDate)}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section className="mt-6">
          <h2 className="text-20 font-medium">Inspector</h2>
          <div className="mt-2 rounded-card border border-rail bg-white p-4">
            <p className="text-17">{inspector.name}</p>
            <p className="text-15">Registered Lift Inspector, {inspector.reg}</p>
            <p className="text-15">
              {inspector.organisation}, SANAS {inspector.accreditation}
            </p>
          </div>
        </section>

        <div className="mt-6">
          <SignaturePad
            label="Inspector signature"
            value={inspection.finalSignature}
            onChange={(dataUrl) => saveInspection({ ...inspection, finalSignature: dataUrl })}
          />
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-rail bg-white">
        <div className="mx-auto max-w-[560px] px-4 py-3">
          {!inspection.finalSignature && (
            <p className="mb-2 text-15 text-slate">Sign above to submit the report.</p>
          )}
          <button
            type="button"
            onClick={submit}
            disabled={!inspection.finalSignature}
            className="h-tap w-full rounded-card bg-signal text-17 font-medium text-white disabled:bg-rail disabled:text-slate"
          >
            Submit report
          </button>
        </div>
      </div>
    </div>
  )
}
