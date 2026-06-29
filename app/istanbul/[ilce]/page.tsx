import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SiteHero from '@/components/site-hero'
import MovingCalculator from '@/components/moving-calculator'
import CustomerReviews from '@/components/customer-reviews'
import FaqSection from '@/components/faq-section'
import {
  getDistrictFromRouteParam,
  istanbulDistricts,
} from '@/lib/data/istanbul'

type PageProps = {
  params: Promise<{ ilce: string }>
}

export function generateStaticParams() {
  return istanbulDistricts.map((district) => ({
    ilce: district.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ilce } = await params
  const district = getDistrictFromRouteParam(ilce)

  if (!district) {
    return {}
  }

  return {
    title: `${district.name} Evden Eve Nakliyat Fiyatları - Net Fiyat Al`,
    description: `${district.name} bölgesi için sürpriz maliyet olmadan, anında nakliye fiyatı hesaplayın.`,
    openGraph: {
      title: `${district.name} Evden Eve Nakliyat Fiyatları - Net Fiyat Al`,
      description: `${district.name} bölgesi için sürpriz maliyet olmadan, anında nakliye fiyatı hesaplayın.`,
      url: `https://www.netfiyatal.com/istanbul/${district.slug}`,
    },
  }
}

export default async function DistrictPage({ params }: PageProps) {
  const { ilce } = await params
  const district = getDistrictFromRouteParam(ilce)

  if (!district) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <SiteHero districtName={district.name} />
      <section className="px-5 py-10 sm:px-8">
        <CustomerReviews />
      </section>
      <section id="hesaplama" className="scroll-mt-6 px-5 pb-20 pt-6 sm:px-8">
        <MovingCalculator />
      </section>
      <section className="px-5 pb-10 sm:px-8">
        <FaqSection />
      </section>
      <footer className="border-t border-border px-5 py-8 text-center text-sm text-muted-foreground sm:px-8">
        <span className="font-semibold text-primary">
          Net Fiyat <span className="text-brand">Al</span>
        </span>{' '}
        — İstanbul içi güvenli ve şeffaf nakliye.{' '}
        <a
          href="https://www.netfiyatal.com"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          netfiyatal.com
        </a>
      </footer>
    </main>
  )
}
