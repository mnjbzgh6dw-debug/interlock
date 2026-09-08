/**
 * Seed data, per brief section 8. All fictitious.
 *
 * Everything the demo script touches lives in Kestrel House, which is
 * Vertex-maintained and Kestrel-owned, so the one technician persona and the
 * one owner persona can both see every defect the script creates or closes.
 */

import type {
  Building,
  Defect,
  Inspection,
  Lift,
  ResponseEntry,
  ServiceCompany,
} from '../types'
import { formPassengerA } from './form-passenger-a'
import pitWater from '../assets/photos/def-001-pit-water.jpg'
import callButton from '../assets/photos/def-003-call-button.jpg'
import sigMarais from '../assets/signatures/j-marais.svg'
import sigVanWyk from '../assets/signatures/t-van-wyk.svg'
import sigMkhize from '../assets/signatures/p-mkhize.svg'
import sigBotha from '../assets/signatures/m-botha.svg'

export const DEMO_DATE = '2026-09-08'

export const serviceCompanies: ServiceCompany[] = [
  { id: 'sc-vertex', name: 'Vertex Lift Services', contactEmail: 'dispatch@vertexlifts.example' },
  { id: 'sc-summit', name: 'Summit Elevator Co', contactEmail: 'service@summitelevator.example' },
  { id: 'sc-apex', name: 'Apex Vertical', contactEmail: 'support@apexvertical.example' },
]

export const buildings: Building[] = [
  {
    id: 'bld-kestrel',
    name: 'Kestrel House',
    address: '14 Loop Street, Cape Town',
    ownerEntity: 'Kestrel Property Holdings',
    contactName: 'N. Mokoena',
    contactEmail: 'n.mokoena@kestrelprop.example',
  },
  {
    id: 'bld-bellmont',
    name: 'Bellmont Chambers',
    address: '208 Rivonia Road, Sandton',
    ownerEntity: 'Bellmont Property Trust',
    contactName: 'D. Pillay',
    contactEmail: 'd.pillay@bellmonttrust.example',
  },
  {
    id: 'bld-waterfall',
    name: 'Waterfall Corporate Park, Block C',
    address: 'Century City, Cape Town',
    ownerEntity: 'Waterfall Park Body Corporate',
    contactName: 'A. Fourie',
    contactEmail: 'a.fourie@waterfallpark.example',
  },
]

