/**
 * Top chrome. The reversed logo variant is used here: a white container with a
 * shaft-coloured mark, which is the only one of the two sanctioned variants that
 * carries on a shaft background. The default hoist container would be navy on navy.
 */

import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { PersonaToggle } from './PersonaToggle'

export function AppHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="bg-shaft text-white">
      <div className="mx-auto flex max-w-[560px] items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-3" aria-label="Interlock, lift register">
          <Logo size={28} variant="reversed" container="fill" labelled={false} />
          <span className="text-20 font-semibold tracking-wordmark">Interlock</span>
        </Link>
        {children}
        <PersonaToggle />
      </div>
    </header>
  )
}
