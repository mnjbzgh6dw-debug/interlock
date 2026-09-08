/** The data model, per brief section 7. */

export type ServiceCompany = { id: string; name: string; contactEmail: string }

export type Building = {
  id: string
  name: string
  address: string
  ownerEntity: string
  contactName: string
  contactEmail: string
}

export type LiftType = 'passenger' | 'goods' | 'escalator' | 'dumbwaiter'

export type Lift = {
  id: string
  buildingId: string
  label: string // what's painted on the door
  officialNumber: string
  type: LiftType
  floorsServed: number
  ratedLoadKg: number | null
  ratedSpeedMs: number | null
  driveType: string
  installedDate: string
  oem: string
  serviceCompanyId: string
  formId: string | null // null = no form loaded in this demo
  lastReportDate: string | null
  nextDueDate: string | null
  stopUseInForce: boolean
}

export type ResponseType = 'passFail' | 'measurement' | 'dateCheck'
export type Unit = 'mm' | 'N' | '°C' | 'seconds' | 'count'
export type FailSeverity = 'immediate' | 'days30' | 'days90' | 'nextInspection'
export type Responsibility = 'serviceCompany' | 'owner'

export type FormItem = {
  id: string
  text: string
  failDescription: string // authored. reads correctly as a defect title.
  responseType: ResponseType
  unit?: Unit
  min?: number
  max?: number
  expectedLabel?: string // '≤ 150 N'
  clauseRef: string // 'Cl. 5.4.2'
  clausePlaceholder: string // 2–3 plain sentences
  failSeverity: FailSeverity
  defaultResponsibility: Responsibility
  photoRequiredOnFail: boolean
}

export type FormSection = { id: string; title: string; items: FormItem[] }

export type FormDefinition = {
  id: string
  title: string
  appliesTo: LiftType[]
  placeholderNotice: string
  sections: FormSection[]
}

export type ResponseResult = 'pass' | 'fail' | 'na'

export type ResponseEntry = {
  result: ResponseResult
  value?: string
  photo?: string
  note?: string
}

export type Inspection = {
  id: string
  liftId: string
  formId: string
  inspectorName: string
  inspectorReg: string
  startedAt: string
  completedAt: string | null
  verificationCode: string // 'IL-K1-2609-4F7B'
  responses: Record<string, ResponseEntry>
  sectionSignatures: Record<string, string>
  finalSignature: string | null
  distributedTo: { recipient: string; role: string; sentAt: string }[]
  capturedOffline: boolean
  syncedAt: string | null
}

export type DefectStatus = 'open' | 'closed'

export type Defect = {
  id: string
  inspectionId: string
  liftId: string
  itemId: string
  description: string // from failDescription
  severity: FailSeverity
  responsibility: Responsibility
  raisedDate: string
  dueDate: string
  status: DefectStatus
  raisedPhoto: string | null
  evidencePhoto: string | null
  closedBy: string | null
  closedAt: string | null
  closureSignature: string | null
}

/**
 * Defect carries no stored reminder array. Reminders are computed from
 * (defect, demoDate) per brief 7.2 and land at item 15.
 */

export type PersonaId = 'inspector' | 'technician' | 'owner'

export type Persona = {
  id: PersonaId
  /** Label for the switcher. */
  role: string
  name: string
  /** Inspector only. */
  reg?: string
  /** Inspector's firm, or the technician's service company. */
  organisation: string
  /** Inspector only: the SANAS placeholder number on the letterhead. */
  accreditation?: string
  /** Owner only: the buildings they can see. */
  buildingIds?: string[]
  /** Technician only: the service company whose defects they close. */
  serviceCompanyId?: string
}
