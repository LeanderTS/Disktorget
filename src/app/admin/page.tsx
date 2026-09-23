import Link from 'next/link'

const TOOLS = [
  {
    href: '/admin/statistikk',
    title: 'Statistikk',
    description: 'Brukere, annonser, besøkende og nye registreringer.',
    icon: '📊',
  },
  {
    href: '/admin/images',
    title: 'Bildekomprimering',
    description: 'Komprimer alle bilder på siden for å redusere lagringsbruk.',
    icon: '🖼️',
  },
]

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Adminpanel</h1>
      <p className="mb-8 text-sm text-gray-500">Velg et verktøy under.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-brand hover:shadow-md"
          >
            <div className="mb-3 text-3xl">{tool.icon}</div>
            <h2 className="mb-1 font-semibold text-gray-900 group-hover:text-brand">
              {tool.title}
            </h2>
            <p className="text-sm text-gray-500">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
