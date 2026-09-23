import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabaseAdmin'

function dateNDaysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

function toDateKey(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default async function AdminStatistikkPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.id !== process.env.ADMIN_USER_ID) {
    redirect('/')
  }

  const admin = createAdminClient()

  const since30 = dateNDaysAgo(29)
  const since7 = dateNDaysAgo(6)

  const [
    { count: totalUsers },
    { count: totalListings },
    { count: activeListings },
    { count: soldListings },
    { data: newUsers30 },
    { data: visits30 },
  ] = await Promise.all([
    admin.from('profiles').select('*', { count: 'exact', head: true }),
    admin.from('listings').select('*', { count: 'exact', head: true }),
    admin.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'aktiv'),
    admin.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'solgt'),
    admin.from('profiles').select('created_at').gte('created_at', since30.toISOString()),
    admin.from('site_visits').select('visitor_id, visited_date').gte('visited_date', toDateKey(since30)),
  ])

  const days: string[] = []
  for (let i = 13; i >= 0; i--) {
    days.push(toDateKey(dateNDaysAgo(i)))
  }

  const registreringerPerDag: Record<string, number> = {}
  for (const u of newUsers30 ?? []) {
    const day = u.created_at.slice(0, 10)
    registreringerPerDag[day] = (registreringerPerDag[day] ?? 0) + 1
  }

  const besokendePerDag: Record<string, Set<string>> = {}
  for (const v of visits30 ?? []) {
    const day = v.visited_date as string
    if (!besokendePerDag[day]) besokendePerDag[day] = new Set()
    besokendePerDag[day].add(v.visitor_id)
  }

  const idagKey = toDateKey(new Date())
  const besokendeIdag = besokendePerDag[idagKey]?.size ?? 0

  const since7Key = toDateKey(since7)

  const registreringer7 = Object.entries(registreringerPerDag)
    .filter(([day]) => day >= since7Key)
    .reduce((sum, [, n]) => sum + n, 0)

  const besokende7 = Object.entries(besokendePerDag)
    .filter(([day]) => day >= since7Key)
    .reduce((sum, [, set]) => sum + set.size, 0)

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Statistikk (admin)</h1>
        <Link href="/admin/images" className="text-sm text-brand hover:underline">
          Til bildekomprimering →
        </Link>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Brukere totalt" value={totalUsers ?? 0} />
        <StatCard label="Annonser totalt" value={totalListings ?? 0} />
        <StatCard label="Aktive annonser" value={activeListings ?? 0} />
        <StatCard label="Solgte annonser" value={soldListings ?? 0} />
        <StatCard label="Besøkende i dag" value={besokendeIdag} />
        <StatCard label="Besøkende (7 dager)" value={besokende7} />
        <StatCard label="Nye registreringer (7 dager)" value={registreringer7} />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="mb-2 font-semibold">Besøkende siste 14 dager</h2>
          <table className="w-full text-sm">
            <tbody>
              {days.map((day) => (
                <tr key={day} className="border-b border-gray-100">
                  <td className="py-1 text-gray-600">{day}</td>
                  <td className="py-1 text-right font-medium">
                    {besokendePerDag[day]?.size ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h2 className="mb-2 font-semibold">Nye registreringer siste 14 dager</h2>
          <table className="w-full text-sm">
            <tbody>
              {days.map((day) => (
                <tr key={day} className="border-b border-gray-100">
                  <td className="py-1 text-gray-600">{day}</td>
                  <td className="py-1 text-right font-medium">
                    {registreringerPerDag[day] ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  )
}
