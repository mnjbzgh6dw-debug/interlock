import { useContext } from 'react'
import { TourControlContext, TourRunContext } from './context'
import type { TourControl, TourRun } from './types'

export function useTourControl(): TourControl {
  const control = useContext(TourControlContext)
  if (!control) throw new Error('useTourControl must be used inside TourProvider')
  return control
}

export function useTourRun(): TourRun {
  return useContext(TourRunContext)
}
