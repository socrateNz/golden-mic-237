import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { s } from '@/lib/spacing';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Header is fixed; reserve space so content doesn't slide under it */}
      <main className="flex-1" style={{ paddingTop: s(24) }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
