/**
 * Finger-drawn signature on a canvas, stored as a PNG data URL.
 *
 * Used at the end of every form section, at sign off, and on a defect closure.
 * Pointer events cover finger, stylus and mouse with one code path, and the
 * canvas is scaled by devicePixelRatio so the line is not soft on a phone.
 */

import { useEffect, useRef, useState } from 'react'

const HEIGHT = 160
const INK = '#0A2540'

type Props = {
  /** Existing signature, if this one has already been captured. */
  value: string | null
  onChange: (dataUrl: string | null) => void
  label: string
}

export function SignaturePad({ value, onChange, label }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const drawing = useRef(false)
  const dirty = useRef(false)
  const [hasInk, setHasInk] = useState(false)

  // Size the backing store to the element, once laid out.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || value) return
    const ratio = window.devicePixelRatio || 1
    const width = canvas.clientWidth
    canvas.width = Math.round(width * ratio)
    canvas.height = Math.round(HEIGHT * ratio)
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(ratio, ratio)
    ctx.lineWidth = 2.4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = INK
  }, [value])

  function positionOf(event: React.PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  function start(event: React.PointerEvent<HTMLCanvasElement>) {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // Some pointer sources refuse capture. Drawing still works without it.
    }
    drawing.current = true
    const { x, y } = positionOf(event)
    ctx.beginPath()
    ctx.moveTo(x, y)
    // A tap with no drag should still leave a mark.
    ctx.lineTo(x + 0.1, y)
    ctx.stroke()
    dirty.current = true
    setHasInk(true)
  }

  function move(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const { x, y } = positionOf(event)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  function end() {
    if (!drawing.current) return
    drawing.current = false
    // Commit once the finger lifts, not on every sample.
    if (dirty.current && canvasRef.current) {
      onChange(canvasRef.current.toDataURL('image/png'))
    }
  }

  function clear() {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    dirty.current = false
    setHasInk(false)
    onChange(null)
  }

  if (value) {
    return (
      <div>
        <p className="text-13 font-medium text-slate">{label}</p>
        <div className="mt-1 rounded-card border border-rail bg-white p-2">
          <img src={value} alt={label} className="h-20" />
        </div>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="mt-2 h-tap px-1 text-17 font-medium text-signal"
        >
          Sign again
        </button>
      </div>
    )
  }

  return (
    <div>
      <p className="text-13 font-medium text-slate">{label}</p>
      <canvas
        ref={canvasRef}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        style={{ height: HEIGHT, touchAction: 'none' }}
        className="mt-1 w-full rounded-card border border-rail bg-white"
      />
      <div className="flex items-center justify-between">
        <p className="text-15 text-slate">Sign with a finger</p>
        <button
          type="button"
          onClick={clear}
          disabled={!hasInk}
          className="h-tap px-1 text-17 font-medium text-signal disabled:text-slate"
        >
          Clear
        </button>
      </div>
    </div>
  )
}
