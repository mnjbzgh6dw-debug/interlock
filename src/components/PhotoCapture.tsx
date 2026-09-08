/**
 * Photo capture on a failed item, per brief 5 and 7.3. The camera is preferred
 * on a phone, and the file is downscaled before it reaches state.
 */

import { useRef, useState } from 'react'
import { downscaleToDataUrl } from '../lib/images'

type Props = {
  value: string | undefined
  onChange: (dataUrl: string | undefined) => void
  /** Named in the error text so a failure says which item it belongs to. */
  label: string
  required: boolean
}

export function PhotoCapture({ value, onChange, label, required }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [busy, setBusy] = useState(false)
  const [problem, setProblem] = useState<string | null>(null)

  async function take(file: File | undefined) {
    if (!file) return
    setBusy(true)
    setProblem(null)
    try {
      onChange(await downscaleToDataUrl(file))
    } catch {
      setProblem('That file could not be read as an image. Take the photo again.')
    } finally {
      setBusy(false)
      // Allow the same file to be chosen again after a failure.
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="mt-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(event) => take(event.target.files?.[0])}
        className="sr-only"
        aria-label={`Photograph ${label}`}
      />

      {value && (
        <img
          src={value}
          alt={`Photograph of ${label}`}
          className="mb-2 h-32 w-full rounded-card border border-rail object-cover"
        />
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`h-tap rounded-card border px-4 text-17 font-medium ${
            required && !value ? 'border-stop bg-stop text-white' : 'border-signal text-signal'
          }`}
        >
          {busy ? 'Adding photo' : value ? 'Replace photo' : 'Add photo'}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="h-tap px-2 text-17 font-medium text-signal"
          >
            Remove
          </button>
        )}
      </div>

      {problem && <p className="mt-1 text-15 text-stop">{problem}</p>}
    </div>
  )
}
