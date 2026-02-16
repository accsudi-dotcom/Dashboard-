import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'

import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Sharoobi Console',
  description: 'Enterprise Backoffice Operating System - Multi-tenant marketplace admin platform',
  generator: 'sharoobi-console',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Sharoobi Console',
    description: 'Enterprise Backoffice Operating System',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1420' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Theme setup
                const theme = localStorage.getItem('theme') || 'dark';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
                
                // Locale and RTL setup
                const locale = localStorage.getItem('locale') || 'en';
                document.documentElement.setAttribute('lang', locale);
                if (locale === 'ar') {
                  document.documentElement.setAttribute('dir', 'rtl');
                  document.documentElement.classList.add('rtl');
                } else {
                  document.documentElement.setAttribute('dir', 'ltr');
                  document.documentElement.classList.remove('rtl');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
