/**
 * Temporary. A read-out of seeded state so item 3 can be checked against the
 * brief's tables without a UI to click through yet. Goes when the register
 * lands at item 4.
 */

import { useStore } from './state/useStore'
import {
  buildingFor,
  defectsFor,
  failedItemIds,
  inspectionsFor,
  isOverdue,
  liftsByBuilding,
  responsiblePartyName,
  serviceCompanyFor,
  visibleDefects,
} from './state/selectors'
import { personas } from './data/personas'
import { daysBetween, formatDay } from './lib/dates'
import { formPassengerA } from './data/form-passenger-a'

function Label({ children }: { children: string }) {
  return <p className="text-13 font-medium text-slate">{children}</p>
}

export default function DataCheck() {
  const { state, setPersona, setDemoDate, resetDemoData } = useStore()
  const groups = liftsByBuilding(state)

  return (
    <section className="mt-8">
      <h2 className="text-20 font-medium">Data check</h2>
      <p className="mt-1 text-15 text-slate">
        Seeded state, read through the selectors. Replaced at item 4.
      </p>

      {state.storageFull && (
        <p className="mt-3 rounded-card border border-stop bg-stop-tint p-3 text-15 text-stop">
          Storage full. This session won&rsquo;t survive a refresh.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {personas.map((p) => (
          <button
            key={p.id}
            onClick={() => setPersona(p.id)}
            className={`rounded-card border px-3 text-15 ${
              state.persona === p.id
                ? 'border-signal bg-signal text-white'
                : 'border-rail bg-white'
            }`}
          >
            {p.role}
          </button>
        ))}
        <button
          onClick={() => setDemoDate('2026-10-09')}
          className="rounded-card border border-rail bg-white px-3 text-15"
        >
          Day 31
        </button>
        <button
          onClick={() => setDemoDate('2026-09-08')}
          className="rounded-card border border-rail bg-white px-3 text-15"
        >
          Day 0
        </button>
        <button
          onClick={resetDemoData}
          className="rounded-card border border-rail bg-white px-3 text-15"
        >
          Reset demo data
        </button>
      </div>

      <p className="mt-3 text-15">
        Demo date {formatDay(state.demoDate)} &middot; {state.lifts.length} lifts &middot;{' '}
        {state.inspections.length} inspections &middot; {state.defects.length} defects &middot;{' '}
        {formPassengerA.sections.reduce((n, s) => n + s.items.length, 0)} form items
      </p>

      {groups.map(({ building, lifts }) => (
        <div key={building.id} className="mt-6">
          <Label>{building.name}</Label>
          <ul className="mt-2 divide-y divide-rail border-y border-rail">
            {lifts.map((lift) => {
              const due = lift.nextDueDate
              const days = due ? daysBetween(state.demoDate, due) : null
              const history = inspectionsFor(state, lift.id)
              const defects = defectsFor(state, lift.id)
              return (
                <li key={lift.id} className="py-2">
                  <p className="text-17">
                    {lift.label} &middot; {lift.type}
                  </p>
                  <p className="font-mono text-15">{lift.officialNumber}</p>
                  <p className="text-15">
                    {days === null
                      ? 'Never inspected'
                      : days < 0
                        ? `${Math.abs(days)} days overdue`
                        : `Due in ${days} days`}{' '}
                    &middot; {serviceCompanyFor(lift).name} &middot;{' '}
                    {lift.formId ?? 'no form loaded'}
                  </p>
                  <p className="text-15 text-slate">
                    {history.length} inspections
                    {history[0] ? `, latest ${history[0].verificationCode}` : ''} &middot;{' '}
                    {defects.length} defect records
                  </p>
                </li>
              )
            })}
          </ul>
        </div>
      ))}

      <div className="mt-6">
        <Label>Defects</Label>
        <ul className="mt-2 divide-y divide-rail border-y border-rail">
          {state.defects.map((d) => (
            <li key={d.id} className="py-2">
              <p className="text-17">
                {d.id} &middot; {d.description}
              </p>
              <p className="text-15">
                {d.severity} &middot; {responsiblePartyName(state, d)} &middot; raised{' '}
                {formatDay(d.raisedDate)} &middot; due {formatDay(d.dueDate)}
              </p>
              <p
                className={`text-15 ${
                  isOverdue(d, state.demoDate)
                    ? 'text-stop'
                    : d.status === 'closed'
                      ? 'text-verified'
                      : 'text-open'
                }`}
              >
                {d.status === 'closed'
                  ? `Closed by ${d.closedBy}`
                  : isOverdue(d, state.demoDate)
                    ? `Open, ${Math.abs(daysBetween(state.demoDate, d.dueDate))} days overdue`
                    : 'Open, on time'}
              </p>
              <div className="mt-1 flex gap-2">
                {d.raisedPhoto && (
                  <img
                    src={d.raisedPhoto}
                    alt="Raised photo"
                    className="h-16 w-24 rounded border border-rail object-cover"
                  />
                )}
                {d.evidencePhoto && (
                  <img
                    src={d.evidencePhoto}
                    alt="Evidence photo"
                    className="h-16 w-24 rounded border border-rail object-cover"
                  />
                )}
                {d.closureSignature && (
                  <img
                    src={d.closureSignature}
                    alt="Closure signature"
                    className="h-16 rounded border border-rail bg-white p-1"
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <Label>Persona scope, live</Label>
        <ul className="mt-2 divide-y divide-rail border-y border-rail">
          {personas.map((p) => (
            <li key={p.id} className="py-2 text-15">
              {p.role}, {p.name}: sees {visibleDefects(state, p).length} of{' '}
              {state.defects.length} defects
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <Label>Report defect counts, derived from responses</Label>
        <ul className="mt-2 divide-y divide-rail border-y border-rail">
          {state.inspections
            .filter((i) => failedItemIds(i).length > 0)
            .map((i) => (
              <li key={i.id} className="py-2 text-15">
                {i.verificationCode} &middot; {formatDay(i.startedAt.slice(0, 10))} &middot;{' '}
                {i.inspectorName} &middot; {failedItemIds(i).length} defects (
                {failedItemIds(i).join(', ')})
              </li>
            ))}
        </ul>
      </div>

      <div className="mt-6">
        <Label>Inspector signature, seeded asset</Label>
        <div className="mt-2 rounded-card border border-rail bg-white p-2">
          <img
            src={state.inspections[0]?.finalSignature ?? ''}
            alt="Inspector signature"
            className="h-16"
          />
          <p className="text-13 text-slate">
            {buildingFor(state.lifts[0]).ownerEntity}
          </p>
        </div>
      </div>
    </section>
  )
}
