/**
 * Lift register, the landing screen. Brief section 10.1.
 *
 * Grouped by building, dense bordered rows rather than cards, and the
 * compliance clock leads every row. Deliberately no summary tiles at the top:
 * the brief is explicit that the clock is the hero, not a dashboard.
 */

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { LiftTypeIcon } from '../components/LiftTypeIcon'
import { StatusPill } from '../components/StatusPill'
import { complianceFor, LIFT_TYPE_LABEL, TONE_TEXT } from '../lib/compliance'
import { liftsByBuilding } from '../state/selectors'
import { useStore } from '../state/useStore'
import { ANCHOR, tourAnchor } from '../tour/anchors'
import type { Building, Lift } from '../types'

function matches(lift: Lift, building: Building, query: string): boolean {
  if (!query) return true
  const q = query.trim().toLowerCase()
  return (
    building.name.toLowerCase().includes(q) ||
    lift.officialNumber.toLowerCase().includes(q) ||
    lift.label.toLowerCase().includes(q)
  )
}

function LiftRow({ lift, demoDate }: { lift: Lift; demoDate: string }) {
  const clock = complianceFor(lift, demoDate)
  return (
    <li {...tourAnchor(ANCHOR.registerRow(lift.id))}>
      <Link
        to={`/lift/${lift.id}`}
        className={`flex items-center gap-3 bg-white px-4 py-3 ${
          lift.stopUseInForce ? 'border-l-4 border-l-stop pl-3' : ''
        }`}
      >
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span
              {...tourAnchor(ANCHOR.registerClock(lift.id))}
              className={`text-17 font-medium ${TONE_TEXT[clock.tone]}`}
            >
              {clock.label}
            </span>
            {lift.stopUseInForce && <StatusPill tone="stop">Not for use</StatusPill>}
          </span>
          <span className="mt-0.5 flex items-center gap-2 text-17">
            <LiftTypeIcon type={lift.type} className="text-slate" />
            {lift.label}
            {/* 'Goods Lift' is already painted on the door; don't say it twice. */}
            {lift.label.toLowerCase() !== LIFT_TYPE_LABEL[lift.type].toLowerCase() && (
              <span className="text-slate">{LIFT_TYPE_LABEL[lift.type]}</span>
            )}
          </span>
          <span className="block font-mono text-15">{lift.officialNumber}</span>
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

export default function Register() {
  const { state } = useStore()
  const [query, setQuery] = useState('')

  const groups = useMemo(
    () =>
      liftsByBuilding(state)
        .map(({ building, lifts }) => ({
          building,
          lifts: lifts.filter((lift) => matches(lift, building, query)),
        }))
        .filter((group) => group.lifts.length > 0),
    [state, query],
  )

  const total = groups.reduce((n, g) => n + g.lifts.length, 0)

  return (
    <div className="min-h-dvh bg-paper">
      <AppHeader />
      <main className="mx-auto max-w-[560px] px-4 pb-10 pt-5">
        <h1 className="text-25 font-semibold">Lift register</h1>

        <label className="mt-4 block">
          <span className="text-13 font-medium text-slate">Search</span>
          <input
            {...tourAnchor(ANCHOR.registerSearch)}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Building name or official number"
            enterKeyHint="search"
            autoComplete="off"
            className="mt-1 h-tap w-full rounded-card border border-rail bg-white px-3 text-17 placeholder:text-slate"
          />
        </label>

        {total === 0 ? (
          <p className="mt-6 text-17">
            No lifts match that search. Try a building name, a lift label, or an official
            number.
          </p>
        ) : (
          groups.map(({ building, lifts }) => (
            <section
              key={building.id}
              {...tourAnchor(ANCHOR.registerBuilding(building.id))}
              className="mt-7"
            >
              <h2 className="text-20 font-medium">{building.name}</h2>
              <p className="text-15 text-slate">{building.address}</p>
              <ul className="mt-2 divide-y divide-rail border-y border-rail">
                {lifts.map((lift) => (
                  <LiftRow key={lift.id} lift={lift} demoDate={state.demoDate} />
                ))}
              </ul>
            </section>
          ))
        )}
      </main>
    </div>
  )
}
