/**
 * Printable sticker sheet, per item 18. Print it, cut it, and put one on
 * something in the meeting room so the demo starts with a scan rather than a
 * URL. Each sticker carries /l/:officialNumber for that lift.
 */

import { Logo } from '../components/Logo'
import { VerificationQr } from '../components/VerificationQr'
import { buildingFor } from '../state/selectors'
import { useStore } from '../state/useStore'

export default function Stickers() {
  const { state } = useStore()
  const base = `${window.location.origin}${import.meta.env.BASE_URL}`

  return (
    <div className="min-h-dvh bg-paper">
      <div className="no-print border-b border-rail bg-white">
        <div className="mx-auto flex max-w-[820px] items-center justify-between gap-3 px-4 py-3">
          <div>
            <h1 className="text-20 font-medium">Sticker sheet</h1>
            <p className="text-15">
              {state.lifts.length} lifts. Print, cut, and stick one on the equipment.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="h-tap shrink-0 rounded-card bg-signal px-4 text-17 font-medium text-white"
          >
            Print
          </button>
        </div>
      </div>

      <div className="report mx-auto max-w-[820px] bg-white p-6">
        <div className="grid grid-cols-2 gap-4">
          {state.lifts.map((lift) => (
            <div
              key={lift.id}
              className="report-item flex items-center gap-3 border border-dashed border-shaft p-3"
            >
              <VerificationQr url={`${base}l/${lift.officialNumber}`} size={92} />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <Logo size={20} variant="reversed" labelled={false} />
                  <span className="text-15 font-semibold tracking-wordmark">Interlock</span>
                </div>
                <p className="mt-1 text-17 font-medium">{lift.label}</p>
                <p className="text-13">{buildingFor(lift).name}</p>
                <p className="font-mono text-13">{lift.officialNumber}</p>
                <p className="mt-1 text-13">Scan for the inspection record</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
