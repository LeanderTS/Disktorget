import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center">
        <img src="/Disktorget Logo.png" alt="Disktorget" className="h-24 w-auto mx-auto" />
        <p className="mt-2 flex justify-center gap-4 text-sm text-gray-600">
          <a href="mailto:Leosorte87@gmail.com" className="text-brand-dark underline hover:text-brand">
            Kontakt
          </a>
          <a href="/Disktorget_Bruksvilkar.pdf" target="_blank" rel="noopener noreferrer" className="text-brand-dark underline hover:text-brand">
            Bruksvilkår
          </a>
        </p>
      </div>
    </footer>
  )
}
