import type { Metadata } from 'next';
import {Analytics} from '@vercel/analytics/react';
import './globals.css';


export const metadata: Metadata = {
  title: 'Comments section',
  description: 'Comments section project by shikot0',
  icons: [{rel: 'icon', url: './favicon.png'}],
  openGraph: {
    type: 'website',
    description: 'Comments section project by shikot0',
    siteName: 'Comments section',
    title: 'Comments section project',
    images: [{url: './og-image.png'}]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Analytics />
    </html>
  )
}
