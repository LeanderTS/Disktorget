'use server'

import { createClient } from '@/lib/supabase/server'

export async function notifyBid(
  listingId: string,
  amount: number,
  itemIndex: number | null
) {
  const supabase = createClient()

  const { data: listing } = await supabase
    .from('listings')
    .select('title, user_id')
    .eq('id', listingId)
    .single()

  if (!listing) return

  const { data: seller } = await supabase
    .from('profiles')
    .select('contact_email')
    .eq('id', listing.user_id)
    .single()

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
        subject: `Nytt bud på "${listing.title}"`,
        text: `Du har fått et nytt bud på ${amount} kr på annonsen "${listing.title}"${itemText}.\n\nSe annonsen: https://disktorget.no/disc/${listingId}`,
      }),
    })
  } catch {
    // Ignorer feil ved e-postsending - budet er uansett lagret i databasen
  }
}
