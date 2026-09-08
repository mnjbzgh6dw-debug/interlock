import { PLACEHOLDER_NOTICE } from '../data/form-passenger-a'

/**
 * Brief section 9. Persistent on every form screen and on the report. Real SANS
 * text is SABS copyright and paywalled, so this never comes off.
 */
export function PlaceholderBanner() {
  return (
    <p className="border-y border-open/40 bg-open-tint px-4 py-2 text-15 text-open">
      {PLACEHOLDER_NOTICE}
    </p>
  )
}
