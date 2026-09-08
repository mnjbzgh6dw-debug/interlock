/**
 * Lift detail. Brief section 10.2: full identity block, inspection history with
 * verification codes, open and closed defects, and Start inspection as the
 * primary action in a fixed bottom bar. QR entry lands here at item 18.
 */

import { Link, useParams } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { LiftTypeIcon } from '../components/LiftTypeIcon'
import { StatusPill } from '../components/StatusPill'
import {
  complianceFor,
  LIFT_TYPE_LABEL,
  scopeStatementFor,
  TONE_TEXT,
} from '../lib/compliance'
import { formatDay } from '../lib/dates'
import {
  buildingFor,
  defectsFor,
  failedItemIds,
  inspectionsFor,
  isOverdue,
  liftById,
  responsiblePartyName,
  serviceCompanyFor,
} from '../state/selectors'
import { useStore } from '../state/useStore'
import type { Defect, Lift } from '../types'

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <dt className="text-13 font-medium text-slate">{label}</dt>
      <dd className={`text-right text-17 ${mono ? 'font-mono' : ''}`}>{value}</dd>
    </div>
  )
}

function DefectRow({ defect, demoDate, party }: { defect: Defect; demoDate: string; party: string }) {
  const overdue = isOverdue(defect, demoDate)
  return (
    <li className="py-3">
      <p className="text-17">{defect.description}</p>
      <p className="mt-0.5 text-15">
        {party} &middot; due {formatDay(defect.dueDate)}
      </p>
      <p className="mt-1">
        {defect.status === 'closed' ? (
          <StatusPill tone="verified">Closed</StatusPill>
        ) : overdue ? (
          <StatusPill tone="stop">Overdue</StatusPill>
        ) : (
          <StatusPill tone="open">Open</StatusPill>
        )}
      </p>
    </li>
  )
}

function IdentityBlock({ lift }: { lift: Lift }) {
  const building = buildingFor(lift)
  const company = serviceCompanyFor(lift)
  return (
    <dl className="mt-4 divide-y divide-rail rounded-card border border-rail bg-white px-4">
      <Field label="Official number" value={lift.officialNumber} mono />
      <Field label="Type" value={LIFT_TYPE_LABEL[lift.type]} />
      <Field label="Floors served" value={String(lift.floorsServed)} />
      <Field
        label="Rated load"
        value={lift.ratedLoadKg === null ? 'Not applicable' : `${lift.ratedLoadKg} kg`}
      />
      <Field
        label="Rated speed"
        value={lift.ratedSpeedMs === null ? 'Not applicable' : `${lift.ratedSpeedMs.toFixed(1)} m/s`}
      />
      <Field label="Drive" value={lift.driveType} />
      <Field label="Installed" value={formatDay(lift.installedDate)} />
      <Field label="Manufacturer" value={lift.oem} />
      <Field label="Maintained by" value={company.name} />
      <Field label="Building" value={building.name} />
      <Field label="Address" value={building.address} />
      <Field label="Owner" value={building.ownerEntity} />
      <Field
        label="Last report"
        value={lift.lastReportDate ? formatDay(lift.lastReportDate) : 'None on record'}
      />
      <Field
        label="Next due"
        value={lift.nextDueDate ? formatDay(lift.nextDueDate) : 'Not scheduled'}
      />
    </dl>
  )
}

export default function LiftDetail() {
  const { liftId } = useParams()
  const { state } = useStore()
  const lift = liftId ? liftById(state, liftId) : undefined

  if (!lift) {
    return (
      <div className="min-h-dvh bg-paper">
        <AppHeader />
        <main className="mx-auto max-w-[560px] px-4 pt-5">
          <h1 className="text-25 font-semibold">Lift not found</h1>
          <p className="mt-2 text-17">
            That lift is not on this register.{' '}
            <Link to="/" className="text-signal underline">
              Open the register
            </Link>
            .
          </p>
        </main>
      </div>
    )
  }

  const clock = complianceFor(lift, state.demoDate)
  const history = inspectionsFor(state, lift.id)
  const defects = defectsFor(state, lift.id)
  const open = defects.filter((d) => d.status === 'open')
  const closed = defects.filter((d) => d.status === 'closed')

  return (
    <div className="min-h-dvh bg-paper pb-24">
      <AppHeader />
      <main className="mx-auto max-w-[560px] px-4 pt-5">
        <Link to="/" className="inline-flex items-center gap-1 text-15 text-signal">
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
          Register
        </Link>

        <h1 className="mt-2 flex items-center gap-2 text-25 font-semibold">
          <LiftTypeIcon type={lift.type} className="text-slate" />
          {lift.label}
        </h1>
        <p className="text-17 text-slate">{buildingFor(lift).name}</p>

        <p className={`mt-3 text-20 font-medium ${TONE_TEXT[clock.tone]}`}>{clock.label}</p>

        {lift.stopUseInForce && (
          <p className="mt-3 rounded-card border border-stop bg-stop-tint p-3 text-17 text-stop">
            This lift is under a stop-use order. No person may be conveyed until the defect is
            rectified.
          </p>
        )}

        <IdentityBlock lift={lift} />

        <section className="mt-7">
          <h2 className="text-20 font-medium">
            Open defects{open.length > 0 ? ` (${open.length})` : ''}
          </h2>
          {open.length === 0 ? (
            <p className="mt-1 text-17">No open defects on this lift.</p>
          ) : (
            <ul className="mt-2 divide-y divide-rail border-y border-rail">
              {open.map((defect) => (
                <DefectRow
                  key={defect.id}
                  defect={defect}
                  demoDate={state.demoDate}
                  party={responsiblePartyName(state, defect)}
                />
              ))}
            </ul>
          )}
        </section>

        {closed.length > 0 && (
          <section className="mt-7">
            <h2 className="text-20 font-medium">Closed defects ({closed.length})</h2>
            <ul className="mt-2 divide-y divide-rail border-y border-rail">
              {closed.map((defect) => (
                <DefectRow
                  key={defect.id}
                  defect={defect}
                  demoDate={state.demoDate}
                  party={responsiblePartyName(state, defect)}
                />
              ))}
            </ul>
          </section>
        )}

        <section className="mt-7">
          <h2 className="text-20 font-medium">Inspection history</h2>
          {history.length === 0 ? (
            <p className="mt-1 text-17">
              This lift has never been inspected. Start the first inspection below.
            </p>
          ) : (
            <ul className="mt-2 divide-y divide-rail border-y border-rail">
              {history.map((inspection) => {
                const fails = failedItemIds(inspection).length
                return (
                  <li key={inspection.id} className="py-3">
                    <p className="text-17">{formatDay(inspection.startedAt.slice(0, 10))}</p>
                    <p className="text-15">
                      {inspection.inspectorName} &middot; {inspection.inspectorReg}
                    </p>
                    <p className="font-mono text-15">{inspection.verificationCode}</p>
                    <p className="text-15 text-slate">
                      {fails === 0
                        ? 'No defects recorded'
                        : `${fails} ${fails === 1 ? 'defect' : 'defects'} recorded`}
                    </p>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-rail bg-white">
        <div className="mx-auto max-w-[560px] px-4 py-3">
          {lift.formId === null ? (
            <p className="text-17">{scopeStatementFor(lift)}</p>
          ) : (
            <>
              <button
                type="button"
                disabled
                className="h-tap w-full rounded-card bg-signal text-17 font-medium text-white disabled:bg-rail disabled:text-slate"
              >
                Start inspection
              </button>
              <p className="mt-1 text-13 text-slate">Scaffolding: the form arrives at item 6.</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
