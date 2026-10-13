'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabaseAdmin'

export async function notifySavedSearches(listingId: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const admin = createAdminClient()

  // Kun eieren kan utløse varsling, og kun én gang pr. annonse
  const { data: listing } = await admin
    .from('listings')
    .update({ alerts_sent_at: new Date().toISOString() })
    .eq('id', listingId)
    .eq('user_id', user.id)
    .is('alerts_sent_at', null)
    .select('id, title, price_nok, location')
    .maybeSingle()

  if (!listing) return

  const { data: matches } = await admin.rpc('match_saved_searches', {
    p_listing_id: listingId,
  })

  const userIds = Array.from(
    new Set(((matches ?? []) as { user_id: string }[]).map((m) => m.user_id))
  )

  for (const userId of userIds) {
    try {
      const { data: profile } = await admin
        .from('profiles')
        .select('contact_email')
        .eq('id', userId)
        .single()

      let email: string | null = profile?.contact_email ?? null
      if (!email) {
        const { data } = await admin.auth.admin.getUserById(userId)
        email = data.user?.email ?? null
      }
      if (!email) continue

      const priceText = listing.price_nok ? `${listing.price_nok} kr` : 'Pris på forespørsel'
      const locationText = listing.location ? `\nSted: ${listing.location}` : ''

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Disktorget <varsel@disktorget.no>',
          to: email,
          subject: `Ny annonse som matcher søket ditt: "${listing.title}"`,
          text: `Det er lagt ut en ny annonse som matcher et av dine lagrede søk:\n\n${listing.title}\n${priceText}${locationText}\n\nSe annonsen: https://disktorget.no/disc/${listing.id}\n\nAdministrer lagrede søk: https://disktorget.no/mine/sok`,
        }),
      })
    } catch {
      // Ignorer feil for enkeltmottakere, de andre skal fortsatt få varsel
    }
  }
}
