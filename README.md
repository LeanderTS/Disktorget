# Disktorget

Markedsplass for kjøp, salg og bytte av diskgolfutstyr (primært disker).
Bygget med **Next.js (App Router)**, **Tailwind CSS** og **Supabase**
(database, autentisering og bildelagring). Klar for å deployes på **Vercel**.

## Funksjonalitet i denne versjonen

- Brukerregistrering / innlogging med e-post og passord (Supabase Auth)
- Legge ut disker til salgs/bytte med: merke, modell, plasttype, farge,
  type disk (putter/midrange/fairway/distance), tilstand, vekt, pris,
  beskrivelse og bilder
- Søk og filtrering på forsiden (fritekst, merke, type, tilstand, salg/bytte, maks pris)
- Detaljside per disk med kontaktknapp til selger (mailto)
- "Min side": egne annonser (slette annonser), sette kontakt-e-post

## 1. Opprett Supabase-prosjekt

1. Gå til https://supabase.com og opprett et nytt prosjekt.
2. Åpne **SQL Editor** i Supabase-dashbordet og kjør hele innholdet i
   [`supabase/schema.sql`](./supabase/schema.sql). Dette oppretter:
   - `profiles`-tabell (koblet til `auth.users`)
   - `listings`-tabell (annonsene/diskene)
   - Row Level Security-policyer (brukere kan bare endre/slette sine egne annonser)
   - Storage-bucket `disc-images` for bilder
3. Under **Authentication -> URL Configuration**: sett "Site URL" til domenet
   ditt (f.eks. `https://disktorget.no`) og legg til
   `https://disktorget.no/auth/callback` (og evt. `http://localhost:3000/auth/callback`
   for lokal utvikling) under "Redirect URLs".
4. Under **Project Settings -> API** finner du `Project URL` og `anon public key`
   som du trenger i steg 2.

## 2. Sett opp miljøvariabler lokalt

```bash
cp .env.local.example .env.local
```

Fyll inn `NEXT_PUBLIC_SUPABASE_URL` og `NEXT_PUBLIC_SUPABASE_ANON_KEY` fra Supabase-prosjektet.

## 3. Kjør lokalt

```bash
npm install
npm run dev
```

Åpne http://localhost:3000

## 4. Deploy til Vercel

1. Push prosjektet til et Git-repo (GitHub/GitLab/Bitbucket).
2. Gå til https://vercel.com/new og importer repoet.
3. Legg inn de samme miljøvariablene (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`) under **Project Settings -> Environment Variables**.
4. Deploy. Koble deretter på domenet `disktorget.no` under **Project Settings -> Domains**
   og pek DNS-en for domenet (hos din domeneleverandør) til Vercel slik det
   instrueres i dashbordet der.

## Naturlige neste steg (ikke bygget ennå)

- Meldingssystem mellom kjøper/selger i appen (i stedet for kun mailto)
- Redigering av eksisterende annonse (i dag må man slette og legge ut på nytt)
- Paginering / "last flere" på forsiden ved mange annonser
- Favoritter / lagrede søk
- Rapportering av annonser og enkel moderasjon
- Bildebeskjæring / komprimering før opplasting
