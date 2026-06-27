import type { Metadata } from 'next'

export const siteMetadata: Metadata = {
  title: 'İstanbul Evden Eve Nakliyat & Parça Eşya Taşıma | Anında Net Fiyat',
  description:
    'Sürpriz maliyetlere son! İstanbul içi nakliye ve parça eşya taşıma fiyatınızı saniyeler içinde hesaplayın. Fotoğrafınızı gönderin, fiyatı sabitleyin.',
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
