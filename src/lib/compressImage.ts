// Komprimerer og skalerer ned et bilde i nettleseren før opplasting,
// for å redusere lagringsplass og båndbredde-bruk i Supabase.
export async function compressImage(
  file: File,
  maxDimension = 1600,
  quality = 0.8
): Promise<File> {
  if (!file.type.startsWith('image/')) return file

  try {
    const imageBitmap = await createImageBitmap(file)
    let { width, height } = imageBitmap

    if (width > maxDimension || height > maxDimension) {
      if (width > height) {
        height = Math.round((height / width) * maxDimension)
        width = maxDimension
      } else {
        width = Math.round((width / height) * maxDimension)
        height = maxDimension
      }
    }

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return file

    ctx.drawImage(imageBitmap, 0, 0, width, height)

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality)
    )

    if (!blob) return file

    // Ikke bruk komprimert versjon hvis den av en eller annen grunn ble større
    if (blob.size >= file.size) return file

    const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg'
    return new File([blob], newName, { type: 'image/jpeg' })
  } catch {
    // Hvis noe feiler (f.eks. ustøttet filformat), bruk originalfilen som før
    return file
  }
}
