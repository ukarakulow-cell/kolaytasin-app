"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Truck,
  MapPin,
  ArrowRight,
  Boxes,
  Building2,
  Lock,
  Phone,
  Check,
  CalendarDays,
  FileText,
  Eye,
  Package,
} from "lucide-react"
import { istanbulData } from "@/istanbulData.js"

type AccessKey = "asansor" | "merdiven" | "dis_cephe"
type Service = "parca" | "komple"

const DISTRICTS: Record<string, { yaka: string; mahalleler: string[] }> = istanbulData
const DISTRICT_NAMES = Object.keys(DISTRICTS).sort((a, b) => a.localeCompare(b, "tr"))

// Komple ev — base prices per home type
const LOAD_TYPES: { key: string; label: string; base: number }[] = [
  { key: "1+0", label: "1+0 Stüdyo Ev", base: 14000 },
  { key: "1+1", label: "1+1 Ev", base: 18000 },
  { key: "2+1", label: "2+1 Ev", base: 25000 },
  { key: "3+1", label: "3+1 Ev", base: 32000 },
  { key: "4+1", label: "4+1 Ev", base: 42000 },
  { key: "5+1", label: "5+1 Ev", base: 55000 },
]

// Parça eşya — load types with multipliers
const PARCA_LOAD_TYPES: { key: string; label: string; mult: number }[] = [
  { key: "koli", label: "Sadece Koli / Valizler", mult: 1.0 },
  { key: "beyaz", label: "Beyaz Eşya", mult: 1.2 },
  { key: "mobilya", label: "Tekil Büyük Mobilya", mult: 1.4 },
]

const ACCESS_OPTIONS: { key: AccessKey; label: string }[] = [
  { key: "asansor", label: "Bina asansörü kullanılacak" },
  { key: "merdiven", label: "Merdiven kullanılacak" },
  { key: "dis_cephe", label: "Dış Cephe Asansörü Kurulmasını İstiyorum" },
]

// Parça mode hides the external-lift option
const PARCA_ACCESS_OPTIONS = ACCESS_OPTIONS.filter((o) => o.key !== "dis_cephe")

const PACKAGING_OPTIONS: { key: string; label: string; price: number }[] = [
  {
    key: "p1",
    label:
      "✋ Ben mutfak eşyalarını ve kolileme işlerini yaptım. Firma yalnızca mobilya ve beyaz eşyaları ambalajlasın.",
    price: 0,
  },
  {
    key: "p2",
    label: "📦 Tüm paketleme, koli, montaj ve demontaj işlerini firma yapsın.",
    price: 5000,
  },
  {
    key: "p3",
    label: "🧰 Tüm paketleme, koli, montaj ve demontaj işlerini ben yaparım.",
    price: -2000,
  },
  {
    key: "p4",
    label: "📦🏠 Eşyalar depoda kalacak, bunun için özel bir paketleme istiyorum.",
    price: 5000,
  },
]

const WHATSAPP_NUMBER = "905515076204"

function accessLabel(key: AccessKey): string {
  return ACCESS_OPTIONS.find((o) => o.key === key)?.label ?? "—"
}

function toISODate(d: Date): string {
  const tz = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - tz).toISOString().slice(0, 10)
}

