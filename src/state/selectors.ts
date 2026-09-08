/**
 * The read side of the model. Persona scope lives here rather than in screens,
 * per brief section 6, so a screen cannot accidentally widen it.
 */

import type { Defect, Inspection, Lift, Persona } from '../types'
import { buildings, serviceCompanies } from '../data/seed'
import { formItems } from '../data/form-passenger-a'
import type { AppState } from './types'

export const buildingById = new Map(buildings.map((b) => [b.id, b] as const))
export const serviceCompanyById = new Map(serviceCompanies.map((c) => [c.id, c] as const))

export function buildingFor(lift: Lift) {
  return buildingById.get(lift.buildingId)!
}

export function serviceCompanyFor(lift: Lift) {
  return serviceCompanyById.get(lift.serviceCompanyId)!
}

export function liftById(state: AppState, id: string): Lift | undefined {
  return state.lifts.find((l) => l.id === id)
}

export function liftByOfficialNumber(state: AppState, officialNumber: string): Lift | undefined {
  const wanted = officialNumber.trim().toLowerCase()
  return state.lifts.find((l) => l.officialNumber.toLowerCase() === wanted)
}

/** Register order: buildings in seed order, lifts in seed order within each. */
export function liftsByBuilding(state: AppState) {
  return buildings.map((building) => ({
    building,
    lifts: state.lifts.filter((l) => l.buildingId === building.id),
  }))
}

/** Most recent first. */
export function inspectionsFor(state: AppState, liftId: string): Inspection[] {
  return state.inspections
    .filter((i) => i.liftId === liftId)
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
}

export function inspectionByCode(state: AppState, code: string): Inspection | undefined {
  const wanted = code.trim().toUpperCase()
  return state.inspections.find((i) => i.verificationCode.toUpperCase() === wanted)
}

/**
 * A report's defect count is a property of that report, so it comes from the
 * responses rather than from live Defect records, which only exist for the
 * obligations this demo actually tracks.
 */
export function failedItemIds(inspection: Inspection): string[] {
  return Object.entries(inspection.responses)
    .filter(([, response]) => response.result === 'fail')
    .map(([itemId]) => itemId)
    .sort((a, b) => a.localeCompare(b))
}

/**
 * A defect becomes an obligation when the report that raised it is signed.
 * Before that it exists, so the inspector's grading survives a refresh, but it
 * is not yet anybody's dated obligation and must not appear as one.
 */
export function isIssued(state: AppState, defect: Defect): boolean {
  const inspection = state.inspections.find((i) => i.id === defect.inspectionId)
  return Boolean(inspection?.completedAt)
}

export function issuedDefects(state: AppState): Defect[] {
  return state.defects.filter((defect) => isIssued(state, defect))
}

export function defectsFor(state: AppState, liftId: string): Defect[] {
  return issuedDefects(state).filter((d) => d.liftId === liftId)
}

export function openDefectsFor(state: AppState, liftId: string): Defect[] {
  return defectsFor(state, liftId).filter((d) => d.status === 'open')
}

/** Brief 7.1: overdue is an open defect whose due date has passed. */
export function isOverdue(defect: Defect, demoDate: string): boolean {
  return defect.status === 'open' && defect.dueDate < demoDate
}

/** Brief 7.1: a lift is out of use while an immediate defect stands. */
export function stopUseDefects(state: AppState, liftId: string): Defect[] {
  return state.defects.filter(
    (d) => d.liftId === liftId && d.status === 'open' && d.severity === 'immediate',
  )
}

/**
 * Brief section 6. The inspector sees everything. The technician sees defects
 * assigned to the service company on Vertex-maintained lifts. The owner sees
 * every defect on their buildings' lifts whoever is responsible, because an
 * owner is liable for the machine whoever is fixing it.
 */
export function visibleDefects(state: AppState, persona: Persona): Defect[] {
  const lift = (id: string) => liftById(state, id)
  if (persona.id === 'inspector') return issuedDefects(state)
  if (persona.id === 'technician') {
    return issuedDefects(state).filter(
      (d) =>
        d.responsibility === 'serviceCompany' &&
        lift(d.liftId)?.serviceCompanyId === persona.serviceCompanyId,
    )
  }
  const ids = persona.buildingIds ?? []
  return issuedDefects(state).filter((d) => {
    const l = lift(d.liftId)
    return !!l && ids.includes(l.buildingId)
  })
}

/** The owner can see every defect on their lifts but close only their own. */
export function canClose(defect: Defect, persona: Persona): boolean {
  if (persona.id === 'technician') return defect.responsibility === 'serviceCompany'
  if (persona.id === 'owner') return defect.responsibility === 'owner'
  return false
}

/** Who carries a defect, for display next to it. */
export function responsiblePartyName(state: AppState, defect: Defect): string {
  const lift = liftById(state, defect.liftId)
  if (!lift) return 'Unknown'
  return defect.responsibility === 'owner'
    ? buildingFor(lift).ownerEntity
    : serviceCompanyFor(lift).name
}

/** Overdue first, then soonest due. */
export function byUrgency(demoDate: string) {
  return (a: Defect, b: Defect) => {
    const ao = isOverdue(a, demoDate) ? 0 : 1
    const bo = isOverdue(b, demoDate) ? 0 : 1
    return ao - bo || a.dueDate.localeCompare(b.dueDate)
  }
}

export function formItemFor(defect: Defect) {
  return formItems.get(defect.itemId)
}
