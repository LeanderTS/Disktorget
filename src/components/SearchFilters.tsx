import { DISC_TYPE_LABELS, CONDITION_LABELS, LISTING_TYPE_LABELS } from '@/lib/types'

// Ren HTML <form method="get"> - trenger ikke JavaScript.
// Når brukeren trykker "Søk" laster siden på nytt med filtrene som ?query-parametere,
// og page.tsx (server component) leser dem og filtrerer i Supabase-spørringen.
export default function SearchFilters({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  return (
    <form
      method="get"
      className="mb-6 grid grid-cols-2 gap-3 rounded-lg border bg-white p-4 md:grid-cols-4 lg:grid-cols-7"
    >
      <input
        type="text"
        name="q"
        placeholder="Søk (merke, modell, tittel)"
        defaultValue={searchParams.q ?? ''}
        className="col-span-2 rounded-md border px-3 py-2 text-sm lg:col-span-2"
      />

      <input
        type="text"
        name="brand"
        placeholder="Merke"
        defaultValue={searchParams.brand ?? ''}
        className="rounded-md border px-3 py-2 text-sm"
      />

      <select
        name="disc_type"
        defaultValue={searchParams.disc_type ?? ''}
        className="rounded-md border px-3 py-2 text-sm"
      >
        <option value="">Alle typer</option>
        {Object.entries(DISC_TYPE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        name="condition"
        defaultValue={searchParams.condition ?? ''}
        className="rounded-md border px-3 py-2 text-sm"
      >
        <option value="">Alle tilstander</option>
        {Object.entries(CONDITION_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        name="listing_type"
        defaultValue={searchParams.listing_type ?? ''}
        className="rounded-md border px-3 py-2 text-sm"
      >
        <option value="">Salg og bytte</option>
        {Object.entries(LISTING_TYPE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="max_price"
        placeholder="Maks pris (kr)"
        defaultValue={searchParams.max_price ?? ''}
        className="rounded-md border px-3 py-2 text-sm"
      />

      <button
        type="submit"
        className="col-span-2 rounded-md bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand-dark md:col-span-1 lg:col-span-1"
      >
        Søk
      </button>
    </form>
  )
}
