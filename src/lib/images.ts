/**
 * Image downscaling, per brief 7.3.
 *
 * A raw phone photo base64-encoded is 3 to 8MB and localStorage holds about 5MB,
 * so nothing reaches state at full size. Every capture is reduced to roughly
 * 1000px on the long edge as JPEG 0.6, which lands around 100 to 200KB.
 */

export const MAX_EDGE = 1000
export const JPEG_QUALITY = 0.6

/** Thrown for anything that is not a decodable image. */
export class NotAnImageError extends Error {}

async function decode(file: File): Promise<ImageBitmap | HTMLImageElement> {
  // createImageBitmap honours EXIF orientation, which matters because a photo
  // taken in a pit with the phone rotated arrives sideways otherwise.
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      // Fall through to the img path.
    }
  }
  const url = URL.createObjectURL(file)
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(new NotAnImageError('Could not decode image'))
      image.src = url
    })
  } finally {
    URL.revokeObjectURL(url)
  }
}

export async function downscaleToDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new NotAnImageError('Not an image')
  }
  const source = await decode(file)
  const width = 'width' in source ? source.width : 0
  const height = 'height' in source ? source.height : 0
  if (!width || !height) throw new NotAnImageError('Image has no dimensions')

  const scale = Math.min(1, MAX_EDGE / Math.max(width, height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(width * scale)
  canvas.height = Math.round(height * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new NotAnImageError('No 2d context')
  ctx.drawImage(source as CanvasImageSource, 0, 0, canvas.width, canvas.height)
  if ('close' in source) source.close()
  return canvas.toDataURL('image/jpeg', JPEG_QUALITY)
}
