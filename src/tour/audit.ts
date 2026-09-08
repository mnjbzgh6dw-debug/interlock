/**
 * Walk every step of every tour and report the ones that would fail a viewer.
 *
 * The failure this catches is an anchor that exists in the source but never
 * renders under that step's own precondition, which is the mistake that
 * actually happens once there are twenty tours: a link that needs a closed
 * defect, an action bar that only renders for one persona, a "review defects"
 * button that needs a failure behind it.
 *
 * Reached with `?tour=all&audit=1`. Development instrument, never part of a
 * viewer's path.
 */

import type { Store } from '../state/context'
import { performAct } from './act'
import { waitForAnchor } from './spotlight'
import { tours } from './tours'

export type AuditRow = {
  tour: string
  step: string
  index: number
  route: string
  anchor: string
  result: 'ok' | 'anchor missing' | 'expectation failed' | 'threw' | 'stalled'
  detail?: string
}

type Navigate = (to: string, options: { replace: true }) => void

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))
const io = { alive: () => true, sleep }

/**
 * Every step gets a deadline. Timers are throttled hard in a background tab, so
 * a step that waits on something which never arrives can sit there long enough
 * to look like a hang and hide every step after it. Reporting a stall and
 * moving on is worth more than a precise measurement of one bad step.
 */
const STEP_DEADLINE = 6000

async function withDeadline<T>(work: Promise<T>): Promise<T | 'stalled'> {
  let timer = 0
  const deadline = new Promise<'stalled'>((resolve) => {
    timer = window.setTimeout(() => resolve('stalled'), STEP_DEADLINE)
  })
  try {
    return await Promise.race([work, deadline])
  } finally {
    clearTimeout(timer)
  }
}

export async function runAudit(store: () => Store, navigate: Navigate, base: string) {
  const rows: AuditRow[] = []

  for (const tour of tours) {
    let appliedKey = ''
    let appliedPersona = ''

    for (const [index, step] of tour.steps.entries()) {
      /**
       * One bad step must not end the walk. A precondition that throws used to
       * kill the whole run as an unhandled rejection, which reads exactly like
       * a hang and hides every step after it.
       */
      try {
        const outcome = await withDeadline(auditStep())
        if (outcome === 'stalled') {
          rows.push({
            tour: tour.id,
            step: step.id,
            index,
            route: step.route,
            anchor: step.waitFor ?? step.anchor ?? '(none)',
            result: 'stalled',
          })
          appliedKey = ''
          appliedPersona = ''
        }
      } catch (error) {
        rows.push({
          tour: tour.id,
          step: step.id,
          index,
          route: step.route,
          anchor: step.waitFor ?? step.anchor ?? '(none)',
          result: 'threw',
          detail: error instanceof Error ? error.message : String(error),
        })
        appliedKey = ''
        appliedPersona = ''
      }
      continue

      async function auditStep() {
      const api = store()
      if (appliedKey !== step.precondition.key) {
        const next = step.precondition.build()
        api.loadScenario(next)
        appliedKey = step.precondition.key
        appliedPersona = next.persona
      }
      if (appliedPersona !== step.persona) {
        api.setPersona(step.persona)
        appliedPersona = step.persona
      }
      if (step.precondition.demoDate) api.setDemoDate(step.precondition.demoDate)
      if (step.precondition.connection) api.setConnection(step.precondition.connection)
      if (window.location.pathname !== base + step.route) {
        navigate(step.route, { replace: true })
      }

      console.log(`[audit] ${tour.id}/${step.id} route=${step.route}`)
      const wanted = step.waitFor ?? step.anchor
      const found = wanted ? await waitForAnchor(wanted, io, 700) : null

      let result: AuditRow['result'] = 'ok'
      if (wanted && !found) {
        result = 'anchor missing'
      } else if (step.act) {
        await performAct(step.act, io)
        await sleep(120)
        if (step.expect && !step.expect(store().state)) result = 'expectation failed'
        else if (step.anchor && !(await waitForAnchor(step.anchor, io, 700))) {
          result = 'anchor missing'
        }
      }

      rows.push({
        tour: tour.id,
        step: step.id,
        index,
        route: step.route,
        anchor: wanted ?? '(none)',
        result,
      })
      }
    }
  }

  const bad = rows.filter((row) => row.result !== 'ok')
  console.log(
    `[tour audit] ${tours.length} tours, ${rows.length} steps, ${bad.length} problem${
      bad.length === 1 ? '' : 's'
    }`,
  )
  if (bad.length) console.table(bad)
  // Left on window so a test harness can read it without scraping the console.
  ;(window as unknown as { __tourAudit?: AuditRow[] }).__tourAudit = rows
  return rows
}
