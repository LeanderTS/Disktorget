import { redirect } from 'next/navigation'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Listing } from '@/lib/types'

export default async function MinSidePage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  async function updateContactEmail(formData: FormData) {
    'use server'
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const contact_email = formData.get('contact_email') as string
    await supabase
      .from('profiles')
      .update({ contact_email })
      .eq('id', user.id)

    revalidatePath('/mine')
  }

  async function deleteListing(formData: FormData) {
    'use server'
    const supabase = createClient()
    const id = formData.get('id') as string
    await supabase.from('listings').delete().eq('id', id)
    revalidatePath('/mine')
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Min side</h1>

      <section className="mb-8 rounded-lg border bg-white p-4">
        <h2 className="mb-2 font-medium">Kontakt-e-post (vises på dine annonser)</h2>
        <form action={updateContactEmail} className="flex max-w-sm gap-2">
          <input
            type="email"
            name="contact_email"
            defaultValue={profile?.contact_email ?? ''}
            placeholder="din@epost.no"
            className="flex-1 rounded-md border px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-md bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand-dark"
          >
            Lagre
          </button>
        </form>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-medium">Mine annonser</h2>
          <Link href="/sell" className="text-sm text-brand-dark underline">
            + Legg ut ny disk
          </Link>
        </div>

        {!listings || listings.length === 0 ? (
          <p className="text-gray-500">Du har ikke lagt ut noen disker ennå.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {(listings as Listing[]).map((listing) => (
              <div
                key={listing.id}
                className="flex items-center justify-between rounded-lg border bg-white p-3"
              >
                <div>
                  <Link href={`/disc/${listing.id}`} className="font-medium hover:underline">
                    {listing.title}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {listing.status} ·{' '}
                    {listing.price_nok ? `${listing.price_nok} kr` : 'Pris på forespørsel'}
                  </p>
                </div>

                <form action={deleteListing}>
                  <input type="hidden" name="id" value={listing.id} />
                  <button type="submit" className="text-sm text-red-600 hover:underline">
                    Slett
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
