import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Golden Mic 237 — Compétition Musicale Camerounaise',
  description:
    'Votez pour vos artistes camerounais préférés. La première compétition musicale 100% digitale au Cameroun. Mobile Money accepté.',
  keywords: ['musique cameroun', 'compétition musicale', 'vote', 'artistes camerounais', 'golden mic 237'],
  openGraph: {
    title: 'Golden Mic 237',
    description: 'Votez pour vos artistes camerounais préférés !',
    type: 'website',
    locale: 'fr_CM',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-[#080810] text-white antialiased">
        <QueryProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#1a1a2e',
                color: '#fff',
                border: '1px solid rgba(245,158,11,0.3)',
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
