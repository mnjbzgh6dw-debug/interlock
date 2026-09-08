/**
 * QR entry, per brief section 10.2 and item 18. A sticker on the equipment
 * carries /l/:officialNumber, which resolves to that lift's record.
 *
 * The official number is what is painted on the machine and printed on the
 * certificate, so it is the right thing to encode: it survives this demo's
 * internal ids changing.
 */

import { Link, Navigate, useParams } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { liftByOfficialNumber } from '../state/selectors'
import { useStore } from '../state/useStore'

export default function LiftByNumber() {
  const { officialNumber } = useParams()
  const { state } = useStore()
  const lift = officialNumber ? liftByOfficialNumber(state, officialNumber) : undefined

  if (lift) return <Navigate to={`/lift/${lift.id}`} replace />

  return (
    <div className="min-h-dvh bg-paper">
      <AppHeader />
      <main className="mx-auto max-w-[560px] px-4 pt-6">
        <h1 className="text-25 font-semibold">Not on this register</h1>
        <p className="mt-2 text-17">
          No lift on this register carries the number{' '}
          <span className="font-mono">{officialNumber}</span>. Check the number on the machine,
          or search the register.
        </p>
        <Link
          to="/register"
          className="mt-4 inline-flex h-tap items-center text-17 font-medium text-signal"
        >
          Open the register
        </Link>
      </main>
    </div>
  )
}
