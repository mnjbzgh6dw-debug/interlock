import { TONE_TINT, type ComplianceTone } from '../lib/compliance'

/** Pills only where the thing genuinely is a status, per brief 4.5. */
export function StatusPill({ tone, children }: { tone: ComplianceTone; children: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-13 font-medium ${TONE_TINT[tone]}`}
    >
      {children}
    </span>
  )
}
