/**
 * Demo controls, per brief section 12.
 *
 * Slide-over, always reachable, and deliberately not styled like the app: dark
 * ground, mono labels, no status colours except where it is reporting one. It
 * has to be obvious that this panel is the operator's, not the product's.
 */

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { formPassengerA } from '../data/form-passenger-a'
import { personas } from '../data/personas'
import { formatDay } from '../lib/dates'
import { scenarios } from '../lib/scenarios'
import { useStore } from '../state/useStore'
import type { ResponseEntry } from '../types'
import { SyncIndicator } from './SyncIndicator'
import { tours, toursByKind } from '../tour/tours'
import { useTourControl } from '../tour/useTour'
import { ANCHOR, tourAnchor } from '../tour/anchors'

/** Plausible in-range readings, so a filled form prints real measurements. */
const FILLED_MEASUREMENTS: Record<string, string> = {
  A2: '24',
  B3: '18',
  B7: '4',
  C2: '118',
  E1: '1',
  E2: '12.9',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-white/20 px-4 py-4">
      <h3 className="font-mono text-13 text-white/70">{title}</h3>
      <div className="mt-2">{children}</div>
    </section>
  )
}

function PanelButton({
  onClick,
  children,
  selected,
}: {
  onClick: () => void
  children: React.ReactNode
  selected?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`h-tap w-full rounded-card border px-3 text-left text-17 ${
        selected ? 'border-white bg-white text-shaft' : 'border-white/40 text-white'
      }`}
    >
      {children}
    </button>
  )
}

/**
 * The report and the sticker sheet are the two surfaces whose whole job is to
 * not look like an app. A floating operator pill in the corner of the
 * certificate is the most app-like thing in that frame, and the certificate beat
 * is the one that has to land as paper. The panel is one tap away again as soon
 * as you navigate off them.
 */
const PRINT_SURFACES = [/\/report$/, /\/addendum$/, /^\/stickers$/]

const TOUR_GROUPS = [
  { kind: 'comprehensive' as const, title: 'the whole story' },
  { kind: 'persona' as const, title: 'by role' },
  { kind: 'workflow' as const, title: 'by workflow' },
]

