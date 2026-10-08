import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import '@fontsource/mrs-saint-delafield/400.css';
import './globals.css';
import { Providers } from '@/components/Providers';
import { ThemeToggle } from '@/components/ThemeToggle';
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts';
import { SignalFieldLoader } from '@/components/SignalFieldLoader';
import { PageShell } from '@/lib/navigation';
import { me, SITE_URL } from '@/content/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: me.name, template: `%s — ${me.name}` },
  description: me.description,
  applicationName: me.name,
  authors: [{ name: me.name, url: me.github }],
  creator: me.name,
  icons: { icon: '/favicon.svg' },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: me.name,
    title: me.name,
    description: 'SOC analyst & fullstack developer.',
    images: [{ url: '/og-image.jpg' }],
  },
  twitter: { card: 'summary_large_image', title: me.name, description: 'SOC analyst & fullstack developer.' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0b0c' },
  ],
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: me.name,
  jobTitle: 'SOC analyst & fullstack developer',
  address: { '@type': 'PostalAddress', addressCountry: 'MA' },
  email: `mailto:${me.email}`,
  url: SITE_URL,
  sameAs: [me.github, me.linkedin, me.instagram],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <body>
        <Providers>
          <a className="skip-link" href="#content">
            Skip to content
          </a>
          <SignalFieldLoader />
          <ThemeToggle />
          <KeyboardShortcuts />
          <PageShell>{children}</PageShell>
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
