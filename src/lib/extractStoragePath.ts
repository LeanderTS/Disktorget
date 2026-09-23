// Henter ut lagringsstien fra en offentlig Supabase Storage-URL,
// slik at vi kan referere til den samme filen ved overskriving.
// Eksempel: https://xxxx.supabase.co/storage/v1/object/public/disc-images/USERID/FILNAVN.jpg
// -> "USERID/FILNAVN.jpg"
export function extractStoragePath(publicUrl: string): string | null {
  const marker = '/disc-images/'
  const index = publicUrl.indexOf(marker)
  if (index === -1) return null
  return decodeURIComponent(publicUrl.slice(index + marker.length))
}
