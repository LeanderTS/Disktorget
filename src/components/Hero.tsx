export default function Hero() {
  return (
    <section className="mb-8 rounded-lg bg-brand-light px-6 py-8 text-center md:py-10">
      <h1 className="text-2xl font-bold text-brand-dark md:text-3xl">
        Søk - Kjøp - Selg
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
            Søk etter din favoritt disk
          </p>
        </div>
        <div className="rounded-md bg-white p-4 shadow-sm">
          <div className="font-semibold text-brand-dark">2. Registrer deg</div>
          <p className="mt-1 text-sm text-gray-600">
            Registrer deg og gjør et godt kjøp 
          </p>
        </div>
        <div className="rounded-md bg-white p-4 shadow-sm">
          <div className="font-semibold text-brand-dark">3. Selg</div>
          <p className="mt-1 text-sm text-gray-600">
            Selg - Gi diskene dine et nytt liv på minutter
          </p>
        </div>
      </div>
    </section>
  )
}
