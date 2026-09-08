/**
 * /verify/:code, per brief 7.4 and section 10.11.
 *
 * A minimal public record: no chrome, no nav, nothing to tap into the app. It
 * ships with the report rather than after it, because a QR that resolves to a
 * 404 breaks the no-dead-button rule.
 */

import { useParams } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { formatDay } from '../lib/dates'
import { buildingFor, inspectionByCode, liftById, openDefectsFor } from '../state/selectors'
import { useStore } from '../state/useStore'

export default function Verify() {
  const { code } = useParams()
  const { state } = useStore()
  const inspection = code ? inspectionByCode(state, code) : undefined
  const lift = inspection ? liftById(state, inspection.liftId) : undefined

  if (!inspection || !lift) {
    return (
      <main className="mx-auto max-w-[480px] px-5 py-10">
        <Logo size={32} variant="reversed" labelled={false} />
        <h1 className="mt-4 text-25 font-semibold">No such record</h1>
        <p className="mt-2 text-17">
          No inspection on this register carries the code{' '}
          <span className="font-mono">{code}</span>. Check the code on the report.
        </p>
      </main>
    )
  }

  const building = buildingFor(lift)
  const openDefects = openDefectsFor(state, lift.id)
  const overdueInspection = Boolean(lift.nextDueDate && lift.nextDueDate < state.demoDate)

  const validity = lift.stopUseInForce
    ? { tone: 'text-stop', line: 'Not for use. Stop-use order in force.' }
    : overdueInspection
      ? { tone: 'text-stop', line: 'Inspection overdue.' }
      : {
          tone: 'text-verified',
          line: lift.nextDueDate
            ? `Valid until ${formatDay(lift.nextDueDate)}.`
            : 'Valid. No next inspection scheduled.',
        }

  return (
    <main className="mx-auto max-w-[480px] px-5 py-10">
      <div className="flex items-center gap-3">
        <Logo size={32} variant="reversed" labelled={false} />
        <p className="text-20 font-semibold tracking-wordmark">Interlock</p>
      </div>

      <h1 className="mt-5 text-25 font-semibold">Inspection record</h1>
      <p className="mt-1 font-mono text-17">{inspection.verificationCode}</p>

      <p className={`mt-4 text-20 font-medium ${validity.tone}`}>{validity.line}</p>

      <dl className="mt-5 divide-y divide-rail border-y border-rail">
        <div className="flex justify-between gap-4 py-2">
          <dt className="text-13 font-medium text-slate">Lift</dt>
          <dd className="text-right text-17">
            {lift.label}, {building.name}
          </dd>
        </div>
        <div className="flex justify-between gap-4 py-2">
          <dt className="text-13 font-medium text-slate">Official number</dt>
          <dd className="text-right font-mono text-17">{lift.officialNumber}</dd>
        </div>
        <div className="flex justify-between gap-4 py-2">
          <dt className="text-13 font-medium text-slate">Inspection date</dt>
          <dd className="text-right text-17">
            {formatDay((inspection.completedAt ?? inspection.startedAt).slice(0, 10))}
          </dd>
        </div>
        <div className="flex justify-between gap-4 py-2">
          <dt className="text-13 font-medium text-slate">Inspector</dt>
          <dd className="text-right text-17">{inspection.inspectorName}</dd>
        </div>
        <div className="flex justify-between gap-4 py-2">
          <dt className="text-13 font-medium text-slate">Registration</dt>
          <dd className="text-right text-17">{inspection.inspectorReg}</dd>
        </div>
        <div className="flex justify-between gap-4 py-2">
          <dt className="text-13 font-medium text-slate">Open defects</dt>
          <dd className="text-right text-17">{openDefects.length}</dd>
        </div>
      </dl>

      <p className="mt-4 text-15 text-slate">
        Demonstration record. This register is not a regulatory system.
      </p>
    </main>
  )
}
