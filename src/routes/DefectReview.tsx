/**
 * Defect review, per brief section 10.5.
 *
 * Every failure collected, graded, with its computed due date and a
 * responsibility toggle the inspector can override. This is the screen where a
 * failed checklist line becomes somebody's dated obligation, which is the
 * second of the three things the demo has to land.
 */

import { Link, useNavigate, useParams } from 'react-router-dom'
import { PlaceholderBanner } from '../components/PlaceholderBanner'
import { StatusPill } from '../components/StatusPill'
import { formItems } from '../data/form-passenger-a'
import {
  bySeverity,
  countBySeverity,
  RESPONSIBILITY_LABEL,
  SEVERITY_LABEL,
  SEVERITY_MEANING,
} from '../lib/defects'
import { formatDay } from '../lib/dates'
import { inProgressFor } from '../lib/inspection'
import { buildingFor, liftById, serviceCompanyFor } from '../state/selectors'
import { useStore } from '../state/useStore'
import type { Defect, Responsibility } from '../types'

export default function DefectReview() {
  const { liftId } = useParams()
  const navigate = useNavigate()
  const { state, saveDefect } = useStore()
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

  const defects = state.defects
    .filter((defect) => defect.inspectionId === inspection.id)
    .sort(bySeverity)
  const counts = countBySeverity(defects)
  const owner = buildingFor(lift).ownerEntity
  const company = serviceCompanyFor(lift).name

  function setResponsibility(defect: Defect, responsibility: Responsibility) {
    saveDefect({ ...defect, responsibility })
  }

  return (
    <div className="min-h-dvh bg-paper pb-24">
      <header className="bg-shaft text-white">
        <div className="mx-auto flex max-w-[560px] items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-17 font-medium">
              {lift.label}, {buildingFor(lift).name}
            </p>
            <p className="font-mono text-13">{lift.officialNumber}</p>
          </div>
          <Link to={`/lift/${lift.id}/inspection`} className="shrink-0 text-15 underline">
            Back to form
          </Link>
        </div>
      </header>

      <PlaceholderBanner />

      <main className="mx-auto max-w-[560px] px-4 pt-5">
        <h1 className="text-25 font-semibold">Defect review</h1>

        {defects.length === 0 ? (
          <p className="mt-2 text-17">
            No items failed. Continue to sign off to issue the report.
          </p>
        ) : (
          <>
            <p className="mt-1 text-17">
              {defects.length} {defects.length === 1 ? 'defect' : 'defects'} raised on this
              inspection.
            </p>

            {/* Running count by severity. */}
            <ul className="mt-3 flex flex-wrap gap-2">
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

            <ul className="mt-4 divide-y divide-rail border-y border-rail">
              {defects.map((defect) => {
                const item = formItems.get(defect.itemId)
                const immediate = defect.severity === 'immediate'
                return (
                  <li key={defect.id} className="py-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="flex-1 text-17 font-medium">{defect.description}</p>
                      <StatusPill tone={immediate ? 'stop' : 'open'}>
                        {SEVERITY_LABEL[defect.severity]}
                      </StatusPill>
                    </div>
                    <p className="mt-0.5 text-15">
                      {defect.itemId} &middot; {item?.clauseRef}
                    </p>
                    <p className="mt-1 text-17">
                      Due {formatDay(defect.dueDate)}
                      <span className="text-slate"> &middot; {SEVERITY_MEANING[defect.severity]}</span>
                    </p>

                    {defect.raisedPhoto && (
                      <img
                        src={defect.raisedPhoto}
                        alt={`Photograph of ${defect.description.toLowerCase()}`}
                        className="mt-2 h-28 w-full rounded-card border border-rail object-cover"
                      />
                    )}

                    <p className="mt-3 text-13 font-medium text-slate">Responsibility</p>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      {(['serviceCompany', 'owner'] as const).map((responsibility) => {
                        const selected = defect.responsibility === responsibility
                        return (
                          <button
                            key={responsibility}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => setResponsibility(defect, responsibility)}
                            className={`h-tap rounded-card border px-2 text-15 font-medium ${
                              selected
                                ? 'border-signal bg-signal text-white'
                                : 'border-rail bg-white'
                            }`}
                          >
                            {RESPONSIBILITY_LABEL[responsibility]}
                            <span className="block text-13 font-normal">
                              {responsibility === 'owner' ? owner : company}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-rail bg-white">
        <div className="mx-auto max-w-[560px] px-4 py-3">
          <button
            type="button"
            onClick={() => navigate(`/lift/${lift.id}/inspection/sign-off`)}
            className="h-tap w-full rounded-card bg-signal text-17 font-medium text-white"
          >
            Continue to sign off
          </button>
        </div>
      </div>
    </div>
  )
}
