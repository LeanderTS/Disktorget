import { DISC_TYPE_LABELS, CONDITION_LABELS, DISC_BRANDS } from '@/lib/types'

// Ren HTML <form method="get"> - trenger ikke JavaScript.
// Vises som en vertikal filter-kolonne (sidebar).
export default function SearchFilters({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  return (
    <form
      method="get"
      className="flex flex-col gap-3 rounded-lg border bg-white p-4"
    >
      <input
        type="text"
        name="q"
        placeholder="Søk (merke, modell, tittel)"
        defaultValue={searchParams.q ?? ''}
        className="w-full rounded-md border px-3 py-2 text-sm"
      />

      <select
        name="brand"
        defaultValue={searchParams.brand ?? ''}
        className="w-full rounded-md border px-3 py-2 text-sm"
      >
        <option value="">Alle merker</option>
        {DISC_BRANDS.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>

      <select
        name="disc_type"
        defaultValue={searchParams.disc_type ?? ''}
        className="w-full rounded-md border px-3 py-2 text-sm"
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
        className="w-full rounded-md border px-3 py-2 text-sm"
      >
        <option value="">Alle tilstander</option>
        {Object.entries(CONDITION_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="location"
        placeholder="Sted"
        defaultValue={searchParams.location ?? ''}
        className="w-full rounded-md border px-3 py-2 text-sm"
      />

      <input
        type="number"
        name="max_price"
        placeholder="Maks pris (kr)"
        defaultValue={searchParams.max_price ?? ''}
        className="w-full rounded-md border px-3 py-2 text-sm"
      />

      <button
        type="submit"
        className="w-full rounded-md bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand-dark"
      >
        Søk
      </button>
    </form>
  )
}
