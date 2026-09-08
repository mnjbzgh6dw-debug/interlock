/**
 * Portfolio exposure, per brief section 10.10. Owner persona.
 *
 * This is where an inspector's tool becomes a business: whoever in the room is
 * thinking about who pays is thinking about portfolio risk, not checklists. So
 * the obligations are split by who carries them, which is fork three from
 * section 15 made concrete.
 *
 * The figures are live, computed from current state. After the demo's own
 * inspection no Kestrel lift is overdue, and this screen says so rather than
 * repeating the seeded numbers: it is the scoreboard for what the room just
 * watched, so it can never be caught disagreeing with the story.
 *
 * The number attached to the exposure is counts and days, not currency. There is
 * no cost data in this model, and an invented rand figure would be the kind of
 * fake precision that gets picked at instead of the questions that matter.
 */

import { Link } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { LiftTypeIcon } from '../components/LiftTypeIcon'
import { StatusPill } from '../components/StatusPill'
import { personaById } from '../data/personas'
import { complianceFor, countdownLabel, TONE_TEXT } from '../lib/compliance'
import { RESPONSIBILITY_LABEL } from '../lib/defects'
import { daysBetween, formatDay } from '../lib/dates'
import {
  buildingById,
  byUrgency,
  isOverdue,
  openDefectsFor,
  visibleDefects,
} from '../state/selectors'
import { useStore } from '../state/useStore'
import type { ComplianceTone } from '../lib/compliance'

function Figure({
  value,
  label,
  tone,
}: {
  value: string
  label: string
  tone?: ComplianceTone
}) {
  return (
    <div className="rounded-card border border-rail bg-white px-3 py-3">
      <p className={`text-25 font-semibold ${tone ? TONE_TEXT[tone] : ''}`}>{value}</p>
      <p className="text-13 font-medium text-slate">{label}</p>
    </div>
  )
}

