/**
 * Interlock mark: a hoistway crossed by a thrown bolt. Reads as a lift shaft
 * and as a lock at once.
 *
 * Two variants only, per brief 4.4. Never recolour outside them, never stretch,
 * never add an effect. Geometry is fixed in a 32x32 viewBox; `size` scales both
 * axes together so the mark cannot be distorted.
 */

/** Brief 4.4: minimum size 20px. */
const MIN_SIZE = 20

/** Brief 4.4: 11px gap at a 40px mark, scaled proportionally. */
const GAP_RATIO = 11 / 40

/**
 * At the reference 40px mark the wordmark is 25px, which is the screen-title
 * size in the type scale (brief 4.3). Everything else scales from that.
 */
const WORDMARK_RATIO = 25 / 40

/**
 * The bolt runs through the exact vertical centre of the mark, so the wordmark's
 * ink centre has to land there too. "Interlock" has no descenders, and its ink
 * tops out at 0.74em: the cap line is 0.698em but the round letters overshoot it.
 * With line-height equal to the font size the baseline sits 0.875em below the
 * box top (IBM Plex Sans ascender 1025, descender 275, per 1000 em), putting the
 * ink centre at 0.875 - 0.37 = 0.505em, which is 0.005em below the box centre.
 * Measured, not assumed: assuming the cap line here overcorrects by 0.02em.
 */
const OPTICAL_NUDGE_RATIO = 0.005

type Variant = 'default' | 'reversed'

type LogoProps = {
  /** Height and width in px. Clamped to the 20px minimum. */
  size?: number
  /**
   * `default` is the hoist container with a white shaft and bolt.
   * `reversed` is for light surfaces and the report letterhead.
   */
  variant?: Variant
  /** Reversed only: white container, or none so it sits on any light surface. */
  container?: 'fill' | 'none'
  className?: string
  /** Set false when a visible wordmark already names the app. */
  labelled?: boolean
}

export function Logo({
  size = 32,
  variant = 'default',
  container = 'none',
  className,
  labelled = true,
}: LogoProps) {
  const px = Math.max(MIN_SIZE, size)
  const reversed = variant === 'reversed'

  const containerFill = reversed
    ? container === 'fill'
      ? '#FFFFFF'
      : 'none'
    : '#123A5E'
  const glyph = reversed ? '#0A2540' : '#FFFFFF'
  const strokeWidth = reversed ? 1.8 : 1.6

  return (
    <svg
      viewBox="0 0 32 32"
      width={px}
      height={px}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={labelled ? 'Interlock' : undefined}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
      className={className ? `shrink-0 ${className}` : 'shrink-0'}
    >
      <rect width="32" height="32" rx="7.5" fill={containerFill} />
      <rect
        x="10"
        y="6.5"
        width="12"
        height="19"
        rx="2"
        fill="none"
        stroke={glyph}
        strokeWidth={strokeWidth}
      />
      <rect x="5" y="14.4" width="22" height="3.2" rx="1.6" fill={glyph} />
    </svg>
  )
}

type LockupProps = Omit<LogoProps, 'labelled'>

/**
 * Mark, gap, wordmark. The wordmark takes its colour from the surrounding text
 * colour, so the caller sets `text-shaft` on light chrome or `text-white` on
 * dark, and the mark variant is chosen independently.
 */
export function LogoLockup({
  size = 40,
  variant = 'default',
  container = 'none',
  className,
}: LockupProps) {
  const px = Math.max(MIN_SIZE, size)
  const wordmarkSize = px * WORDMARK_RATIO

  return (
    <span
      className={`inline-flex items-center ${className ?? ''}`}
      style={{ gap: `${px * GAP_RATIO}px` }}
    >
      <Logo size={px} variant={variant} container={container} labelled={false} />
      <span
        className="font-sans font-semibold tracking-wordmark"
        style={{
          fontSize: `${wordmarkSize}px`,
          lineHeight: `${wordmarkSize}px`,
          transform: `translateY(-${wordmarkSize * OPTICAL_NUDGE_RATIO}px)`,
        }}
      >
        Interlock
      </span>
    </span>
  )
}