export const seedLifts: Lift[] = [
  {
    id: 'lift-k1',
    buildingId: 'bld-kestrel',
    label: 'Lift 1',
    officialNumber: 'WC-L-2014-03318',
    type: 'passenger',
    floorsServed: 8,
    ratedLoadKg: 800,
    ratedSpeedMs: 1.6,
    driveType: 'Geared traction',
    installedDate: '2014-03-11',
    oem: 'Meridian Lifts',
    serviceCompanyId: 'sc-vertex',
    formId: 'form-passenger-a',
    lastReportDate: '2024-08-14',
    nextDueDate: '2026-08-14',
    stopUseInForce: false,
  },
  {
    id: 'lift-k2',
    buildingId: 'bld-kestrel',
    label: 'Lift 2',
    officialNumber: 'WC-L-2014-03319',
    type: 'passenger',
    floorsServed: 8,
    ratedLoadKg: 800,
    ratedSpeedMs: 1.6,
    driveType: 'Geared traction',
    installedDate: '2014-03-11',
    oem: 'Meridian Lifts',
    serviceCompanyId: 'sc-vertex',
    formId: 'form-passenger-a',
    lastReportDate: '2026-07-20',
    nextDueDate: '2028-07-20',
    stopUseInForce: false,
  },
  {
    id: 'lift-k3',
    buildingId: 'bld-kestrel',
    label: 'Goods Lift',
    officialNumber: 'WC-L-2016-04871',
    type: 'goods',
    floorsServed: 3,
    ratedLoadKg: 1600,
    ratedSpeedMs: 0.5,
    driveType: 'Hydraulic',
    installedDate: '2016-07-20',
    oem: 'Meridian Lifts',
    serviceCompanyId: 'sc-vertex',
    formId: null,
    lastReportDate: '2025-03-01',
    nextDueDate: '2027-03-01',
    stopUseInForce: false,
  },
  {
    id: 'lift-b1',
    buildingId: 'bld-bellmont',
    label: 'Lift 1',
    officialNumber: 'GP-L-2011-01204',
    type: 'passenger',
    floorsServed: 12,
    ratedLoadKg: 1000,
    ratedSpeedMs: 2.5,
    driveType: 'Gearless traction',
    installedDate: '2011-09-05',
    oem: 'Northgate Vertical',
    serviceCompanyId: 'sc-summit',
    formId: 'form-passenger-a',
    lastReportDate: '2025-06-18',
    nextDueDate: '2027-06-18',
    stopUseInForce: false,
  },
  {
    id: 'lift-b2',
    buildingId: 'bld-bellmont',
    label: 'Lift 2',
    officialNumber: 'GP-L-2011-01205',
    type: 'passenger',
    floorsServed: 12,
    ratedLoadKg: 1000,
    ratedSpeedMs: 2.5,
    driveType: 'Gearless traction',
    installedDate: '2011-09-05',
    oem: 'Northgate Vertical',
    serviceCompanyId: 'sc-summit',
    formId: 'form-passenger-a',
    lastReportDate: '2025-06-18',
    nextDueDate: '2027-06-18',
    stopUseInForce: false,
  },
  {
    id: 'lift-b3',
    buildingId: 'bld-bellmont',
    label: 'Escalator 1',
    officialNumber: 'GP-E-2011-00337',
    type: 'escalator',
    floorsServed: 2,
    ratedLoadKg: null,
    ratedSpeedMs: 0.5,
    driveType: 'Chain drive',
    installedDate: '2011-09-05',
    oem: 'Northgate Vertical',
    serviceCompanyId: 'sc-summit',
    formId: null,
    lastReportDate: '2025-10-30',
    nextDueDate: '2027-10-30',
    stopUseInForce: false,
  },
  {
    id: 'lift-w1',
    buildingId: 'bld-waterfall',
    label: 'Lift 1',
    officialNumber: 'WC-L-2021-06642',
    type: 'passenger',
    floorsServed: 5,
    ratedLoadKg: 630,
    ratedSpeedMs: 1.0,
    driveType: 'Machine-room-less',
    installedDate: '2021-02-14',
    oem: 'Cape Vertical',
    serviceCompanyId: 'sc-apex',
    formId: 'form-passenger-a',
    lastReportDate: '2024-11-02',
    nextDueDate: '2026-11-02',
    stopUseInForce: false,
  },
  {
    id: 'lift-w2',
    buildingId: 'bld-waterfall',
    label: 'Dumbwaiter',
    officialNumber: 'WC-L-2021-06643',
    type: 'dumbwaiter',
    floorsServed: 2,
    ratedLoadKg: 50,
    ratedSpeedMs: 0.3,
    driveType: 'Traction',
    installedDate: '2021-02-14',
    oem: 'Cape Vertical',
    serviceCompanyId: 'sc-apex',
    formId: null,
    lastReportDate: null,
    nextDueDate: null,
    stopUseInForce: false,
  },
]

/** The three inspectors who appear in the history. */
const INSPECTORS = {
  marais: { name: 'J. Marais', reg: 'RLI-2019-0451', signature: sigMarais },
  vanWyk: { name: 'T. van Wyk', reg: 'RLI-2011-0188', signature: sigVanWyk },
  mkhize: { name: 'P. Mkhize', reg: 'RLI-2016-0302', signature: sigMkhize },
} as const

type InspectorKey = keyof typeof INSPECTORS

/**
 * Historical responses are all pass except where a seeded defect needs a fail
 * behind it, so the defect count shown on a history row is derived from the
 * record rather than asserted next to it.
 */
function passResponses(fails: string[] = []): Record<string, ResponseEntry> {
  const out: Record<string, ResponseEntry> = {}
  for (const section of formPassengerA.sections) {
    for (const item of section.items) {
      if (fails.includes(item.id)) {
        out[item.id] = { result: 'fail' }
      } else if (item.responseType === 'measurement') {
        out[item.id] = { result: 'pass', value: MEASURED_PASS[item.id] }
      } else if (item.responseType === 'dateCheck') {
        out[item.id] = { result: 'pass', value: 'Certificate seen, within interval' }
      } else {
        out[item.id] = { result: 'pass' }
      }
    }
  }
  return out
}

/** Plausible in-range readings so historical reports do not print blanks. */
const MEASURED_PASS: Record<string, string> = {
  A2: '24',
  B3: '18',
  B7: '4',
  C2: '118',
  E1: '1',
  E2: '12.9',
}

