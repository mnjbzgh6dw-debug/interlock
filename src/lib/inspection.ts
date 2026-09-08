/**
 * Starting an inspection, and the rules for turning a typed value into a result.
 *
 * Every evaluation here happens on commit, never on keystroke: typing 5 on the
 * way to 50, or 1 on the way to 12.4, must not fail an item or fire anything.
 */

import type {
  FormDefinition,
  FormItem,
  Inspection,
  Lift,
  Persona,
  ResponseEntry,
  ResponseResult,
} from '../types'
import { dayMonthCode, daysBetween } from './dates'

/** 'lift-k1' -> 'K1', for the verification code. */
export function liftShort(liftId: string): string {
  return liftId.replace(/^lift-/, '').toUpperCase()
}

function hex4(): string {
  return Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 16)
      .toString(16)
      .toUpperCase(),
  ).join('')
}

/** Brief 7.4: IL-{liftShort}-{DDMM}-{4 hex}. */
export function verificationCode(liftId: string, day: string): string {
  return `IL-${liftShort(liftId)}-${dayMonthCode(day)}-${hex4()}`
}

/**
 * The clock time comes from the machine but the date comes from the demo date,
 * so a record made after the date is advanced still reads consistently.
 */
function demoTimestamp(demoDate: string): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${demoDate}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}+02:00`
}

export function createInspection(
  lift: Lift,
  inspector: Persona,
  demoDate: string,
  offline: boolean,
): Inspection {
  return {
    id: `insp-${liftShort(lift.id).toLowerCase()}-${Date.now().toString(36)}`,
    liftId: lift.id,
    formId: lift.formId!,
    inspectorName: inspector.name,
    inspectorReg: inspector.reg ?? '',
    startedAt: demoTimestamp(demoDate),
    completedAt: null,
    verificationCode: verificationCode(lift.id, demoDate),
    responses: {},
    sectionSignatures: {},
    finalSignature: null,
    distributedTo: [],
    capturedOffline: offline,
    syncedAt: null,
  }
}

/** An inspection is in progress until it is signed off. */
export function inProgressFor(inspections: Inspection[], liftId: string): Inspection | undefined {
  return inspections.find((i) => i.liftId === liftId && i.completedAt === null)
}

export type Committed = { result: ResponseResult; value: string } | null

/**
 * Brief 10.3: out of range auto-fails. An empty field commits to nothing, which
 * leaves the item unanswered rather than guessing.
 */
export function commitMeasurement(item: FormItem, raw: string): Committed {
  const trimmed = raw.trim()
  if (trimmed === '') return null
  const value = Number(trimmed)
  if (!Number.isFinite(value)) return null
  const belowMin = item.min !== undefined && value < item.min
  const aboveMax = item.max !== undefined && value > item.max
  return { result: belowMin || aboveMax ? 'fail' : 'pass', value: trimmed }
}

/** Months of grace on a dateCheck item. E4 is 'Within 12 months'. */
export const DATE_CHECK_MONTHS = 12

/**
 * A dateCheck records when the certified test was last done and fails when that
 * is further back than the interval. Judged against the demo date, not today.
 */
export function commitDateCheck(raw: string, demoDate: string): Committed {
  if (!raw) return null
  const parts = raw.split('-')
  if (parts.length !== 3) return null
  const limit = new Date(`${demoDate}T00:00:00Z`)
  limit.setUTCMonth(limit.getUTCMonth() - DATE_CHECK_MONTHS)
  const cutoff = limit.toISOString().slice(0, 10)
  // A test dated in the future is not evidence of anything.
  const inFuture = daysBetween(demoDate, raw) > 0
  return { result: raw < cutoff || inFuture ? 'fail' : 'pass', value: raw }
}

export type SectionProgress = {
  id: string
  title: string
  answered: number
  total: number
  signed: boolean
  /** Brief section 9: complete means every item answered and the section signed. */
  complete: boolean
}

export function sectionProgress(form: FormDefinition, inspection: Inspection): SectionProgress[] {
  return form.sections.map((section) => {
    const answered = section.items.filter((item) => inspection.responses[item.id]).length
    const signed = Boolean(inspection.sectionSignatures[section.id])
    return {
      id: section.id,
      title: section.title,
      answered,
      total: section.items.length,
      signed,
      complete: answered === section.items.length && signed,
    }
  })
}

export function totalItems(form: FormDefinition): number {
  return form.sections.reduce((n, section) => n + section.items.length, 0)
}

export function totalAnswered(form: FormDefinition, inspection: Inspection): number {
  return form.sections.reduce(
    (n, section) => n + section.items.filter((item) => inspection.responses[item.id]).length,
    0,
  )
}

/** Written into the response so the report can print what was measured. */
export function displayValue(item: FormItem, response: ResponseEntry | undefined): string | null {
  if (!response?.value) return null
  if (item.responseType === 'measurement') {
    return item.unit ? `${response.value} ${item.unit}` : response.value
  }
  return response.value
}
