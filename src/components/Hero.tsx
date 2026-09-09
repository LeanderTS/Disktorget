export default function Hero() {
  return (
    <section className="mb-8 rounded-lg bg-brand-light px-6 py-8 text-center md:py-10">
      <h1 className="text-2xl font-bold text-brand-dark md:text-3xl">
        Kjøp, selg og bytt diskgolfutstyr
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-gray-700">
        Disktorget er markedsplassen for diskgolfspillere i Norge. Søk blant disker og samlinger
        andre har lagt ut, legg ut dine egne på under et minutt, og finn din
        favoritt på sekunder.
      </p>

      <div className="mx-auto mt-6 grid max-w-3xl gap-4 text-left sm:grid-cols-3">
        <div className="rounded-md bg-white p-4 shadow-sm">
          <div className="font-semibold text-brand-dark">1. Søk</div>
          <p className="mt-1 text-sm text-gray-600">
            Filtrer på merke, type og tilstand for å finne akkurat disken du leter etter.
          </p>
        </div>
        <div className="rounded-md bg-white p-4 shadow-sm">
          <div className="font-semibold text-brand-dark">2. Registrer deg og legg ut</div>
          <p className="mt-1 text-sm text-gray-600">
            Registrer deg, legg inn info og bilder, og publiser annonsen din på minutter.
          </p>
        </div>
        <div className="rounded-md bg-white p-4 shadow-sm">
          <div className="font-semibold text-brand-dark">3. Selg eller bytt</div>
          <p className="mt-1 text-sm text-gray-600">
            Bli kontaktet direkte av andre spillere, og avtal salg eller bytte selv.
          </p>
        </div>
      </div>
    </section>
  )
}
