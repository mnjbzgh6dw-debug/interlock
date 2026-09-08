/**
 * Turning failed items into graded obligations, per brief 7.1 and section 10.5.
 *
 * Defect records are derived from the inspection's failures, deterministically:
 * the same failure always produces the same defect id, so reconciling is
 * idempotent and can run as often as it likes without duplicating anything.
 */

import type {
  Building,
  Defect,
  FailSeverity,
  FormDefinition,
  Inspection,
  Lift,
  Responsibility,
  ServiceCompany,
} from '../types'
import { dueDateFor } from './dates'

export const SEVERITY_ORDER: FailSeverity[] = [
  'immediate',
  'days30',
  'days90',
  'nextInspection',
]

export const SEVERITY_LABEL: Record<FailSeverity, string> = {
  immediate: 'Immediate',
  days30: 'Within 30 days',
  days90: 'Within 90 days',
  nextInspection: 'At next inspection',
}

/** Longer form, for the review screen where there is room to be plain. */
export const SEVERITY_MEANING: Record<FailSeverity, string> = {
  immediate: 'Not for use until rectified',
  days30: 'Tracked and chased',
  days90: 'Tracked and chased',
  nextInspection: 'Recorded, not chased',
}

export const RESPONSIBILITY_LABEL: Record<Responsibility, string> = {
  serviceCompany: 'Lift company',
  owner: 'Building owner',
}

/** Deterministic, so reconciliation never creates a second copy. */
export function defectIdFor(inspectionId: string, itemId: string): string {
  return `def-${inspectionId}-${itemId}`
}

/**
 * Bring the defect list into line with what the inspection currently says.
 * Called on an explicit action, never from a render.
 *
 * An existing defect keeps its responsibility, because the inspector may have
 * overridden it, and picks up the item's photograph if one has since been added.
 */
export function reconcileDefects(
  all: Defect[],
  inspection: Inspection,
  form: FormDefinition,
  lift: Lift,
  demoDate: string,
): Defect[] {
  const items = form.sections.flatMap((section) => section.items)
  const failing = items.filter((item) => inspection.responses[item.id]?.result === 'fail')
  const mine = new Map(
    all.filter((d) => d.inspectionId === inspection.id).map((d) => [d.itemId, d] as const),
  )
  const others = all.filter((d) => d.inspectionId !== inspection.id)

  const reconciled = failing.map((item) => {
    const response = inspection.responses[item.id]
    const existing = mine.get(item.id)
    if (existing) {
      return { ...existing, raisedPhoto: response?.photo ?? existing.raisedPhoto }
    }
    return {
      id: defectIdFor(inspection.id, item.id),
      inspectionId: inspection.id,
      liftId: lift.id,
      itemId: item.id,
      description: item.failDescription,
      severity: item.failSeverity,
      responsibility: item.defaultResponsibility,
      raisedDate: demoDate,
      dueDate: dueDateFor(item.failSeverity, demoDate, lift),
      status: 'open' as const,
      raisedPhoto: response?.photo ?? null,
      evidencePhoto: null,
      closedBy: null,
      closedAt: null,
      closureSignature: null,
    }
  })

  return [...others, ...reconciled]
}

/** Ordered by how urgent the obligation is, then by item id. */
export function bySeverity(a: Defect, b: Defect): number {
  const order = SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)
  return order || a.itemId.localeCompare(b.itemId)
}

export function countBySeverity(defects: Defect[]): { severity: FailSeverity; count: number }[] {
  return SEVERITY_ORDER.map((severity) => ({
    severity,
    count: defects.filter((d) => d.severity === severity).length,
  })).filter((entry) => entry.count > 0)
}

export type Recipient = { recipient: string; role: string }

/**
 * Who gets told. The regulator is on the list for a stop-use order, per brief
 * 7.1, and on the distribution list for every report, per section 10.8.
 * Recorded in the app only: nothing is ever sent.
 */
export function notificationRecipients(
  building: Building,
  company: ServiceCompany,
  includeRegulator: boolean,
): Recipient[] {
  const list: Recipient[] = [
    { recipient: `${building.contactName}, ${building.contactEmail}`, role: 'Building owner' },
    { recipient: company.contactEmail, role: 'Lift company' },
    {
      recipient: 'records@capevertical.example',
      role: 'Inspection service provider',
    },
  ]
  if (includeRegulator) {
    list.push({ recipient: 'lifts@labour.example', role: 'Regulator' })
  }
  return list
}
