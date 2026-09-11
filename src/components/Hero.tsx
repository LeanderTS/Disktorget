import Link from 'next/link'

export default function Hero() {
  return (
    <>
      <section className="relative overflow-hidden rounded-b-3xl text-white">
        {/* Valgfritt bakgrunnsbilde: legg en fil ved navn "hero-bg.jpg" i public-mappen */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-emerald-900/80 to-slate-800/70" />

        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-300">
              Kjøp <span className="mx-1">•</span> Selg <span className="mx-1">•</span> Diskgolf
            </p>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              Discer som får
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-lime-300 bg-clip-text text-transparent">
                nye eventyr
              </span>
            </h1>
            <p className="mt-4 max-w-md text-slate-200">
              Disktorget er markedsplassen for diskgolfspillere i Norge. Søk blant disker
              og samlinger andre har lagt ut, eller legg ut dine egne på under et minutt.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              
                href="#sok"
                className="flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                <SearchIcon /> Søk etter disker
                <span aria-hidden>→</span>
              </a>
              <Link
                href="/sell"
                className="flex items-center gap-2 rounded-full border border-white/70 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                <PlusIcon /> Selg disk
              </Link>
            </div>
          </div>

          <div className="relative hidden h-64 md:block">
            <svg
              viewBox="0 0 400 240"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0 h-full w-full"
            >
              <path
                d="M20 190 Q140 170 220 175"
                stroke="#8BC34A"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                opacity="0.5"
              />
              <path
                d="M10 210 Q150 200 230 200"
                stroke="#8BC34A"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                opacity="0.3"
              />
              <g transform="rotate(-10 260 150)">
                <ellipse cx="260" cy="150" rx="110" ry="55" fill="#22c55e" />
                <ellipse cx="260" cy="140" rx="70" ry="30" fill="#15803d" opacity="0.5" />
              </g>
            </svg>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-14">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Slik fungerer det</h2>
          <p className="mt-2 text-gray-500">
            Enkelt, trygt og raskt - for diskgolfspillere, av diskgolfspillere.
          </p>

          <div className="mt-8 grid gap-4 text-left md:grid-cols-3">
            <StepCard
              color="bg-emerald-100 text-emerald-700"
              icon={<SearchIcon />}
              title="1. Søk"
              description="Søk etter din favorittdisk blant tusenvis av annonser."
            />
            <StepCard
              color="bg-sky-100 text-sky-700"
              icon={<TagIcon />}
              title="2. Kjøp"
              description="Finn disker du mangler, og kjøp direkte fra andre diskgolfspillere."
            />
            <StepCard
              color="bg-lime-100 text-lime-700"
              icon={<SendIcon />}
              title="3. Selg"
              description="Gi dine gamle disker et nytt liv på minutter."
            />
          </div>
        </div>
      </section>
    </>
  )
}

function StepCard({
  color,
  icon,
  title,
  description,
}: {
  color: string
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border bg-white p-4 shadow-sm">
      <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${color}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <span aria-hidden className="mt-2 text-gray-300">
        →
      </span>
    </div>
  )
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
    </svg>
  )
}

function TagIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path
        fillRule="evenodd"
        d="M5.5 3A2.5 2.5 0 003 5.5v4.586a2.5 2.5 0 00.732 1.767l6.914 6.915a2 2 0 002.828 0l4.586-4.586a2 2 0 000-2.828l-6.915-6.914A2.5 2.5 0 009.086 3H5.5zM6 8a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
    </svg>
  )
}
