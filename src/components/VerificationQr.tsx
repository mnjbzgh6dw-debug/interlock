/**
 * QR for the report's verification block, pointing at /verify/:code.
 * Rendered to canvas with the `qrcode` package, per brief section 5.
 */

import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

export function VerificationQr({ url, size = 116 }: { url: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    QRCode.toCanvas(canvas, url, {
      width: size,
      margin: 0,
      errorCorrectionLevel: 'M',
      color: { dark: '#0A2540', light: '#FFFFFF' },
    }).catch(() => {
      // A missing QR must not take the certificate down with it.
    })
  }, [url, size])

  return <canvas ref={canvasRef} width={size} height={size} aria-label="Verification QR code" />
}
