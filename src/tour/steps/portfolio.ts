/** Where an inspector's tool becomes a business. */

import { ANCHOR } from '../anchors'
import { day45 } from '../preconditions'
import type { TourStep } from '../types'

export function portfolioSteps(): TourStep[] {
  const base = { route: '/portfolio', persona: 'owner' as const }
  return [
    {
      ...base,
      precondition: day45,
      id: 'portfolio-figures',
      anchor: ANCHOR.portfolioFigures,
      title: 'Day 45 — what the portfolio is carrying',
      body: 'One lift out of service, no inspections overdue because one was cleared on the morning of Day 0, and every obligation raised that day now past its date. Counts and days, not a rand figure: there is no cost data here and an invented one would be picked apart.',
    },
    {
      ...base,
      precondition: day45,
      id: 'portfolio-who',
      anchor: ANCHOR.portfolioWhoCarries,
      title: 'Who carries it',
      body: 'Split by the party responsible. The owner is carrying most of it, and the ones assigned to the lift company still sit on this portfolio, because an owner is liable for the machine whoever is holding the spanner. This is the screen where the question of who pays stops being abstract.',
    },
    {
      ...base,
      precondition: day45,
      id: 'portfolio-obligations',
      anchor: ANCHOR.portfolioObligations,
      title: 'Every obligation, oldest first',
      body: 'Each one links to the defect, its evidence and its reminder history. A facilities manager can answer what is outstanding, who owns it and how long it has been late, without opening a single report.',
    },
  ]
}
