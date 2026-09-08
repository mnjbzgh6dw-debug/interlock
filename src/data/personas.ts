/** Brief section 6. Scope is enforced by the selectors, not by a login. */

import type { Persona } from '../types'

export const personas: Persona[] = [
  {
    id: 'inspector',
    role: 'Inspector',
    name: 'J. Marais',
    reg: 'RLI-2019-0451',
    organisation: 'Cape Vertical Inspections',
    accreditation: 'AIS-0042',
  },
  {
    id: 'technician',
    role: 'Technician',
    name: 'S. Ndlovu',
    organisation: 'Vertex Lift Services',
    serviceCompanyId: 'sc-vertex',
  },
  {
    id: 'owner',
    role: 'Building owner',
    name: 'N. Mokoena',
    organisation: 'Kestrel Property Holdings',
    buildingIds: ['bld-kestrel'],
  },
]

export const personaById = new Map(personas.map((p) => [p.id, p] as const))
