/**
 * Anything that does not resolve. Per brief 4.7 an error says what happened and
 * what to do, with no apology and no "Error:" prefix. A mistyped URL on a phone
 * in a machine room should not be a white page.
 */

import { Link, useLocation } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'

export default function NotFound() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-dvh bg-paper">
      <AppHeader />
      <main className="mx-auto max-w-[560px] px-4 pt-6">
        <h1 className="text-25 font-semibold">Nothing at this address</h1>
        <p className="mt-2 text-17">
          <span className="font-mono">{pathname}</span> is not part of this register. Open the
          register and search for the lift, or scan the sticker on the machine.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex h-tap items-center text-17 font-medium text-signal"
        >
          Open the register
        </Link>
      </main>
    </div>
  )
}