export default function Portfolio() {
  const { state } = useStore()
  const persona = personaById.get('owner')!
  const buildingIds = persona.buildingIds ?? []
  const buildings = buildingIds.map((id) => buildingById.get(id)!).filter(Boolean)
  const lifts = state.lifts.filter((lift) => buildingIds.includes(lift.buildingId))

  const open = visibleDefects(state, persona)
    .filter((defect) => defect.status === 'open')
    .sort(byUrgency(state.demoDate))
  const overdue = open.filter((defect) => isOverdue(defect, state.demoDate))
  const outOfService = lifts.filter((lift) => lift.stopUseInForce)
  const overdueInspections = lifts.filter(
    (lift) => lift.nextDueDate && lift.nextDueDate < state.demoDate,
  )
  const oldest = overdue.reduce(
    (worst, defect) => Math.max(worst, Math.abs(daysBetween(state.demoDate, defect.dueDate))),
    0,
  )
  const ownerCarries = open.filter((defect) => defect.responsibility === 'owner')
  const companyCarries = open.filter((defect) => defect.responsibility === 'serviceCompany')

  return (
    <div className="min-h-dvh bg-paper pb-10">
      <AppHeader />
      <main className="mx-auto max-w-[560px] px-4 pt-5">
        <h1 className="text-25 font-semibold">Portfolio exposure</h1>
        <p className="mt-1 text-17">
          {persona.organisation} &middot; {formatDay(state.demoDate)}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Figure
            value={String(outOfService.length)}
            label={outOfService.length === 1 ? 'Lift out of service' : 'Lifts out of service'}
            tone={outOfService.length > 0 ? 'stop' : 'verified'}
          />
          <Figure
            value={String(overdueInspections.length)}
            label={
              overdueInspections.length === 1
                ? 'Inspection overdue'
                : 'Inspections overdue'
            }
            tone={overdueInspections.length > 0 ? 'stop' : 'verified'}
          />
          <Figure
            value={String(open.length)}
            label={open.length === 1 ? 'Open obligation' : 'Open obligations'}
            tone={open.length > 0 ? 'open' : 'verified'}
          />
          <Figure
            value={overdue.length > 0 ? `${oldest} days` : 'None'}
            label="Oldest obligation past its date"
            tone={overdue.length > 0 ? 'stop' : 'verified'}
          />
        </div>

        <p className="mt-3 text-17">
          {open.length === 0
            ? 'Nothing outstanding across the portfolio.'
            : `${overdue.length} of ${open.length} ${
                open.length === 1 ? 'obligation is' : 'obligations are'
              } past their date.`}
        </p>

        {/* Fork three from section 15, made concrete: who carries this. */}
        <section className="mt-7">
          <h2 className="text-20 font-medium">Who carries it</h2>
          <ul className="mt-2 divide-y divide-rail border-y border-rail">
            <li className="flex items-baseline justify-between gap-4 py-2">
              <span className="text-17">{RESPONSIBILITY_LABEL.owner}</span>
              <span className="text-17">
                {ownerCarries.length}{' '}
                <span className="text-slate">
                  {ownerCarries.filter((d) => isOverdue(d, state.demoDate)).length} overdue
                </span>
              </span>
            </li>
            <li className="flex items-baseline justify-between gap-4 py-2">
              <span className="text-17">{RESPONSIBILITY_LABEL.serviceCompany}</span>
              <span className="text-17">
                {companyCarries.length}{' '}
                <span className="text-slate">
                  {companyCarries.filter((d) => isOverdue(d, state.demoDate)).length} overdue
                </span>
              </span>
            </li>
          </ul>
          <p className="mt-2 text-15 text-slate">
            Both sit on this portfolio whoever is doing the work.
          </p>
        </section>

        {buildings.map((building) => (
          <section key={building.id} className="mt-7">
            <h2 className="text-20 font-medium">{building.name}</h2>
            <p className="text-15 text-slate">{building.address}</p>
            <ul className="mt-2 divide-y divide-rail border-y border-rail">
              {lifts
                .filter((lift) => lift.buildingId === building.id)
                .map((lift) => {
                  const clock = complianceFor(lift, state.demoDate)
                  const liftOpen = openDefectsFor(state, lift.id)
                  return (
                    <li key={lift.id}>
                      <Link to={`/lift/${lift.id}`} className="block bg-white px-4 py-3">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className={`text-17 font-medium ${TONE_TEXT[clock.tone]}`}>
                            {clock.label}
                          </span>
                          {lift.stopUseInForce && (
                            <StatusPill tone="stop">Not for use</StatusPill>
                          )}
                        </span>
                        <span className="mt-0.5 flex items-center gap-2 text-17">
                          <LiftTypeIcon type={lift.type} className="text-slate" />
                          {lift.label}
                        </span>
                        <span className="block font-mono text-15">{lift.officialNumber}</span>
                        <span className="block text-15">
                          {liftOpen.length === 0
                            ? 'No open obligations'
                            : `${liftOpen.length} open, ${
                                liftOpen.filter((d) => isOverdue(d, state.demoDate)).length
                              } overdue`}
                        </span>
                      </Link>
                    </li>
                  )
                })}
            </ul>
          </section>
        ))}

        <section className="mt-7">
          <h2 className="text-20 font-medium">Open obligations</h2>
          {open.length === 0 ? (
            <p className="mt-1 text-17">
              Nothing is outstanding. New obligations appear here when a report is issued.
            </p>
          ) : (
            <ul className="mt-2 divide-y divide-rail border-y border-rail">
              {open.map((defect) => {
                const late = isOverdue(defect, state.demoDate)
                const lift = state.lifts.find((entry) => entry.id === defect.liftId)!
                return (
                  <li key={defect.id}>
                    <Link to={`/defect/${defect.id}`} className="block bg-white px-4 py-3">
                      <span className={`text-17 font-medium ${late ? 'text-stop' : 'text-open'}`}>
                        {countdownLabel(state.demoDate, defect.dueDate)}
                      </span>
                      <span className="mt-0.5 block text-17">{defect.description}</span>
                      <span className="block text-15">
                        {lift.label} &middot; due {formatDay(defect.dueDate)}
                      </span>
                      <span className="block text-15 text-slate">
                        {RESPONSIBILITY_LABEL[defect.responsibility]}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