function sectionSignatures(signature: string): Record<string, string> {
  return Object.fromEntries(formPassengerA.sections.map((s) => [s.id, signature]))
}

function distribution(date: string, ownerContact: string, serviceEmail: string) {
  const at = `${date}T16:30:00+02:00`
  return [
    { recipient: ownerContact, role: 'Building owner', sentAt: at },
    { recipient: serviceEmail, role: 'Service company', sentAt: at },
    { recipient: 'records@capevertical.example', role: 'Inspection service provider', sentAt: at },
    { recipient: 'lifts@labour.example', role: 'Regulator', sentAt: at },
  ]
}

type HistoryEntry = {
  id: string
  liftId: string
  date: string
  inspector: InspectorKey
  code: string
  /** Items failed on that inspection. Anything listed has a defect record. */
  fails?: string[]
  /** Lifts with no form loaded still carry a record of the inspection. */
  formId?: string
}

/**
 * lift-b3 is not in the brief's history table but its lastReportDate is
 * 2025-10-30, so it gets the one record that date implies. Inspector names for
 * the entries the brief leaves unnamed are assigned from the three known
 * inspectors, chronologically.
 */
const HISTORY: HistoryEntry[] = [
  { id: 'insp-k1-2018', liftId: 'lift-k1', date: '2018-07-02', inspector: 'vanWyk', code: 'IL-K1-0207-9C31' },
  { id: 'insp-k1-2020', liftId: 'lift-k1', date: '2020-08-05', inspector: 'vanWyk', code: 'IL-K1-0508-4A7D' },
  { id: 'insp-k1-2022', liftId: 'lift-k1', date: '2022-08-11', inspector: 'mkhize', code: 'IL-K1-1108-B268' },
  { id: 'insp-k1-2024', liftId: 'lift-k1', date: '2024-08-14', inspector: 'marais', code: 'IL-K1-1408-7E15', fails: ['C3'] },
  { id: 'insp-k2-2018', liftId: 'lift-k2', date: '2018-07-12', inspector: 'vanWyk', code: 'IL-K2-1207-3F92' },
  { id: 'insp-k2-2020', liftId: 'lift-k2', date: '2020-07-09', inspector: 'vanWyk', code: 'IL-K2-0907-C84B' },
  { id: 'insp-k2-2022', liftId: 'lift-k2', date: '2022-07-15', inspector: 'mkhize', code: 'IL-K2-1507-6D40' },
  { id: 'insp-k2-2024', liftId: 'lift-k2', date: '2024-07-18', inspector: 'marais', code: 'IL-K2-1807-A913' },
  { id: 'insp-k2-2026', liftId: 'lift-k2', date: '2026-07-20', inspector: 'marais', code: 'IL-K2-2007-5B7C', fails: ['B5', 'D1'] },
  { id: 'insp-k3-2019', liftId: 'lift-k3', date: '2019-08-01', inspector: 'mkhize', code: 'IL-K3-0108-2E56', formId: 'form-goods-a' },
  { id: 'insp-k3-2021', liftId: 'lift-k3', date: '2021-08-30', inspector: 'mkhize', code: 'IL-K3-3008-8F19', formId: 'form-goods-a' },
  { id: 'insp-k3-2023', liftId: 'lift-k3', date: '2023-02-14', inspector: 'marais', code: 'IL-K3-1402-D374', formId: 'form-goods-a' },
  { id: 'insp-k3-2025', liftId: 'lift-k3', date: '2025-03-01', inspector: 'marais', code: 'IL-K3-0103-1B8E', formId: 'form-goods-a' },
  { id: 'insp-b1-2019', liftId: 'lift-b1', date: '2019-05-14', inspector: 'vanWyk', code: 'IL-B1-1405-70CA' },
  { id: 'insp-b1-2021', liftId: 'lift-b1', date: '2021-06-02', inspector: 'mkhize', code: 'IL-B1-0206-E425' },
  { id: 'insp-b1-2023', liftId: 'lift-b1', date: '2023-06-09', inspector: 'mkhize', code: 'IL-B1-0906-5A61' },
  { id: 'insp-b1-2025', liftId: 'lift-b1', date: '2025-06-18', inspector: 'marais', code: 'IL-B1-1806-9D03' },
  { id: 'insp-b2-2019', liftId: 'lift-b2', date: '2019-05-16', inspector: 'vanWyk', code: 'IL-B2-1605-C817' },
  { id: 'insp-b2-2021', liftId: 'lift-b2', date: '2021-06-04', inspector: 'mkhize', code: 'IL-B2-0406-3B94' },
  { id: 'insp-b2-2023', liftId: 'lift-b2', date: '2023-06-11', inspector: 'mkhize', code: 'IL-B2-1106-F250' },
  { id: 'insp-b2-2025', liftId: 'lift-b2', date: '2025-06-18', inspector: 'marais', code: 'IL-B2-1806-64AF' },
  { id: 'insp-b3-2025', liftId: 'lift-b3', date: '2025-10-30', inspector: 'marais', code: 'IL-B3-3010-8C22', formId: 'form-escalator-a' },
  { id: 'insp-w1-2021', liftId: 'lift-w1', date: '2021-02-20', inspector: 'mkhize', code: 'IL-W1-2002-A16F' },
  { id: 'insp-w1-2022', liftId: 'lift-w1', date: '2022-11-06', inspector: 'mkhize', code: 'IL-W1-0611-D739' },
  { id: 'insp-w1-2024', liftId: 'lift-w1', date: '2024-11-02', inspector: 'marais', code: 'IL-W1-0211-2F58' },
]

