/**
 * The engine. One effect, one linear script per step, guarded three ways.
 *
 * Every step declares the state, persona and route it needs, and this puts the
 * app there before showing anything. The viewer only presses Next and Back.
 */

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import type { PersonaId } from '../types'
import { useStore } from '../state/useStore'
import { persistedOf } from '../state/context'
import { TourControlContext, TourRunContext } from './context'
import { revealAnchor, waitForAnchor } from './spotlight'
import { performAct } from './act'
import { clearSnapshot, writeSnapshot, type TourSnapshot } from './snapshot'
import { tourById } from './tours'
import type { TourControl, TourRun } from './types'

const clamp = (value: number, low: number, high: number) =>
  Math.max(low, Math.min(high, value))

export function TourProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const store = useStore()
  const [run, setRun] = useState<TourRun>(null)

  /** Latest store and run, so callbacks keep a stable identity. */
  const storeRef = useRef(store)
  storeRef.current = store
  /**
   * useNavigate returns a fresh function identity on each render. Left in the
   * effect's dependencies it restarted the whole step script every time the
   * phase changed, which killed the in-flight scroll and left the hole
   * measured over an element still below the fold.
   */
  const navigateRef = useRef(navigate)
  navigateRef.current = navigate
  const runRef = useRef(run)
  runRef.current = run

  /**
   * What has actually been applied. Never reset in a cleanup: StrictMode's
   * simulated unmount runs cleanups before the real mount, and writing
   * bookkeeping in one is exactly the bug that destroyed the saved form
   * position, working in production and failing in development.
   */
  const applied = useRef({ runId: 0, preconditionKey: '', persona: '' as PersonaId | '', actKey: '' })
  /** Bumped on every effect entry. Async continuations abort when it moves. */
  const token = useRef(0)
  const snapshot = useRef<TourSnapshot | null>(null)

  const base = import.meta.env.BASE_URL.replace(/\/$/, '')

  useEffect(() => {
    if (!run) return
    const step = run.tour.steps[run.index]
    if (!step) return

    const mine = (token.current += 1)
    const alive = () => token.current === mine
    const timers: number[] = []
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms))
      })
    const io = { alive, sleep }

    async function prepare() {
      const api = storeRef.current

      /**
       * State, persona and route in one synchronous block, in this order.
       *
       * React batches them into a single commit, so the route change and the
       * persona change land together and no persona gate can send a Navigate
       * against the route the tour has just asked for. This is the same order
       * the demo panel's jump-to-state uses, and the order the form's redirect
       * guard was written to survive. Splitting them across ticks would open
       * exactly the window that guard exists to close.
       */
      if (applied.current.preconditionKey !== step.precondition.key) {
        const next = step.precondition.build()
        api.loadScenario(next)
        applied.current.preconditionKey = step.precondition.key
        applied.current.persona = next.persona
      }
      if (applied.current.persona !== step.persona) {
        api.setPersona(step.persona)
        applied.current.persona = step.persona
      }
      if (step.precondition.demoDate) api.setDemoDate(step.precondition.demoDate)
      if (step.precondition.connection) api.setConnection(step.precondition.connection)
      if (window.location.pathname !== base + step.route) {
        // Replace, never push: a long tour must not fill the back stack.
        navigateRef.current(step.route, { replace: true })
      }

      const wanted = step.waitFor ?? step.anchor
      const element = wanted ? await waitForAnchor(wanted, io) : null
      if (!alive()) return
      if (wanted && !element) {
        console.warn(
          `[tour] ${run!.tour.id} step ${run!.index} (${step.id}): anchor "${wanted}" never appeared`,
        )
        setRun((current) => (current ? { ...current, phase: 'stuck' } : current))
        return
      }

      if (element) {
        setRun((current) => (current ? { ...current, phase: 'settling' } : current))
        await revealAnchor(element, io)
        if (!alive()) return
      }

      /**
       * Fire the real control, at most once per run, tour and step. The result
       * choices toggle, so a second click would undo the first. Set before the
       * first await, because under StrictMode the body runs twice.
       */
      const actKey = `${applied.current.runId}:${run!.tour.id}:${run!.index}`
      if (step.act && applied.current.actKey !== actKey) {
        applied.current.actKey = actKey
        await performAct(step.act, io)
        if (!alive()) return
        await sleep(80)
        if (!alive()) return
        if (step.expect && !step.expect(storeRef.current.state)) {
          console.warn(
            `[tour] ${run!.tour.id} step ${run!.index} (${step.id}): expectation failed after act`,
          )
          setRun((current) => (current ? { ...current, phase: 'stuck' } : current))
          return
        }
        // An act can open an overlay, so re-resolve against the new DOM.
        if (step.anchor) {
          const after = await waitForAnchor(step.anchor, io, 1500)
          if (!alive()) return
          if (after) await revealAnchor(after, io)
          if (!alive()) return
        }
      }

      setRun((current) => (current ? { ...current, phase: 'ready' } : current))
    }

    void prepare()
    // Timers only. Nothing here may touch `applied`.
    return () => timers.forEach((id) => clearTimeout(id))
    // Deliberately not `run` itself and never `run.phase`: the script reads the
    // store and the navigator through refs, so neither a write it causes nor
    // its own phase update can restart it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run?.tour.id, run?.index])

  const control = useMemo<TourControl>(() => {
    function stop(restore: boolean) {
      const shot = snapshot.current
      token.current += 1
      setRun(null)
      snapshot.current = null
      clearSnapshot()
      if (!restore || !shot) return
      const api = storeRef.current
      // Persona and demo date travel inside the persisted slice.
      api.loadScenario(shot.persisted)
      api.setConnection(shot.connection)
      navigateRef.current(shot.href.replace(base, '') || '/', { replace: true })
    }

    return {
      start(tourId, atStep = 0) {
        const tour = tourById.get(tourId)
        if (!tour || runRef.current) return
        const state = storeRef.current.state
        const shot: TourSnapshot = {
          persisted: structuredClone(persistedOf(state)),
          connection: state.connection,
          href: window.location.pathname + window.location.search,
        }
        snapshot.current = shot
        writeSnapshot(shot)
        applied.current = {
          runId: applied.current.runId + 1,
          preconditionKey: '',
          persona: '',
          actKey: '',
        }
        setRun({ tour, index: clamp(atStep, 0, tour.steps.length - 1), phase: 'preparing' })
      },
      exit() {
        stop(true)
      },
      next() {
        const current = runRef.current
        if (!current) return
        if (current.index >= current.tour.steps.length - 1) {
          stop(true)
          return
        }
        setRun({ ...current, index: current.index + 1, phase: 'preparing' })
      },
      back() {
        const current = runRef.current
        if (!current || current.index === 0) return
        /**
         * Going back re-applies the previous step's precondition, because the
         * step just left may have changed state. Clearing the applied key is
         * what forces that.
         */
        applied.current.preconditionKey = ''
        setRun({ ...current, index: current.index - 1, phase: 'preparing' })
      },
    }
    // Stable for the life of the app: everything it touches is behind a ref, so
    // the demo panel never re-renders as steps advance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * `?tour=<id>` so a shared link opens straight into a tour, which is the only
   * way to point the audience at one without putting an affordance in the
   * product. Never starts without the parameter: that is what keeps this out of
   * the onboarding non-goal.
   */
  const consumedLink = useRef(false)
  useEffect(() => {
    if (consumedLink.current) return
    consumedLink.current = true

    // Read location directly: this provider sits above the routes, and an
    // effect keyed on useSearchParams would re-fire when ?print=1 appears.
    const params = new URLSearchParams(window.location.search)
    const id = params.get('tour')
    if (!id || !tourById.has(id)) return
    const step = Number(params.get('step') ?? 0)

    params.delete('tour')
    params.delete('step')
    const query = params.toString()
    // replaceState, not navigate: no re-render, and a refresh mid-tour does not
    // restart the tour from step one.
    window.history.replaceState(
      null,
      '',
      window.location.pathname + (query ? `?${query}` : ''),
    )
    control.start(id, Number.isFinite(step) ? step : 0)
  }, [control])

  const runValue = useMemo(() => run, [run])

  return (
    <TourControlContext.Provider value={control}>
      <TourRunContext.Provider value={runValue}>{children}</TourRunContext.Provider>
    </TourControlContext.Provider>
  )
}
