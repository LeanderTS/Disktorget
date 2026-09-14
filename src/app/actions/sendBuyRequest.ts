'use server'

import { createClient } from '@/lib/supabase/server'

export async function sendBuyRequest(
  listingId: string,
  itemIndex: number | null,
  buyerEmail: string,
  buyerUsername: string
) {
  const supabase = createClient()

  const { data: listing } = await supabase
    .from('listings')
    .select('title, user_id')
    .eq('id', listingId)
    .single()

  if (!listing) return

  const { data: seller } = await supabase
    .rpc('get_private_contact', { seller_id: listing.user_id })
    .single<{ contact_email: string | null; contact_phone: string | null }>()

  if (!seller?.contact_email) return

  const itemText = itemIndex !== null ? ` (Disk ${itemIndex + 1})` : ''

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Disktorget <bud@disktorget.no>',
        to: seller.contact_email,
        reply_to: buyerEmail,
        subject: `${buyerUsername} ønsker å kjøpe "${listing.title}"`,
        text: `${buyerUsername} (${buyerEmail}) ønsker å kjøpe "${listing.title}"${itemText} på Disktorget.\n\nSvar direkte på denne e-posten for å komme i kontakt med kjøperen.\n\nSe annonsen: https://disktorget.no/disc/${listingId}`,
      }),
    })
  } catch {
    // Ignorer feil ved e-postsending
  }
}
