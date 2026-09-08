/**
 * The catalogue.
 *
 * Tours are composed from step groups so the same copy serves a short workflow
 * tour and the long comprehensive one. See `Precondition.key` for how a group
 * knows whether to load its state cold or carry forward what it inherited.
 */

import { registerSteps } from './steps/register'
import { liftRecordSteps } from './steps/liftRecord'
import { checklistSteps } from './steps/checklist'
import { clauseSheetSteps } from './steps/clauseSheet'
import { photoSteps } from './steps/photo'
import { stopUseSteps } from './steps/stopUse'
import { defectReviewSteps } from './steps/defectReview'
import { signOffSteps } from './steps/signOff'
import { reportSteps } from './steps/report'
import { distributionSteps } from './steps/distribution'
import { verificationSteps } from './steps/verification'
import { closureSteps } from './steps/closure'
import { reminderSteps } from './steps/reminders'
import { offlineSteps } from './steps/offline'
import { portfolioSteps } from './steps/portfolio'
import { addendumSteps } from './steps/addendum'
import {
  comprehensiveSteps,
  inspectorSteps,
  ownerSteps,
  technicianSteps,
} from './steps/personas'
import type { Tour } from './types'

export const tours: Tour[] = [
  {
    id: 'everything',
    label: 'The whole story, ninety days',
    blurb: 'Arrival to portfolio exposure, the way the demo runs',
    kind: 'comprehensive',
    steps: comprehensiveSteps(),
  },
  {
    id: 'inspector',
    label: 'As the inspector',
    blurb: 'A morning at Kestrel House, from arrival to certificate',
    kind: 'persona',
    steps: inspectorSteps(),
  },
  {
    id: 'technician',
    label: 'As the lift company',
    blurb: 'The obligations that land on you, and closing one',
    kind: 'persona',
    steps: technicianSteps(),
  },
  {
    id: 'owner',
    label: 'As the building owner',
    blurb: 'Being chased, and what the portfolio is carrying',
    kind: 'persona',
    steps: ownerSteps(),
  },
  {
    id: 'register',
    label: 'The register',
    blurb: 'Compliance clocks, search, and a lift out of use',
    kind: 'workflow',
    steps: registerSteps(),
  },
  {
    id: 'lift-record',
    label: 'A lift’s whole record',
    blurb: 'Identity, clock, history back to 2018, obligations',
    kind: 'workflow',
    steps: liftRecordSteps(),
  },
  {
    id: 'checklist',
    label: 'Walking the checklist',
    blurb: 'Thirty items on a phone, and a reading that fails itself',
    kind: 'workflow',
    steps: checklistSteps(),
  },
  {
    id: 'clause',
    label: 'Clause references',
    blurb: 'The sheet, and coming back to the same spot',
    kind: 'workflow',
    steps: clauseSheetSteps(),
  },
  {
    id: 'photo',
    label: 'Photographic evidence',
    blurb: 'The one gate the form will not let you skip',
    kind: 'workflow',
    steps: photoSteps(),
  },
  {
    id: 'stop-use',
    label: 'A stop-use order',
    blurb: 'The red screen, who is told, and how it lifts',
    kind: 'workflow',
    steps: stopUseSteps(),
  },
  {
    id: 'grading',
    label: 'Defect review and grading',
    blurb: 'Failures become dated obligations with a named party',
    kind: 'workflow',
    steps: defectReviewSteps(),
  },
  {
    id: 'sign-off',
    label: 'Sign off',
    blurb: 'Identity, registration, and the signature that issues it',
    kind: 'workflow',
    steps: signOffSteps(),
  },
  {
    id: 'offline',
    label: 'Capture with no signal',
    blurb: 'Airplane mode, a real queue, and why it is gated',
    kind: 'workflow',
    steps: offlineSteps(),
  },
  {
    id: 'report',
    label: 'The certificate',
    blurb: 'Letterhead, items, defect schedule, signatures, QR',
    kind: 'workflow',
    steps: reportSteps(),
  },
  {
    id: 'distribution',
    label: 'Distribution',
    blurb: 'Four recipients, timestamped, and nothing sent',
    kind: 'workflow',
    steps: distributionSteps(),
  },
  {
    id: 'verification',
    label: 'Verifying a certificate',
    blurb: 'What the QR opens, and what it will tell you',
    kind: 'workflow',
    steps: verificationSteps(),
  },
  {
    id: 'closure',
    label: 'Closing an obligation',
    blurb: 'Photo, signature, and the order lifting',
    kind: 'workflow',
    steps: closureSteps(),
  },
  {
    id: 'addendum',
    label: 'The closure addendum',
    blurb: 'The loop reaching the certificate itself',
    kind: 'workflow',
    steps: addendumSteps(),
  },
  {
    id: 'reminders',
    label: 'Reminders and escalation',
    blurb: 'Computed, never stored, and what Day 31 looks like',
    kind: 'workflow',
    steps: reminderSteps(),
  },
  {
    id: 'portfolio',
    label: 'Portfolio exposure',
    blurb: 'Who carries it, and the number attached',
    kind: 'workflow',
    steps: portfolioSteps(),
  },
]

export const tourById = new Map(tours.map((tour) => [tour.id, tour] as const))

export function toursByKind(kind: Tour['kind']): Tour[] {
  return tours.filter((tour) => tour.kind === kind)
}