export default function MovingCalculator() {
  const [service, setService] = useState<Service>("parca")

  // Cascading route selections (shared)
  const [originDistrict, setOriginDistrict] = useState("")
  const [originHood, setOriginHood] = useState("")
  const [destDistrict, setDestDistrict] = useState("")
  const [destHood, setDestHood] = useState("")

  const [movingDate, setMovingDate] = useState("")

  // Load types per mode
  const [loadType, setLoadType] = useState("1+0") // komple
  const [parcaLoad, setParcaLoad] = useState("koli") // parça

  const [details, setDetails] = useState("")

  const [originFloor, setOriginFloor] = useState(1)
  const [destFloor, setDestFloor] = useState(1)
  const [originAccess, setOriginAccess] = useState<AccessKey>("asansor")
  const [destAccess, setDestAccess] = useState<AccessKey>("asansor")

  // Komple packaging (4 cards)
  const [packaging, setPackaging] = useState("p1")
  // Parça toggle services
  const [parcaPackaging, setParcaPackaging] = useState(false)
  const [parcaAssembly, setParcaAssembly] = useState(false)

  const [longWalk, setLongWalk] = useState(false)

  const [price, setPrice] = useState(0)
  const [displayPrice, setDisplayPrice] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [hasRevealedOnce, setHasRevealedOnce] = useState(false)

  const isParca = service === "parca"
  // Parça matrix only appears once "Paketleme ve Taşıma" is enabled
  const showMatrix = isParca ? parcaPackaging : true
  const accessOptions = isParca ? PARCA_ACCESS_OPTIONS : ACCESS_OPTIONS

  // Clear the external-lift selection when entering Parça mode
  useEffect(() => {
    if (isParca) {
      setOriginAccess((a) => (a === "dis_cephe" ? "asansor" : a))
      setDestAccess((a) => (a === "dis_cephe" ? "asansor" : a))
    }
  }, [isParca])

  // Hide the price card whenever ANY form input changes; the user must
  // click the button again to recalculate. The price never updates live.
  useEffect(() => {
    setRevealed(false)
  }, [
    service,
    originDistrict,
    originHood,
    destDistrict,
    destHood,
    movingDate,
    loadType,
    parcaLoad,
    details,
    originFloor,
    destFloor,
    originAccess,
    destAccess,
    packaging,
    parcaPackaging,
    parcaAssembly,
    longWalk,
  ])

  // Date bounds: today .. today + 21 days (3 weeks)
  const { todayISO, maxISO } = useMemo(() => {
    const today = new Date()
    const max = new Date()
    max.setDate(today.getDate() + 21)
    return { todayISO: toISODate(today), maxISO: toISODate(max) }
  }, [])

  // Invisible pricing algorithm
  useEffect(() => {
    const sameYaka =
      originDistrict && destDistrict
        ? DISTRICTS[originDistrict].yaka === DISTRICTS[destDistrict].yaka
        : true
    const sameMahalle =
      originDistrict && destDistrict
        ? originDistrict === destDistrict && !!originHood && originHood === destHood
        : false

    let total = 0

    if (isParca) {
      // ---- PARÇA EŞYA PRICING ----
      // Base route price
      if (sameMahalle) {
        total = 2500 // same district AND same neighborhood
      } else if (originDistrict && destDistrict && !sameYaka) {
        total = 5000 // cross-continent
      } else {
        total = 3000 // same yaka, different district/neighborhood (default)
      }

      // Toggle services: either or both toggles add a single flat +2500 (no double charge)
      if (parcaPackaging || parcaAssembly) total += 2500

      // Floor penalty only when matrix is visible (Paketleme on)
      if (parcaPackaging) {
        if (originAccess === "merdiven" && originFloor > 2) total += (originFloor - 2) * 500
        if (destAccess === "merdiven" && destFloor > 2) total += (destFloor - 2) * 500
      }

      // Long-walk surcharge
      if (longWalk) total += 600
    } else {
      // ---- KOMPLE EV PRICING (unchanged) ----
      const basePrice = LOAD_TYPES.find((l) => l.key === loadType)?.base ?? 0
      total = basePrice

      if (originDistrict && destDistrict) {
        if (!sameYaka) total += 5000
        else if (sameMahalle) total -= 2000
      }

      const sidePenalty = (access: AccessKey, floor: number) => {
        let p = 0
        if (access === "merdiven" && floor >= 3) p += 5000
        if (access === "dis_cephe") p += 5000
        return p
      }
      total += sidePenalty(originAccess, originFloor)
      total += sidePenalty(destAccess, destFloor)

      total += PACKAGING_OPTIONS.find((p) => p.key === packaging)?.price ?? 0

      if (longWalk) total += 3000
    }

    setPrice(Math.max(0, Math.round(total)))
  }, [
    isParca,
    loadType,
    parcaLoad,
    originDistrict,
    destDistrict,
    originHood,
    destHood,
    originAccess,
    destAccess,
    originFloor,
    destFloor,
    packaging,
    parcaPackaging,
    parcaAssembly,
    longWalk,
  ])

  // Animate the price counter
  useEffect(() => {
    const start = displayPrice
    const end = price
    if (start === end) return
    const duration = 500
    const startTime = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplayPrice(Math.round(start + (end - start) * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price])

  const whatsappUrl = useMemo(() => {
    const loadLabel = isParca
      ? PARCA_LOAD_TYPES.find((l) => l.key === parcaLoad)?.label ?? "—"
      : LOAD_TYPES.find((l) => l.key === loadType)?.label ?? "—"
    const yn = (v: boolean) => (v ? "Evet" : "Hayır")
    const dash = (v: string) => (v && v.trim() ? v.trim() : "—")
    const lines: string[] = ["*🚚 KolayTaşın — Taşıma Talebi*", ""]

    // Mode
    lines.push(`*📋 Hizmet Türü:* ${isParca ? "Parça Eşya Taşıma" : "Komple Ev Taşıma"}`)
    lines.push(`*📅 Taşınma Tarihi:* ${dash(movingDate)}`)
    lines.push("")

    // Route
    lines.push("*📍 Güzergah*")
    lines.push(`• Nereden: ${dash(originDistrict)} / ${dash(originHood)}`)
    lines.push(`• Nereye: ${dash(destDistrict)} / ${dash(destHood)}`)
    lines.push("")

    // Load / item details
    lines.push(`*📦 ${isParca ? "Yük Tipi" : "Ev Tipi"}:* ${loadLabel}`)
    if (details.trim()) {
      lines.push(`*📝 Detaylı Bilgi:* ${details.trim()}`)
    }
    lines.push("")

    // Floor matrix
    if (showMatrix) {
      lines.push("*🏢 Kat & Erişim Bilgileri*")
      lines.push(`• Yükleme Katı: ${originFloor} — Asansör: ${accessLabel(originAccess)}`)
      lines.push(`• Teslim Katı: ${destFloor} — Asansör: ${accessLabel(destAccess)}`)
      lines.push("")
    }

    // Services / toggles / checkboxes
    lines.push("*🛠️ Ek Hizmetler*")
    if (isParca) {
      lines.push(`• Paketleme ve Taşıma Hizmeti: ${yn(parcaPackaging)}`)
      lines.push(`• Montaj ve Kurulum Hizmeti: ${yn(parcaAssembly)}`)
    } else {
      const packLabel = PACKAGING_OPTIONS.find((p) => p.key === packaging)?.label ?? "—"
      lines.push(`• Paketleme Tercihi: ${packLabel}`)
    }
    lines.push(`• Uzun Taşıma Mesafesi (30m+): ${yn(longWalk)}`)
    lines.push("")

    // Final price
    lines.push(`*💰 Sizin Fiyatınız:* ${price.toLocaleString("tr-TR")} TL`)
    lines.push("")
    lines.push("🔒 Sabit fiyat garantisi için fotoğrafları gönderiyorum.")

    const payload = lines.join("\n")
    return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(payload)}`
  }, [
    isParca,
    movingDate,
    originDistrict,
    originHood,
    destDistrict,
    destHood,
    loadType,
    parcaLoad,
    showMatrix,
    originFloor,
    originAccess,
    destFloor,
    destAccess,
    packaging,
    parcaPackaging,
    parcaAssembly,
    longWalk,
    details,
    price,
  ])

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Header */}
      <header className="mb-6 text-center sm:mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <Truck className="h-4 w-4" />
          Anlık Taşıma Fiyatlandırma
        </div>
        <h2 className="text-balance text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Akıllı Fiyat Hesaplama Modülü
        </h2>
        <p className="mx-auto mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          Birkaç saniyede taşıma ihtiyacınızı belirtin, anlık ön fiyatınızı görün.
        </p>
      </header>

      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-slate-200/60">
        <div className="space-y-8 p-5 sm:p-8">
          {/* Service switcher */}
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1.5">
            <SwitchButton
              active={isParca}
              onClick={() => setService("parca")}
              label="📦 Parça Eşya Taşıma"
            />
            <SwitchButton
              active={!isParca}
              onClick={() => setService("komple")}
              label="🚛 Komple Ev Taşıma"
            />
          </div>

          {/* Date picker (shared) */}
          <Section title="Ne zaman taşınmak istiyorsunuz?" icon={<CalendarDays className="h-4 w-4" />}>
            <Field label="Taşınma Tarihi (en geç 3 hafta içinde)">
              <input
                type="date"
                value={movingDate}
                min={todayISO}
                max={maxISO}
                onChange={(e) => setMovingDate(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </Field>
          </Section>

          {/* Route — cascading dropdowns (shared) */}
          <Section title="Rota Bilgileri" icon={<MapPin className="h-4 w-4" />}>
            <div className="space-y-4">
              <RouteRow
                heading="Nereden"
                district={originDistrict}
                hood={originHood}
                onDistrictChange={(v) => {
                  setOriginDistrict(v)
                  setOriginHood("")
                }}
                onHoodChange={setOriginHood}
              />
              <RouteRow
                heading="Nereye"
                district={destDistrict}
                hood={destHood}
                onDistrictChange={(v) => {
                  setDestDistrict(v)
                  setDestHood("")
                }}
                onHoodChange={setDestHood}
              />
            </div>
          </Section>

          {/* Load type (mode dependent) */}
          <Section title={isParca ? "Yük Tipi" : "Ev Tipi"} icon={<Boxes className="h-4 w-4" />}>
            <Field label={isParca ? "Taşınacak Yük Tipi" : "Taşınacak Ev Tipi"}>
              <div className="relative">
                {isParca ? (
                  <select
                    value={parcaLoad}
                    onChange={(e) => setParcaLoad(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-input bg-background py-2.5 pl-3.5 pr-9 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {PARCA_LOAD_TYPES.map((o) => (
                      <option key={o.key} value={o.key}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={loadType}
                    onChange={(e) => setLoadType(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-input bg-background py-2.5 pl-3.5 pr-9 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {LOAD_TYPES.map((o) => (
                      <option key={o.key} value={o.key}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                )}
                <ArrowRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-muted-foreground" />
              </div>
            </Field>
          </Section>

          {/* Parça: toggle services — placed above the floor matrix */}
          {isParca && (
            <Section title="Ek Hizmetler" icon={<Package className="h-4 w-4" />}>
              <div className="space-y-2.5">
                <ToggleSwitch
                  checked={parcaPackaging}
                  onChange={setParcaPackaging}
                  label="Paketleme ve Taşıma hizmeti istiyorum"
                />
                <ToggleSwitch
                  checked={parcaAssembly}
                  onChange={setParcaAssembly}
                  label="Montaj ve kurulum hizmeti istiyorum"
                />
              </div>
            </Section>
          )}

          {/* Floor & access matrix — komple always; parça only when Paketleme on */}
          {showMatrix && (
            <Section title="Kat & Erişim Bilgileri" icon={<Building2 className="h-4 w-4" />}>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <AccessColumn
                  title="Çıkış Noktası (Nereden)"
                  floor={originFloor}
                  onFloorChange={setOriginFloor}
                  access={originAccess}
                  onAccessChange={setOriginAccess}
                  options={accessOptions}
                />
                <AccessColumn
                  title="Varış Noktası (Nereye)"
                  floor={destFloor}
                  onFloorChange={setDestFloor}
                  access={destAccess}
                  onAccessChange={setDestAccess}
                  options={accessOptions}
                />
              </div>
            </Section>
          )}

          {/* Komple: packaging cards */}
          {!isParca && (
            <Section title="Eşya Paketlemeyi Kim Yapsın?" icon={<FileText className="h-4 w-4" />}>
              <div className="space-y-2.5">
                {PACKAGING_OPTIONS.map((o) => (
                  <RadioBlock
                    key={o.key}
                    active={packaging === o.key}
                    onClick={() => setPackaging(o.key)}
                    label={o.label}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Komple: detailed info */}
          {!isParca && (
            <Section title="Eşya Hakkında Detaylı Bilgi Verin" icon={<FileText className="h-4 w-4" />}>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                placeholder="Eşyalarınızı kısaca anlatın..."
                className="w-full resize-y rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm leading-relaxed outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs italic leading-relaxed text-muted-foreground">
                örn. Salon takımı, yatak odası ve beyaz eşyalar var. Asansör kullanılabilir. Montaj ve demontaj yapılacak.
              </p>
            </Section>
          )}

          {/* Extra (shared) */}
          <Section title="Ek Durumlar">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-input bg-background p-3.5 transition hover:border-primary/40">
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                  longWalk ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40 bg-background"
                }`}
              >
                {longWalk && <Check className="h-3.5 w-3.5" />}
              </span>
              <input
                type="checkbox"
                checked={longWalk}
                onChange={(e) => setLongWalk(e.target.checked)}
                className="sr-only"
              />
              <span className="text-sm leading-relaxed text-foreground">
                Kamyon ile evin girişi arasında 30 metreden fazla eşya taşıma mesafesi var.
              </span>
            </label>
          </Section>

          {/* Reveal button (shown only while result is hidden) */}
          {!revealed && (
            <div className="flex flex-col gap-2">
              {movingDate && (
                <p className="text-center text-sm font-medium text-orange-600">
                  ⏳ Dikkat: Seçtiğiniz tarih için bölgenizde sadece 2 müsait aracımız kalmıştır.
                </p>
              )}
              <button
                type="button"
                onClick={() => {
                  setRevealed(true)
                  setHasRevealedOnce(true)
                }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-4 text-base font-bold text-brand-foreground shadow-lg shadow-brand/30 transition hover:bg-brand-hover active:scale-[0.99]"
              >
                <Eye className="h-5 w-5" />
                {hasRevealedOnce ? "Fiyatı Güncelle" : "Fiyatını Gör"}
              </button>
              <p className="text-center text-xs text-slate-500">
                📈 Bu ay İstanbul&apos;da 142 başarılı taşıma gerçekleştirdik.
              </p>
            </div>
          )}
        </div>

        {/* Final price card */}
        {revealed && (
          <div className="border-t border-border bg-background px-5 py-7 sm:px-8">
            <div className="flex flex-col items-center text-center">
              <p className="text-sm text-muted-foreground">
                Piyasa Ortalaması:{" "}
                <span className="line-through">
                  {Math.round(displayPrice * 1.5).toLocaleString("tr-TR")} TL
                </span>
              </p>
              <span className="mt-2 text-sm font-semibold text-primary/70">Sizin Fiyatınız</span>
              <div className="mt-0.5 flex items-baseline gap-2 font-mono text-5xl font-bold tracking-tight tabular-nums text-primary sm:text-6xl">
                {displayPrice.toLocaleString("tr-TR")}
                <span className="text-2xl font-semibold text-primary sm:text-3xl">TL</span>
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-pretty text-sm text-muted-foreground">
                <Lock className="h-4 w-4 text-brand" />
                Bu fiyatı sabitlemek için WhatsApp&apos;tan fotoğraf gönderiniz.
              </p>
              <p className="mt-3 max-w-md text-pretty text-sm italic leading-relaxed text-muted-foreground">
                💬 Operasyon Yöneticisi Uğur ile hemen görüşün. Fotoğrafınızı gönderin, bu
                avantajlı fiyatı saniyeler içinde sabitleyelim.
              </p>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-4 text-base font-bold text-brand-foreground shadow-lg shadow-brand/30 transition hover:bg-brand-hover active:scale-[0.99]"
              >
                <Phone className="h-5 w-5" />
                🟢 WHATSAPP İLE FİYATI SABİTLE VE ARAÇ ÇAĞIR
              </a>
            </div>
          </div>
        )}
      </div>

      <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
        Gösterilen tutar tahmini bir ön fiyattır. Kesin fiyat eşya detaylarına göre belirlenir.
      </p>
    </div>
  )
}

function SwitchButton({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-card text-primary shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  )
}

function RouteRow({
  heading,
  district,
  hood,
  onDistrictChange,
  onHoodChange,
}: {
  heading: string
  district: string
  hood: string
  onDistrictChange: (v: string) => void
  onHoodChange: (v: string) => void
}) {
  const mahalleler = district ? DISTRICTS[district]?.mahalleler ?? [] : []
  return (
    <div className="rounded-2xl border border-border bg-muted/40 p-4">
      <h3 className="mb-3 text-sm font-semibold text-foreground">{heading}</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="İlçe">
          <div className="relative">
            <select
              value={district}
              onChange={(e) => onDistrictChange(e.target.value)}
              className="w-full appearance-none rounded-xl border border-input bg-background py-2.5 pl-3.5 pr-9 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">İlçe seçiniz</option>
              {DISTRICT_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <ArrowRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-muted-foreground" />
          </div>
        </Field>
        <Field label="Mahalle">
          <div className="relative">
            <select
              value={hood}
              disabled={!district}
              onChange={(e) => onHoodChange(e.target.value)}
              className="w-full appearance-none rounded-xl border border-input bg-background py-2.5 pl-3.5 pr-9 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">{district ? "Mahalle seçiniz" : "Önce ilçe seçin"}</option>
              {mahalleler.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <ArrowRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-muted-foreground" />
          </div>
        </Field>
      </div>
    </div>
  )
}

function Section({
  title,
  icon,
  children,
}: {
  title?: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      {title && (
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          {icon && <span className="text-primary">{icon}</span>}
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}

function AccessColumn({
  title,
  floor,
  onFloorChange,
  access,
  onAccessChange,
  options,
}: {
  title: string
  floor: number
  onFloorChange: (n: number) => void
  access: AccessKey
  onAccessChange: (k: AccessKey) => void
  options: { key: AccessKey; label: string }[]
}) {
  return (
    <div className="rounded-2xl border border-border bg-muted/40 p-4">
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      <Field label="Kat">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onFloorChange(Math.max(0, floor - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-input bg-background text-lg font-semibold text-foreground transition hover:border-primary/50"
            aria-label="Kat azalt"
          >
            −
          </button>
          <input
            type="number"
            min={0}
            value={floor}
            onChange={(e) => onFloorChange(Math.max(0, Number(e.target.value) || 0))}
            className="h-9 w-full rounded-lg border border-input bg-background text-center text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="button"
            onClick={() => onFloorChange(floor + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-input bg-background text-lg font-semibold text-foreground transition hover:border-primary/50"
            aria-label="Kat artır"
          >
            +
          </button>
        </div>
      </Field>
      <div className="mt-3 space-y-2">
        {options.map((o) => (
          <RadioBlock
            key={o.key}
            active={access === o.key}
            onClick={() => onAccessChange(o.key)}
            label={o.label}
            compact
          />
        ))}
      </div>
    </div>
  )
}

function RadioBlock({
  active,
  onClick,
  label,
  compact,
}: {
  active: boolean
  onClick: () => void
  label: string
  compact?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-xl border text-left transition ${
        compact ? "p-2.5" : "p-3.5"
      } ${
        active
          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
          : "border-input bg-background hover:border-primary/40"
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
          active ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
        }`}
      >
        {active && <span className="h-2 w-2 rounded-full bg-primary-foreground" />}
      </span>
      <span className={`leading-relaxed text-foreground ${compact ? "text-xs" : "text-sm"}`}>
        {label}
      </span>
    </button>
  )
}

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition ${
        checked
          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
          : "border-input bg-background hover:border-primary/40"
      }`}
    >
      <span className="text-sm font-medium leading-relaxed text-foreground">{label}</span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-brand" : "bg-muted-foreground/30"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow-sm transition-all ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  )
}
