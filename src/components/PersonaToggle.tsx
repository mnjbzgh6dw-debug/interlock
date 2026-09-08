/**
 * Minimal persona switch, per Tier 1 item 14. Item 17 replaces this with the
 * demo controls panel, which is where switching properly belongs. Deliberately
 * plain so it does not read as a feature of the product.
 */

import { personas } from '../data/personas'
import { useStore } from '../state/useStore'

export function PersonaToggle() {
  const { state, setPersona } = useStore()

  return (
    <label className="ml-auto flex shrink-0 items-center gap-2">
      <span className="sr-only">Persona</span>
      <select
        value={state.persona}
        onChange={(event) => setPersona(event.target.value as typeof state.persona)}
        className="h-tap rounded-card border border-white/40 bg-shaft px-2 text-15 text-white"
      >
        {personas.map((persona) => (
          <option key={persona.id} value={persona.id}>
            {persona.role}
          </option>
        ))}
      </select>
    </label>
  )
}
