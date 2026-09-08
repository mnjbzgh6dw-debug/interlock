/**
 * Two contexts, split by how often they change.
 *
 * Kept out of the provider file for the same reason `state/context.ts` is: so
 * editing the orchestrator cannot break Fast Refresh and take every consumer
 * down with it.
 *
 * The spotlight rect is in neither. It lives in the overlay's refs and is
 * written straight to element styles, so tracking a scroll costs no React
 * renders at all.
 */

import { createContext } from 'react'
import type { TourControl, TourRun } from './types'

/** Stable for the life of the app. The demo panel consumes only this. */
export const TourControlContext = createContext<TourControl | null>(null)

/** Changes once per step. The overlay is its only consumer. */
export const TourRunContext = createContext<TourRun>(null)