export const seedInspections: Inspection[] = HISTORY.map((h) => {
  const inspector = INSPECTORS[h.inspector]
  const lift = seedLifts.find((l) => l.id === h.liftId)!
  const building = buildings.find((b) => b.id === lift.buildingId)!
  const company = serviceCompanies.find((c) => c.id === lift.serviceCompanyId)!
  /** A lift with no form loaded still has a record, with no responses to render. */
  const usesLoadedForm = !h.formId
  return {
    id: h.id,
    liftId: h.liftId,
    formId: h.formId ?? 'form-passenger-a',
    inspectorName: inspector.name,
    inspectorReg: inspector.reg,
    startedAt: `${h.date}T08:30:00+02:00`,
    completedAt: `${h.date}T11:15:00+02:00`,
    verificationCode: h.code,
    responses: usesLoadedForm ? passResponses(h.fails) : {},
    sectionSignatures: usesLoadedForm ? sectionSignatures(inspector.signature) : {},
    finalSignature: inspector.signature,
    distributedTo: distribution(h.date, building.contactEmail, company.contactEmail),
    capturedOffline: false,
    syncedAt: null,
  }
})

/**
 * Two open defects on lift-k2 from the 2026-07-20 inspection, and one already
 * closed on lift-k1 so the closed state has a worked example in the
 * technician's own worklist. Reminder history is computed, never seeded.
 */
export const seedDefects: Defect[] = [
  {
    id: 'def-001',
    inspectionId: 'insp-k2-2026',
    liftId: 'lift-k2',
    itemId: 'D1',
    description: 'Water present in lift pit',
    severity: 'days30',
    responsibility: 'owner',
    raisedDate: '2026-07-20',
    dueDate: '2026-08-19',
    status: 'open',
    raisedPhoto: pitWater,
    evidencePhoto: null,
    closedBy: null,
    closedAt: null,
    closureSignature: null,
  },
  {
    id: 'def-002',
    inspectionId: 'insp-k2-2026',
    liftId: 'lift-k2',
    itemId: 'B5',
    description: 'Car mirror cracked',
    severity: 'days90',
    responsibility: 'serviceCompany',
    raisedDate: '2026-07-20',
    dueDate: '2026-10-18',
    status: 'open',
    raisedPhoto: null,
    evidencePhoto: null,
    closedBy: null,
    closedAt: null,
    closureSignature: null,
  },
  {
    id: 'def-003',
    inspectionId: 'insp-k1-2024',
    liftId: 'lift-k1',
    itemId: 'C3',
    description: 'Landing call button not functional',
    severity: 'days90',
    responsibility: 'serviceCompany',
    raisedDate: '2024-08-14',
    dueDate: '2024-11-12',
    status: 'closed',
    raisedPhoto: null,
    evidencePhoto: callButton,
    closedBy: 'M. Botha, Vertex Lift Services',
    closedAt: '2024-09-02T14:05:00+02:00',
    closureSignature: sigBotha,
  },
]
