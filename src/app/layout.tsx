import './globals.css'
import { Providers } from '@/contexts/providers'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Solo Founder System',
  description: 'Level up your founder journey with gamified habits and achievements.'
}

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  themeColor: '#000000'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 