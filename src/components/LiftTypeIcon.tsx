/**
 * Type icons. Quiet by design: they sit in `slate` because the inspector never
 * acts on them, and nothing here may compete with the compliance clock.
 */

import type { ReactNode } from 'react'
import type { LiftType } from '../types'

const PATHS: Record<LiftType, ReactNode> = {
  // A car in a shaft, doors parted.
  passenger: (
    <>
      <rect x="3.75" y="2.75" width="16.5" height="18.5" rx="1.5" />
      <path d="M12 3v18" />
      <path d="M8 8.5v7M16 8.5v7" />
    </>
  ),
  // A larger platform carrying a crate.
  goods: (
    <>
      <rect x="2.75" y="2.75" width="18.5" height="18.5" rx="1.5" />
      <rect x="7" y="9" width="10" height="8" />
      <path d="M7 13h10" />
    </>
  ),
  // A rising flight of steps.
  escalator: (
    <>
      <path d="M3 19h4v-4h4v-4h4V7h4" />
      <path d="M3 19h18" />
    </>
  ),
  // A small hatch, waist height.
  dumbwaiter: (
    <>
      <rect x="5.75" y="6.75" width="12.5" height="10.5" rx="1.5" />
      <path d="M12 7v10" />
      <path d="M3 21h18" />
    </>
  ),
}

export function LiftTypeIcon({ type, className }: { type: LiftType; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className ? `shrink-0 ${className}` : 'shrink-0'}
    >
      {PATHS[type]}
    </svg>
  )
}
