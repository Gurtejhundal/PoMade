import type { Metadata } from 'next';
import './globals.css';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://pomade.dev'),
  title: 'Pomade — Make every repo worth opening',
  description:
    'He doesn’t write your code. He makes sure it looks finished. The agent-native GitHub repository presentation, packaging, and maintenance engine.',
  icons: {
    icon: '/pomade-mascot.png',
  },
  openGraph: {
    title: 'Pomade — Make every repo worth opening',
    description:
      'The agent-native repository presentation and maintenance layer. Creating polished READMEs, diagrams, and metadata from verifiable code evidence.',
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
      <body className="min-h-screen flex flex-col justify-between selection:bg-copper-500/20 selection:text-copper-700 dark:selection:bg-amberGold-500/20 dark:selection:text-amberGold-300">
        <div>
          <Header />
          <main>{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
