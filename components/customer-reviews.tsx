import { Star } from "lucide-react"

const REVIEWS = [
  {
    quote:
      "Sitede fiyatı görüp WhatsApp'a bastım, 45 dakikada Kadıköy'den dolabımı alıp getirdiler. Sürekli arayıp teklif beklemek yok, çok net ve hızlılar.",
    author: "Burak Y.",
  },
  {
    quote:
      "Kapıya gelip 'Bu eşya büyükmüş' diyerek ekstra para istemeyen tek nakliyeci olabilir. Ekranda ne gördüysem onu ödedim. Şoför bey de çok saygılıydı.",
    author: "Merve K.",
  },
  {
    quote:
      "Letgo'dan aldığım 3'lü koltuk için çağırdım. Piyasadan uyguna verdiler ve araca yüklerken streçle sarıp çok dikkat ettiler. Tavsiye ederim.",
    author: "Caner T.",
  },
]

export default function CustomerReviews() {
  return (
    <section className="mx-auto w-full max-w-4xl">
      <h2 className="text-balance text-center text-2xl font-bold tracking-tight text-primary sm:text-3xl">
        Müşteri Yorumları
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {REVIEWS.map((r) => (
          <figure
            key={r.author}
            className="flex flex-col rounded-2xl border border-border bg-card p-5"
          >
            <div className="mb-3 flex gap-0.5" aria-label="5 üzerinden 5 yıldız">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-brand text-brand" />
              ))}
            </div>
            <blockquote className="flex-1 text-pretty text-sm leading-relaxed text-foreground">
              {`"${r.quote}"`}
            </blockquote>
            <figcaption className="mt-4 text-sm font-semibold text-primary">
              — {r.author}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
