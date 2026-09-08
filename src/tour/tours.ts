/**
 * The catalogue.
 *
 * Tours are composed from step groups so the same copy serves a short workflow
 * tour and the long comprehensive one. See `Precondition.key` for how a group
 * knows whether to load its state cold or carry forward what it inherited.
 */

import { registerSteps } from './steps/register'
import type { Tour } from './types'

export const tours: Tour[] = [
  {
    id: 'register',
    label: 'The register',
    blurb: 'Compliance clocks, search, and a lift out of use',
    kind: 'workflow',
    steps: registerSteps(),
  },
]

export const tourById = new Map(tours.map((tour) => [tour.id, tour] as const))

export function toursByKind(kind: Tour['kind']): Tour[] {
  return tours.filter((tour) => tour.kind === kind)
}
