/**
 * Defect worklist, per brief section 10.9.
 *
 * The closure loop is the differentiator: everyone has seen a digital form,
 * almost nobody demos the obligation being closed by the party who owns it.
 *
 * Scope comes from the selectors, per brief section 6, so this screen cannot
 * widen it. The owner deliberately sees more than the technician: they are
 * liable for the machine whoever is fixing it.
 */

import { Link } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { StatusPill } from '../components/StatusPill'
import { personaById } from '../data/personas'
import { RESPONSIBILITY_LABEL } from '../lib/defects'
import { daysBetween } from '../lib/dates'
import {
  buildingFor,
  byUrgency,
  canClose,
  isOverdue,
  liftById,
  responsiblePartyName,
  visibleDefects,
} from '../state/selectors'
import { useStore } from '../state/useStore'
import type { Defect } from '../types'

function DefectRow({ defect, demoDate }: { defect: Defect; demoDate: string }) {
  const { state } = useStore()
  const lift = liftById(state, defect.liftId)!
  const overdue = isOverdue(defect, demoDate)
  const days = daysBetween(demoDate, defect.dueDate)

  return (
    <li>
      <Link to={`/defect/${defect.id}`} className="flex items-center gap-3 bg-white px-4 py-3">
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            {defect.status === 'closed' ? (
              <span className="text-17 font-medium text-verified">Closed</span>
            ) : overdue ? (
              <span className="text-17 font-medium text-stop">
                {Math.abs(days)} days overdue
              </span>
            ) : (
              <span className="text-17 font-medium text-open">
                {days === 0 ? 'Due today' : `Due in ${days} days`}
              </span>
            )}
            {defect.severity === 'immediate' && defect.status === 'open' && (
              <StatusPill tone="stop">Not for use</StatusPill>
            )}
          </span>
          <span className="mt-0.5 block text-17">{defect.description}</span>
          <span className="block text-15">
            {lift.label}, {buildingFor(lift).name}
          </span>
          <span className="block text-15 text-slate">
            {RESPONSIBILITY_LABEL[defect.responsibility]} &middot;{' '}
            {responsiblePartyName(state, defect)}
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
}

export default function Worklist() {
  const { state } = useStore()
  const persona = personaById.get(state.persona)!
  const mine = visibleDefects(state, persona)
  const open = mine.filter((d) => d.status === 'open').sort(byUrgency(state.demoDate))
  const closed = mine
    .filter((d) => d.status === 'closed')
    .sort((a, b) => (b.closedAt ?? '').localeCompare(a.closedAt ?? ''))
  const overdue = open.filter((d) => isOverdue(d, state.demoDate))
  const closable = open.filter((d) => canClose(d, persona))

  return (
    <div className="min-h-dvh bg-paper pb-10">
      <AppHeader />
      <main className="mx-auto max-w-[560px] px-4 pt-5">
        <h1 className="text-25 font-semibold">Defect worklist</h1>
        <p className="mt-1 text-17">
          {persona.name}, {persona.organisation}
        </p>

        {open.length === 0 ? (
          <p className="mt-6 text-17">
            Nothing is outstanding. New defects arrive here when an inspection is submitted.
          </p>
        ) : (
          <>
            <p className="mt-3 text-17">
              {open.length} open
              {overdue.length > 0 && (
                <>
                  , <span className="font-medium text-stop">{overdue.length} overdue</span>
                </>
              )}
              {closable.length !== open.length && (
                <span className="text-slate">
                  {' '}
                  &middot; {closable.length} assigned to you
                </span>
              )}
            </p>

            <ul className="mt-4 divide-y divide-rail border-y border-rail">
              {open.map((defect) => (
                <DefectRow key={defect.id} defect={defect} demoDate={state.demoDate} />
              ))}
            </ul>
          </>
        )}

        {closed.length > 0 && (
          <section className="mt-8">
            <h2 className="text-20 font-medium">Closed</h2>
            <ul className="mt-2 divide-y divide-rail border-y border-rail">
              {closed.map((defect) => (
                <DefectRow key={defect.id} defect={defect} demoDate={state.demoDate} />
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  )
}
