"use client"

import Image from "next/image"
import { useState } from "react"
import { Menu, X, Star, Handshake, Lock } from "lucide-react"

const TRUST_BADGES = [
  {
    icon: Star,
    title: "10 Yıllık Sektör Tecrübesi",
    subtitle: "Yüzlerce mutlu müşteri, sıfır hasar.",
  },
  {
    icon: Handshake,
    title: "Saygılı ve Profesyonel Kadro",
    subtitle: "Eğitimli ve güler yüzlü ekipler.",
  },
  {
    icon: Lock,
    title: "Sabit Fiyat Garantisi",
    subtitle: "Sürpriz maliyet, kapıda fiyat değişimi yok.",
  },
]

const NAV_LINKS = [
  { label: "Nasıl Çalışır", href: "#hesaplama" },
  { label: "Fiyat Hesapla", href: "#hesaplama" },
  { label: "İletişim", href: "#hesaplama" },
]

export default function SiteHero() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="relative overflow-hidden">
      {/* NAVBAR */}
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <a href="#" className="text-2xl font-extrabold tracking-tight text-primary">
          Kolay<span className="text-brand">Taşın</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition hover:text-primary"
            >
              {l.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-primary transition hover:bg-muted md:hidden"
          aria-label="Menüyü aç"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="mx-auto w-full max-w-6xl px-5 pb-2 md:hidden sm:px-8">
          <div className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-2 shadow-sm">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* HERO */}
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pb-12 pt-8 sm:px-8 lg:grid-cols-2 lg:gap-8 lg:pb-20 lg:pt-12">
        {/* Left column */}
        <div className="flex flex-col items-start">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground">
            İstanbul İçi Parça Nakliye
          </span>

          <h1 className="text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-primary sm:text-5xl">
            İstanbul İçi Parça Nakliye: Fiyatı Gör, Sürprizlerle Karşılaşma
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Taşınma günü kapıda değişen fiyatlardan sıkılmadınız mı? Gelişmiş altyapımızla
            eşyanıza ve mesafenize göre ön fiyatı anında hesaplayın, fotoğrafınızla fiyatı
            sabitleyip güvenle taşının.
          </p>

          {/* Trust badges */}
          <ul className="mt-7 grid w-full gap-x-6 gap-y-4 sm:grid-cols-3">
            {TRUST_BADGES.map((b) => {
              const Icon = b.icon
              return (
                <li key={b.title} className="flex flex-col gap-1.5">
                  <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Icon className="h-4 w-4 shrink-0 text-brand" />
                    {b.title}
                  </span>
                  <span className="text-pretty text-xs leading-relaxed text-muted-foreground">
                    {b.subtitle}
                  </span>
                </li>
              )
            })}
          </ul>

          <a
            href="#hesaplama"
            className="mt-7 inline-flex items-center justify-center rounded-2xl bg-brand px-7 py-4 text-base font-bold text-brand-foreground shadow-lg shadow-brand/30 transition hover:bg-brand-hover hover:shadow-brand/40 active:scale-[0.99]"
          >
            Hemen Net Fiyatını Gör
          </a>
        </div>

        {/* Right column */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 -z-10 mx-auto my-auto h-[80%] w-[80%] rounded-full bg-accent/60 blur-2xl" />
          <div className="relative w-full max-w-md">
            <Image
              src="/hero-mover.png"
              alt="Telefonuyla taşıma fiyatı hesaplayan kişi illüstrasyonu"
              width={520}
              height={520}
              priority
              className="h-auto w-full"
            />
            {/* Speech bubble */}
            <div className="absolute right-2 top-6 max-w-[60%] rounded-2xl rounded-br-sm bg-card px-4 py-3 shadow-xl ring-1 ring-border sm:right-6">
              <p className="text-sm font-semibold text-foreground">
                {'"Bir buzdolabı gidecek..."'}
              </p>
              <span className="absolute -bottom-2 right-6 h-4 w-4 rotate-45 bg-card ring-1 ring-border" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
