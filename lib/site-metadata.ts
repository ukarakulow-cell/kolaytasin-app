import type { Metadata } from 'next'

export const siteMetadata: Metadata = {
  metadataBase: new URL('https://www.netfiyatal.com'),
  title: 'Net Fiyat Al - Anında Nakliye Fiyatı Hesapla',
  description:
    'Sürpriz maliyet olmadan net fiyat alın! Net Fiyat Al ile İstanbul içi nakliye ve parça eşya taşıma fiyatınızı saniyeler içinde hesaplayın. Fotoğrafınızı gönderin, fiyatı sabitleyin. netfiyatal.com',
  openGraph: {
    title: 'Net Fiyat Al - Anında Nakliye Fiyatı Hesapla',
    description:
      'Sürpriz maliyet olmadan net fiyat alın! İstanbul içi nakliye ve parça eşya taşıma fiyatınızı saniyeler içinde hesaplayın.',
    url: 'https://www.netfiyatal.com',
    siteName: 'Net Fiyat Al',
    locale: 'tr_TR',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}