export function DemoControls() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const tour = useTourControl()
  const [open, setOpen] = useState(false)
  const {
    state,
    offline,
    setPersona,
    setDemoDate,
    setConnection,
    saveInspection,
    loadScenario,
    resetDemoData,
  } = useStore()

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const inProgress = state.inspections.find((i) => i.completedAt === null)
  const unanswered = inProgress
    ? formPassengerA.sections
        .flatMap((section) => section.items)
        .filter((item) => !inProgress.responses[item.id])
    : []

  /** Brief section 12: sign off a complete certificate after touching a few items. */
  function fillRemainingAsPass() {
    if (!inProgress) return
    const responses = { ...inProgress.responses }
    for (const item of unanswered) {
      const entry: ResponseEntry = { result: 'pass' }
      if (item.responseType === 'measurement') entry.value = FILLED_MEASUREMENTS[item.id]
      if (item.responseType === 'dateCheck') entry.value = 'Certificate seen, within interval'
      responses[item.id] = entry
    }
    saveInspection({ ...inProgress, responses })
  }

  if (PRINT_SURFACES.some((pattern) => pattern.test(pathname))) return null

  return (
    <>
      {/* Always reachable, and clearly not part of the app. */}
      <div className="no-print fixed bottom-24 right-3 z-40 flex flex-col items-end gap-2">
        <div {...tourAnchor(ANCHOR.syncIndicator)}>
          <SyncIndicator />
        </div>
        <button
          type="button"
          {...tourAnchor(ANCHOR.demoPill)}
          onClick={() => setOpen(true)}
          className="h-tap rounded-full border border-white/30 bg-shaft px-3 font-mono text-13 text-white"
        >
          Demo
        </button>
      </div>

      {open && (
        <div className="no-print fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close demo controls"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-shaft/50"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Demo controls"
            className="relative flex w-full max-w-[380px] flex-col overflow-y-auto bg-shaft text-white"
          >
            <div className="flex items-center justify-between px-4 py-4">
              <h2 className="font-mono text-17">Demo controls</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-tap px-2 text-17 underline"
              >
                Close
              </button>
            </div>

            <Section title="persona">
              <div className="grid gap-2">
                {personas.map((persona) => (
                  <PanelButton
                    key={persona.id}
                    selected={state.persona === persona.id}
                    onClick={() => setPersona(persona.id)}
                  >
                    {persona.role}
                    <span className="block text-13 opacity-80">
                      {persona.name}, {persona.organisation}
                    </span>
                  </PanelButton>
                ))}
              </div>
            </Section>

            <Section title="demo date">
              <input
                type="date"
                value={state.demoDate}
                onChange={(event) => event.target.value && setDemoDate(event.target.value)}
                className="h-tap w-full rounded-card border border-white/40 bg-shaft px-3 text-17 text-white"
              />
              <p className="mt-1 text-15 text-white/70">{formatDay(state.demoDate)}</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[
                  { label: 'Day 0', days: 0 },
                  { label: 'Day 31', days: 31 },
                  { label: 'Day 45', days: 45 },
                ].map((jump) => (
                  <button
                    key={jump.label}
                    type="button"
                    onClick={() => {
                      const from = new Date('2026-09-08T00:00:00Z')
                      from.setUTCDate(from.getUTCDate() + jump.days)
                      setDemoDate(from.toISOString().slice(0, 10))
                    }}
                    className="h-tap rounded-card border border-white/40 text-15"
                  >
                    {jump.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-13 text-white/70">
                Overdue states and reminder histories are computed from this date.
              </p>
            </Section>

            <Section title="connection">
              <div className="grid grid-cols-2 gap-2">
                <PanelButton
                  selected={state.connection === 'online'}
                  onClick={() => setConnection('online')}
                >
                  Online
                </PanelButton>
                <PanelButton
                  selected={state.connection === 'offline'}
                  onClick={() => setConnection('offline')}
                >
                  Offline
                </PanelButton>
              </div>
              <p className="mt-2 text-13 text-white/70">
                {offline
                  ? `Writes are held in this window. ${state.queuedWrites} queued.`
                  : 'Writes push to other windows in this browser.'}
              </p>
              <p className="mt-1 text-13 text-white/70">
                Real airplane mode works too: the push is gated on navigator.onLine, which is
                currently {state.networkOnline ? 'online' : 'offline'}.
              </p>
            </Section>

            <Section title="inspection in progress">
              {inProgress ? (
                <>
                  <PanelButton onClick={fillRemainingAsPass}>
                    Fill remaining as pass
                    <span className="block text-13 opacity-80">
                      {unanswered.length} unanswered
                    </span>
                  </PanelButton>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false)
                      navigate(`/lift/${inProgress.liftId}/inspection`)
                    }}
                    className="mt-2 h-tap px-1 text-17 underline"
                  >
                    Open the form
                  </button>
                </>
              ) : (
                <p className="text-15 text-white/70">
                  No inspection in progress. Start one from a lift.
                </p>
              )}
            </Section>

            <Section title="guided walkthrough">
              <p className="mb-2 text-13 text-white/70">
                Each one drives the app itself. You only press Next.
              </p>
              {TOUR_GROUPS.filter((group) => toursByKind(group.kind).length > 0).map((group) => (
                <div key={group.kind} className="mb-3">
                  <p className="font-mono text-13 text-white/50">{group.title}</p>
                  <div className="mt-1 grid gap-2">
                    {toursByKind(group.kind).map((entry) => (
                      <PanelButton
                        key={entry.id}
                        onClick={() => {
                          setOpen(false)
                          tour.start(entry.id)
                        }}
                      >
                        {entry.label}
                        <span className="block text-13 opacity-80">{entry.blurb}</span>
                      </PanelButton>
                    ))}
                  </div>
                </div>
              ))}
              <p className="text-13 text-white/70">
                {tours.length} available. A link ending in ?tour={tours[0]?.id ?? 'register'}{' '}
                opens straight into one, which is how to point someone at it without changing
                the app.
              </p>
            </Section>

            <Section title="jump to state">
              <div className="grid gap-2">
                {scenarios.map((scenario) => (
                  <PanelButton
                    key={scenario.id}
                    onClick={() => {
                      const next = scenario.build()
                      loadScenario(next)
                      setOpen(false)
                      navigate(scenario.path(next))
                    }}
                  >
                    {scenario.label}
                  </PanelButton>
                ))}
              </div>
            </Section>

            <Section title="reset">
              <PanelButton
                onClick={() => {
                  resetDemoData()
                  setOpen(false)
                  navigate('/')
                }}
              >
                Reset demo data
              </PanelButton>
              {state.storageFull && (
                <p className="mt-2 text-15 text-open">
                  Storage full. This session won&rsquo;t survive a refresh.
                </p>
              )}
            </Section>
          </div>
        </div>
      )}
    </>
  )
}
