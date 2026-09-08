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
import type { Tour } from './types'

export const tours: Tour[] = [
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
]

export const tourById = new Map(tours.map((tour) => [tour.id, tour] as const))

export function toursByKind(kind: Tour['kind']): Tour[] {
  return tours.filter((tour) => tour.kind === kind)
}
