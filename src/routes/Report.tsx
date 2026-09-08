/**
 * The report, per brief section 11.
 *
 * It must not look like an app screen with a download button. Letterhead,
 * hairline rules, every item and every response, signatures rendered where a
 * signature belongs, and a verification block. The print stylesheet in index.css
 * strips the remaining chrome for A4.
 */

import { useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { VerificationQr } from '../components/VerificationQr'
import { formPassengerA, PLACEHOLDER_NOTICE } from '../data/form-passenger-a'
import { personaById } from '../data/personas'
import { LIFT_TYPE_LABEL } from '../lib/compliance'
import { bySeverity, RESPONSIBILITY_LABEL, SEVERITY_LABEL } from '../lib/defects'
import { formatDay } from '../lib/dates'
import { displayValue } from '../lib/inspection'
import { buildingFor, liftById, serviceCompanyFor } from '../state/selectors'
import { useStore } from '../state/useStore'
import type { Inspection, Lift, ResponseResult } from '../types'

const RESULT_TEXT: Record<ResponseResult, string> = {
  pass: 'Pass',
  fail: 'Fail',
  na: 'N/A',
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4 border-b border-rail py-1">
      <span className="text-13 font-medium text-slate">{label}</span>
      <span className={`text-right text-15 ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  )
}

function Letterhead({ inspection }: { inspection: Inspection }) {
  const provider = personaById.get('inspector')!
  return (
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
  )
}

export default function Report() {
  const { inspectionId } = useParams()
  const [params] = useSearchParams()
  const { state } = useStore()
  const inspection = state.inspections.find((i) => i.id === inspectionId)
  const lift: Lift | undefined = inspection ? liftById(state, inspection.liftId) : undefined

  // Reached from the distribution screen's print action.
  const autoPrint = params.get('print') === '1'
  useEffect(() => {
    if (!autoPrint || !inspection) return
    const timer = setTimeout(() => window.print(), 400)
    return () => clearTimeout(timer)
  }, [autoPrint, inspection])

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
  const form = formPassengerA
  const usesLoadedForm = inspection.formId === form.id
  const inspectionDay = (inspection.completedAt ?? inspection.startedAt).slice(0, 10)
  const defects = state.defects
    .filter((defect) => defect.inspectionId === inspection.id)
    .sort(bySeverity)
  const verifyUrl = `${window.location.origin}${import.meta.env.BASE_URL}verify/${inspection.verificationCode}`

  return (
    <div className="min-h-dvh bg-paper">
      {/* Screen-only chrome. None of this prints. */}
      <div className="no-print border-b border-rail bg-white">
        <div className="mx-auto flex max-w-[820px] items-center justify-between gap-3 px-4 py-3">
          <Link to={`/lift/${lift.id}`} className="text-15 text-signal underline">
            {lift.label}, {building.name}
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to={`/inspection/${inspection.id}/distribution`}
              className="text-15 text-signal underline"
            >
              Distribution
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
      </div>

      <article className="report mx-auto max-w-[820px] bg-white px-8 py-8 text-shaft">
        <Letterhead inspection={inspection} />

        <h1 className="report-block mt-5 text-31 font-semibold">{form.title}</h1>

        <p className="report-block mt-3 border-y border-open/40 bg-open-tint px-3 py-2 text-13 text-open">
          {PLACEHOLDER_NOTICE}
        </p>

        <div className="report-block mt-5 grid gap-6 sm:grid-cols-2">
          <section>
            <h2 className="text-13 font-medium text-slate">Premises</h2>
            <p className="mt-1 text-17 font-medium">{building.name}</p>
            <p className="text-15">{building.address}</p>
            <p className="text-15">Owner: {building.ownerEntity}</p>
            <p className="text-15">
              {building.contactName}, {building.contactEmail}
            </p>
          </section>
          <section>
            <h2 className="text-13 font-medium text-slate">Equipment</h2>
            <p className="mt-1 text-17 font-medium">{lift.label}</p>
            <p className="font-mono text-15">{lift.officialNumber}</p>
            <div className="mt-2">
              <Row label="Type" value={LIFT_TYPE_LABEL[lift.type]} />
              <Row label="Floors served" value={String(lift.floorsServed)} />
              <Row
                label="Rated load"
                value={lift.ratedLoadKg === null ? 'Not applicable' : `${lift.ratedLoadKg} kg`}
              />
              <Row
                label="Rated speed"
                value={
                  lift.ratedSpeedMs === null ? 'Not applicable' : `${lift.ratedSpeedMs.toFixed(1)} m/s`
                }
              />
              <Row label="Drive" value={lift.driveType} />
              <Row label="Installed" value={formatDay(lift.installedDate)} />
              <Row label="Manufacturer" value={lift.oem} />
              <Row label="Maintained by" value={company.name} />
            </div>
          </section>
        </div>

        <div className="report-block mt-5 grid gap-6 sm:grid-cols-2">
          <section>
            <h2 className="text-13 font-medium text-slate">Inspection</h2>
            <div className="mt-1">
              <Row label="Date of inspection" value={formatDay(inspectionDay)} />
              <Row label="Inspector" value={inspection.inspectorName} />
              <Row label="Registration" value={inspection.inspectorReg} />
              <Row label="Verification code" value={inspection.verificationCode} mono />
              {inspection.capturedOffline && (
                <Row
                  label="Capture"
                  value={
                    inspection.syncedAt
                      ? `Captured offline, synced at ${inspection.syncedAt.slice(11, 16)}`
                      : 'Captured offline'
                  }
                />
              )}
            </div>
          </section>
          <section className="report-block">
            <h2 className="text-13 font-medium text-slate">Verification</h2>
            <div className="mt-1 flex items-start gap-3">
              <VerificationQr url={verifyUrl} />
              <div>
                <p className="font-mono text-17">{inspection.verificationCode}</p>
                <p className="mt-1 text-13">
                  Scan to confirm this record against the register.
                </p>
              </div>
            </div>
          </section>
        </div>

        {usesLoadedForm ? (
          form.sections.map((section) => (
            <section key={section.id} className="report-section mt-6">
              <h2 className="border-b border-shaft pb-1 text-20 font-medium">
                {section.id}. {section.title}
              </h2>
              <table className="mt-2 w-full border-collapse text-left">
                <thead>
                  <tr>
                    <th className="w-10 border-b border-rail py-1 text-13 font-medium text-slate">
                      Item
                    </th>
                    <th className="border-b border-rail py-1 text-13 font-medium text-slate">
                      Requirement
                    </th>
                    <th className="w-24 border-b border-rail py-1 text-13 font-medium text-slate">
                      Clause
                    </th>
                    <th className="w-28 border-b border-rail py-1 text-13 font-medium text-slate">
                      Measured
                    </th>
                    <th className="w-16 border-b border-rail py-1 text-13 font-medium text-slate">
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((item) => {
                    const response = inspection.responses[item.id]
                    const measured = displayValue(item, response)
                    return (
                      <tr key={item.id} className="report-item align-top">
                        <td className="border-b border-rail py-1 text-15 font-medium">{item.id}</td>
                        <td className="border-b border-rail py-1 pr-3 text-15">{item.text}</td>
                        <td className="border-b border-rail py-1 text-15">{item.clauseRef}</td>
                        <td className="border-b border-rail py-1 text-15">
                          {measured ?? (item.expectedLabel ? `Expected ${item.expectedLabel}` : '—')}
                        </td>
                        <td
                          className={`border-b border-rail py-1 text-15 font-medium ${
                            response?.result === 'fail'
                              ? 'text-stop'
                              : response?.result === 'pass'
                                ? 'text-verified'
                                : ''
                          }`}
                        >
                          {response ? RESULT_TEXT[response.result] : 'Not recorded'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              <div className="report-signature mt-3 flex items-end gap-4">
                {inspection.sectionSignatures[section.id] ? (
                  <img
                    src={inspection.sectionSignatures[section.id]}
                    alt={`Inspector signature, section ${section.id}`}
                    className="h-16"
                  />
                ) : (
                  <p className="text-15 text-slate">Section not signed</p>
                )}
                <p className="border-t border-shaft pt-1 text-13">
                  {inspection.inspectorName}, section {section.id}, {formatDay(inspectionDay)}
                </p>
              </div>
            </section>
          ))
        ) : (
          <section className="report-section mt-6">
            <h2 className="border-b border-shaft pb-1 text-20 font-medium">Checklist</h2>
            <p className="mt-2 text-15">
              This record was captured on form {inspection.formId}, which is not loaded in this
              demonstration. The item responses are held against that form.
            </p>
          </section>
        )}

        <section className="report-section mt-7">
          <h2 className="border-b border-shaft pb-1 text-20 font-medium">Defect schedule</h2>
          {defects.length === 0 ? (
            <p className="mt-2 text-15">No defects were recorded on this inspection.</p>
          ) : (
            <table className="mt-2 w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="w-10 border-b border-rail py-1 text-13 font-medium text-slate">
                    Item
                  </th>
                  <th className="border-b border-rail py-1 text-13 font-medium text-slate">
                    Defect
                  </th>
                  <th className="w-32 border-b border-rail py-1 text-13 font-medium text-slate">
                    Severity
                  </th>
                  <th className="w-28 border-b border-rail py-1 text-13 font-medium text-slate">
                    Responsibility
                  </th>
                  <th className="w-32 border-b border-rail py-1 text-13 font-medium text-slate">
                    Due
                  </th>
                </tr>
              </thead>
              <tbody>
                {defects.map((defect) => (
                  <tr key={defect.id} className="report-item align-top">
                    <td className="border-b border-rail py-1 text-15 font-medium">
                      {defect.itemId}
                    </td>
                    <td className="border-b border-rail py-1 pr-3 text-15">{defect.description}</td>
                    <td
                      className={`border-b border-rail py-1 text-15 ${
                        defect.severity === 'immediate' ? 'font-medium text-stop' : ''
                      }`}
                    >
                      {SEVERITY_LABEL[defect.severity]}
                    </td>
                    <td className="border-b border-rail py-1 text-15">
                      {RESPONSIBILITY_LABEL[defect.responsibility]}
                    </td>
                    <td className="border-b border-rail py-1 text-15">
                      {formatDay(defect.dueDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {defects.some((defect) => defect.severity === 'immediate') && (
            <p className="report-block mt-3 border border-stop bg-stop-tint px-3 py-2 text-15 text-stop">
              Stop-use order in force. No person may be conveyed in this lift until the immediate
              defect is rectified.
            </p>
          )}
        </section>

        <section className="report-signature mt-8">
          <h2 className="text-13 font-medium text-slate">Certification</h2>
          <p className="mt-1 text-15">
            I certify that the equipment described above was inspected on the date shown and that
            the results recorded are a true reflection of that inspection.
          </p>
          <div className="mt-3 flex items-end gap-6">
            {inspection.finalSignature ? (
              <img
                src={inspection.finalSignature}
                alt="Inspector signature"
                className="h-20"
              />
            ) : (
              <p className="text-15 text-slate">Not signed</p>
            )}
            <div className="border-t border-shaft pt-1">
              <p className="text-15 font-medium">{inspection.inspectorName}</p>
              <p className="text-13">Registered Lift Inspector, {inspection.inspectorReg}</p>
              <p className="text-13">
                {personaById.get('inspector')!.organisation} &middot;{' '}
                {formatDay(inspectionDay)}
              </p>
            </div>
          </div>
        </section>

        {/* Print-only, repeated on every page. */}
        <div className="report-running-footer hidden">
          <div className="flex justify-between gap-4">
            <span>
              {building.name} &middot; {lift.label} &middot; {lift.officialNumber}
            </span>
            <span>
              {inspection.verificationCode} &middot; {formatDay(inspectionDay)}
            </span>
          </div>
        </div>
      </article>
    </div>
  )
}
