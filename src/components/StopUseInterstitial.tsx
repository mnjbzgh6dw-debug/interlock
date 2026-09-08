/**
 * Stop-use interstitial, per brief section 10.4.
 *
 * Full-bleed `stop`. The one place in this app to spend visual boldness, which
 * only works because everything else stays quiet. Acknowledge only: no backdrop
 * to tap away, no Escape, no close control. A prohibition is not dismissible.
 */

import type { FormItem } from '../types'
import type { Recipient } from '../lib/defects'
import { ANCHOR, tourAnchor } from '../tour/anchors'

type Props = {
  item: FormItem
  liftLabel: string
  buildingName: string
  officialNumber: string
  recipients: Recipient[]
  onAcknowledge: () => void
}

export function StopUseInterstitial({
  item,
  liftLabel,
  buildingName,
  officialNumber,
  recipients,
  onAcknowledge,
}: Props) {
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-label="Stop-use order"
      className="fixed inset-0 z-50 overflow-y-auto bg-stop text-white"
    >
      <div className="mx-auto flex min-h-dvh max-w-[560px] flex-col px-5 py-8">
        <p className="text-13 font-medium">Stop-use order</p>
        <h1 {...tourAnchor(ANCHOR.stopUseHeadline)} className="mt-2 text-31 font-semibold">
          No person may be conveyed in this lift until the defect is rectified.
        </h1>

        <div className="mt-6 border-t border-white/30 pt-4">
          <p className="text-17">
            {liftLabel}, {buildingName}
          </p>
          <p className="font-mono text-15">{officialNumber}</p>
        </div>

        <div className="mt-4 border-t border-white/30 pt-4">
          <p className="text-13 font-medium">Defect</p>
          <p className="mt-1 text-20 font-medium">{item.failDescription}</p>
          <p className="mt-1 text-15">
            {item.id} &middot; {item.clauseRef}
          </p>
        </div>

        <div
          {...tourAnchor(ANCHOR.stopUseRecipients)}
          className="mt-4 border-t border-white/30 pt-4"
        >
          <p className="text-13 font-medium">Being notified</p>
          <ul className="mt-1">
            {recipients.map((entry) => (
              <li key={entry.role} className="py-1 text-17">
                {entry.role}
                <span className="block text-15">{entry.recipient}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-15">Recorded in this app only. Nothing is sent.</p>
        </div>

        <div className="mt-auto pt-8">
          <button
            type="button"
            {...tourAnchor(ANCHOR.stopUseAcknowledge)}
            onClick={onAcknowledge}
            className="h-tap w-full rounded-card bg-white text-17 font-medium text-stop"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  )
}
