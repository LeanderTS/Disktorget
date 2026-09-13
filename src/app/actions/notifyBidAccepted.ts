'use server'

import { createClient } from '@/lib/supabase/server'

export async function notifyBidAccepted(bidId: string) {
  if (!bidId) return

  const supabase = createClient()

  const { data: bid } = await supabase
    .from('bids')
    .select('bidder_email, amount_nok, listing_id')
    .eq('id', bidId)
    .single()

  if (!bid?.bidder_email) return

  const { data: listing } = await supabase
    .from('listings')
    .select('title, user_id')
    .eq('id', bid.listing_id)
    .single()

  const title = listing?.title ?? 'annonsen'

  let contactLine = ''
  if (listing?.user_id) {
    const { data: seller } = await supabase
      .from('profiles')
      .select('contact_email, contact_phone')
      .eq('id', listing.user_id)
      .single()

    const parts: string[] = []
    if (seller?.contact_email) parts.push(seller.contact_email)
    if (seller?.contact_phone) parts.push(seller.contact_phone)

    if (parts.length > 0) {
      contactLine = `\n\nKontakt selger her: ${parts.join(' / ')}`
    }
  }

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Disktorget <bud@disktorget.no>',
        to: bid.bidder_email,
        subject: `Ditt bud ble akseptert på "${title}"`,
        text: `Gode nyheter! Selgeren har akseptert budet ditt på ${bid.amount_nok} kr for "${title}".${contactLine}\n\nSe annonsen: https://disktorget.no/disc/${bid.listing_id}`,
      }),
    })
  } catch {
    // Ignorer feil ved e-postsending - annonsen er uansett markert som solgt
  }
}
