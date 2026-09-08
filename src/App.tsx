import { Logo, LogoLockup } from './components/Logo'

/**
 * Scaffold check. Temporary: replaced by the lift register at item 4.
 * It exists to prove the four things item 1 has to deliver: the named palette,
 * both Plex families, the type scale, and global tabular numerals.
 */

const brand = [
  ['shaft', 'bg-shaft'],
  ['hoist', 'bg-hoist'],
  ['signal', 'bg-signal'],
  ['slate', 'bg-slate'],
  ['rail', 'bg-rail'],
  ['paper', 'bg-paper'],
] as const

const status = [
  ['stop', 'bg-stop', 'bg-stop-tint', 'text-stop'],
  ['open', 'bg-open', 'bg-open-tint', 'text-open'],
  ['verified', 'bg-verified', 'bg-verified-tint', 'text-verified'],
] as const

const scale = [
  ['text-31 font-semibold', '31 / 600', 'Report title, stop-use headline'],
  ['text-25 font-semibold', '25 / 600', 'Screen titles'],
  ['text-20 font-medium', '20 / 500', 'Section headers'],
  ['text-17', '17 / 400', 'Body, checklist item text'],
  ['text-17 font-medium', '17 / 500', 'Measurement values, buttons'],
  ['text-15', '15 / 400', 'Secondary text, metadata'],
  ['text-13 font-medium', '13 / 500', 'Field labels, status pills'],
] as const

function Label({ children }: { children: string }) {
  return <p className="text-13 font-medium text-slate">{children}</p>
}

export default function App() {
  return (
    <main className="mx-0 max-w-[560px] px-4 py-6">
      <h1 className="text-25 font-semibold tracking-wordmark">Interlock</h1>
      <p className="mt-1 text-15 text-slate">
        Scaffold check. Replaced by the lift register at item 4.
      </p>

      <section className="mt-8">
        <Label>Logo, default variant on light surfaces</Label>
        <div className="mt-2 flex items-end gap-4 rounded-card border border-rail bg-white p-3">
          <Logo size={20} />
          <Logo size={32} />
          <Logo size={40} />
          <Logo size={64} />
        </div>
      </section>

      <section className="mt-8">
        <Label>Logo, default variant on shaft chrome</Label>
        <div className="mt-2 flex items-end gap-4 rounded-card bg-shaft p-3">
          <Logo size={20} />
          <Logo size={32} />
          <Logo size={40} />
          <Logo size={64} />
        </div>
      </section>

      <section className="mt-8">
        <Label>Logo, reversed variant for the report letterhead</Label>
        <div className="mt-2 flex items-end gap-4 rounded-card border border-rail bg-white p-3">
          <Logo size={20} variant="reversed" />
          <Logo size={32} variant="reversed" />
          <Logo size={40} variant="reversed" />
          <Logo size={64} variant="reversed" container="fill" />
        </div>
      </section>

      <section className="mt-8">
        <Label>Lockup, wordmark centred on the bolt</Label>
        <div className="mt-2 space-y-4 rounded-card border border-rail bg-white p-3">
          <div>
            <LogoLockup size={40} variant="reversed" className="text-shaft" />
          </div>
          <div>
            <LogoLockup size={28} variant="reversed" className="text-shaft" />
          </div>
        </div>
        <div className="mt-2 rounded-card bg-shaft p-3">
          <LogoLockup size={40} className="text-white" />
        </div>
      </section>

      <section className="mt-8">
        <Label>Brand colours, never used for status</Label>
        <ul className="mt-2 divide-y divide-rail border-y border-rail">
          {brand.map(([name, bg]) => (
            <li key={name} className="flex items-center gap-3 py-2">
              <span className={`h-8 w-8 rounded border border-rail ${bg}`} />
              <span className="text-17">{name}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <Label>Status colours, never used decoratively</Label>
        <ul className="mt-2 divide-y divide-rail border-y border-rail">
          {status.map(([name, bg, tint, text]) => (
            <li key={name} className="flex items-center gap-3 py-2">
              <span className={`h-8 w-8 rounded border border-rail ${bg}`} />
              <span className="text-17">{name}</span>
              <span
                className={`ml-auto rounded-full px-3 py-1 text-13 font-medium ${tint} ${text}`}
              >
                {name}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <Label>Type scale</Label>
        <ul className="mt-2 divide-y divide-rail border-y border-rail">
          {scale.map(([cls, size, use]) => (
            <li key={size} className="py-3">
              <p className={cls}>Nothing moves until it&rsquo;s closed</p>
              <p className="text-13 font-medium text-slate">
                {size} &middot; {use}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <Label>Tabular numerals, global</Label>
        <div className="mt-2 rounded-card border border-rail bg-white p-3">
          <p className="text-17 font-medium">0123456789</p>
          <p className="text-17 font-medium">1111111111</p>
          <p className="mt-2 text-15 text-slate">
            Both rows end at the same point, so columns of readings do not
            jitter as they are typed.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <Label>Plex Mono, official number and verification code only</Label>
        <div className="mt-2 rounded-card border border-rail bg-white p-3">
          <p className="font-mono text-17">WC-L-2014-03318</p>
          <p className="font-mono text-17">IL-K1-2609-4F7B</p>
        </div>
      </section>
    </main>
  )
}
