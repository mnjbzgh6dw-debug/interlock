/**
 * Closure addendum, per Tier 2 item 25.
 *
 * The second report variant. The certificate records what was wrong on the day;
 * this records what was done about it, with the evidence and the signature of
 * whoever did it. It is the closure loop reaching the document, which is the
 * thing section 2 calls the differentiator: everyone has seen a digital form,
 * almost nobody has seen the obligation closed out on the paper.
 *
 * It references the parent report's verification code rather than minting its
 * own. There is one record per inspection and this is part of it.
 */

import { Link, useParams } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { StatusPill } from '../components/StatusPill'
import { PLACEHOLDER_NOTICE } from '../data/form-passenger-a'
import { personaById } from '../data/personas'
import { formItems } from '../data/form-passenger-a'
import { bySeverity, RESPONSIBILITY_LABEL, SEVERITY_LABEL } from '../lib/defects'
import { formatDay } from '../lib/dates'
import { reminderRecipients, remindersFor } from '../lib/reminders'
import { buildingFor, isOverdue, liftById, serviceCompanyFor } from '../state/selectors'
import { useStore } from '../state/useStore'
import { ANCHOR, tourAnchor } from '../tour/anchors'

export default function Addendum() {
  const { inspectionId } = useParams()
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
  const company = serviceCompanyFor(lift)
  const provider = personaById.get('inspector')!
  const inspectionDay = (inspection.completedAt ?? inspection.startedAt).slice(0, 10)
  const defects = state.defects
    .filter((defect) => defect.inspectionId === inspection.id)
    .sort(bySeverity)
  const closed = defects.filter((defect) => defect.status === 'closed')
  const outstanding = defects.filter((defect) => defect.status === 'open')

  return (
    <div className="min-h-dvh bg-paper print:bg-white">
      <div className="no-print border-b border-rail bg-white">
        <div className="mx-auto flex max-w-[820px] items-center justify-between gap-3 px-4 py-3">
          <Link to={`/inspection/${inspection.id}/report`} className="text-15 text-signal underline">
            Inspection report
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="h-tap rounded-card bg-signal px-4 text-17 font-medium text-white"
          >
            Print or save PDF
          </button>
        </div>
      </div>

      <article className="report mx-auto max-w-[820px] bg-white px-8 py-8 text-shaft">
        <header className="report-block flex items-start justify-between gap-6 border-b-2 border-shaft pb-4">
          <div className="flex items-center gap-3">
            <Logo size={40} variant="reversed" labelled={false} />
            <div>
              <p className="text-20 font-semibold tracking-wordmark">Interlock</p>
              <p className="text-13 text-slate">Statutory lift inspection record</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-15 font-medium">{provider.organisation}</p>
            <p className="text-13">Approved inspection authority</p>
            <p className="text-13">SANAS {provider.accreditation}</p>
            <p className="mt-1 font-mono text-13">{inspection.verificationCode}</p>
          </div>
        </header>

        <h1 className="report-block mt-5 text-31 font-semibold">Defect closure addendum</h1>

        <p className="report-block mt-3 border-y border-open/40 bg-open-tint px-3 py-2 text-13 text-open">
          {PLACEHOLDER_NOTICE}
        </p>

        <div className="report-block mt-5">
          <p className="text-17">
            Addendum to the inspection report for {lift.label}, {building.name}, dated{' '}
            {formatDay(inspectionDay)}, carrying verification code{' '}
            <span className="font-mono">{inspection.verificationCode}</span>.
          </p>
          <p className="mt-2 text-15">
            {building.address} &middot; Owner: {building.ownerEntity} &middot; Maintained by{' '}
            {company.name} &middot; Official number{' '}
            <span className="font-mono">{lift.officialNumber}</span>
          </p>
          <p className="mt-2 text-15">
            {closed.length} of {defects.length}{' '}
            {defects.length === 1 ? 'defect' : 'defects'} raised on that inspection{' '}
            {closed.length === 1 ? 'has' : 'have'} been closed as at{' '}
            {formatDay(state.demoDate)}.
          </p>
        </div>

        <section className="report-section mt-7" {...tourAnchor(ANCHOR.addendumClosed)}>
          <h2 className="border-b border-shaft pb-1 text-20 font-medium">Closed defects</h2>
          {closed.length === 0 ? (
            <p className="mt-2 text-15">
              No defect from this inspection has been closed. The schedule on the report stands in
              full.
            </p>
          ) : (
            closed.map((defect) => (
              <div key={defect.id} className="report-item mt-4 border border-rail p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-17 font-medium">{defect.description}</p>
                    <p className="text-15">
                      {defect.itemId} &middot; {formItems.get(defect.itemId)?.clauseRef} &middot;{' '}
                      {formItems.get(defect.itemId)?.text}
                    </p>
                  </div>
                  <StatusPill tone="verified">Closed</StatusPill>
                </div>

                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="flex justify-between gap-4 border-b border-rail py-1">
                      <span className="text-13 font-medium text-slate">Severity</span>
                      <span className="text-15">{SEVERITY_LABEL[defect.severity]}</span>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-rail py-1">
                      <span className="text-13 font-medium text-slate">Responsibility</span>
                      <span className="text-15">
                        {RESPONSIBILITY_LABEL[defect.responsibility]}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-rail py-1">
                      <span className="text-13 font-medium text-slate">Raised</span>
                      <span className="text-15">{formatDay(defect.raisedDate)}</span>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-rail py-1">
                      <span className="text-13 font-medium text-slate">Due</span>
                      <span className="text-15">{formatDay(defect.dueDate)}</span>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-rail py-1">
                      <span className="text-13 font-medium text-slate">Closed</span>
                      <span className="text-15">
                        {defect.closedAt ? formatDay(defect.closedAt.slice(0, 10)) : '—'}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-rail py-1">
                      <span className="text-13 font-medium text-slate">Closed by</span>
                      <span className="text-right text-15">{defect.closedBy ?? '—'}</span>
                    </div>
                  </div>

                  <div>
                    {defect.evidencePhoto ? (
                      <>
                        <p className="text-13 font-medium text-slate">Evidence of rectification</p>
                        <img
                          src={defect.evidencePhoto}
                          alt={`Evidence that ${defect.description.toLowerCase()} was rectified`}
                          className="mt-1 w-full border border-rail"
                        />
                      </>
                    ) : (
                      <p className="text-15">No photographic evidence on record.</p>
                    )}
                  </div>
                </div>

                <div className="report-signature mt-3 flex items-end gap-4">
                  {defect.closureSignature ? (
                    <img
                      src={defect.closureSignature}
                      alt={`Signature closing ${defect.description.toLowerCase()}`}
                      className="h-16"
                    />
                  ) : (
                    <p className="text-15">Not signed</p>
                  )}
                  <p className="border-t border-shaft pt-1 text-13">
                    {defect.closedBy ?? 'Unsigned'}
                    {defect.closedAt ? `, ${formatDay(defect.closedAt.slice(0, 10))}` : ''}
                  </p>
                </div>
              </div>
            ))
          )}
        </section>

        {outstanding.length > 0 && (
          <section className="report-section mt-7" {...tourAnchor(ANCHOR.addendumOutstanding)}>
            <h2 className="border-b border-shaft pb-1 text-20 font-medium">Still outstanding</h2>
            <table className="mt-2 w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="w-10 border-b border-rail py-1 text-13 font-medium text-slate">
                    Item
                  </th>
                  <th className="border-b border-rail py-1 text-13 font-medium text-slate">
                    Defect
                  </th>
                  <th className="w-28 border-b border-rail py-1 text-13 font-medium text-slate">
                    Responsibility
                  </th>
                  <th className="w-32 border-b border-rail py-1 text-13 font-medium text-slate">
                    Due
                  </th>
                  <th className="w-24 border-b border-rail py-1 text-13 font-medium text-slate">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {outstanding.map((defect) => {
                  const late = isOverdue(defect, state.demoDate)
                  const chased = remindersFor(
                    defect,
                    state.demoDate,
                    reminderRecipients(defect, building, company),
                  ).length
                  return (
                    <tr key={defect.id} className="report-item align-top">
                      <td className="border-b border-rail py-1 text-15 font-medium">
                        {defect.itemId}
                      </td>
                      <td className="border-b border-rail py-1 pr-3 text-15">
                        {defect.description}
                      </td>
                      <td className="border-b border-rail py-1 text-15">
                        {RESPONSIBILITY_LABEL[defect.responsibility]}
                      </td>
                      <td className="border-b border-rail py-1 text-15">
                        {formatDay(defect.dueDate)}
                      </td>
                      <td
                        className={`border-b border-rail py-1 text-15 ${
                          late ? 'font-medium text-stop' : ''
                        }`}
                      >
                        {late ? 'Overdue' : 'Open'}
                        {chased > 0 && (
                          <span className="block text-13">
                            {chased} {chased === 1 ? 'reminder' : 'reminders'}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </section>
        )}

        <div className="report-running-footer hidden">
          <div className="flex justify-between gap-4">
            <span>
              {building.name} &middot; {lift.label} &middot; {lift.officialNumber}
            </span>
            <span>
              Closure addendum &middot; {inspection.verificationCode}
            </span>
          </div>
        </div>
      </article>
    </div>
  )
}
