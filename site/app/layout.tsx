import type { Metadata } from 'next';
import './globals.css';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://pomade-swart.vercel.app'),
  title: {
    default: 'PoMade — Code pushed. First impression handled.',
    template: '%s',
  },
  description:
    'Your agent writes the code. PoMade handles the README, media, About, and topics. Every push looks finished.',
  icons: {
    icon: '/pomade-mascot.png',
  },
  openGraph: {
    title: 'PoMade — Code pushed. First impression handled.',
    description:
      'Your agent writes the code. PoMade handles the README, media, About, and topics. Every push looks finished.',
    images: ['/social-preview.svg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('pomade-theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <div>
          <Header />
          <main>{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
