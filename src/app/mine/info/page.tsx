import { redirect } from 'next/navigation'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import UsernameForm from '@/components/UsernameForm'

export default async function InfoPage() {
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

  async function updateContactInfo(formData: FormData) {
    'use server'
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const contact_email = formData.get('contact_email') as string
    const contact_phone = formData.get('contact_phone') as string
    const show_phone = formData.get('show_phone') === 'on'

    await supabase
      .from('profiles')
      .update({ contact_email, contact_phone, show_phone })
      .eq('id', user.id)

    revalidatePath('/mine/info')
  }

  return (
    <div className="mx-auto max-w-xl">
      <Link href="/mine" className="mb-4 inline-block text-sm text-brand-dark hover:underline">
        ← Min side
      </Link>

      <h1 className="mb-4 text-2xl font-bold">Brukerinfo</h1>

      <section className="mb-8 rounded-lg border bg-white p-4">
        <h2 className="mb-2 font-medium">Brukernavn</h2>
        <UsernameForm userId={user.id} currentUsername={profile?.username ?? null} />
      </section>

      <section className="rounded-lg border bg-white p-4">
        <h2 className="mb-2 font-medium">Kontaktinfo (vises på dine annonser)</h2>
        <form action={updateContactInfo} className="flex max-w-sm flex-col gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium">E-post</label>
            <input
              type="email"
              name="contact_email"
              defaultValue={profile?.contact_email ?? ''}
              placeholder="din@epost.no"
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Mobilnummer <span className="font-normal text-gray-400">(valgfritt)</span>
            </label>
            <input
              type="tel"
              name="contact_phone"
              defaultValue={profile?.contact_phone ?? ''}
              placeholder="+47 123 45 678"
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>

          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="show_phone"
              defaultChecked={profile?.show_phone ?? false}
              className="mt-0.5 h-4 w-4"
            />
            Vis mobilnummeret mitt offentlig på annonsene mine
          </label>
          <p className="-mt-2 text-xs text-gray-500">
            Nummeret lagres uansett, men vises kun til andre brukere hvis du krysser av her.
          </p>

          <button
            type="submit"
            className="mt-1 rounded-md bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand-dark"
          >
            Lagre
          </button>
        </form>
      </section>
    </div>
  )
}
