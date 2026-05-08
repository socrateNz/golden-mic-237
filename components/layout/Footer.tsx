import { Mic2 } from 'lucide-react';
import Link from 'next/link';
import { s } from '@/lib/spacing';

export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{ borderColor: 'rgba(245,158,11,0.1)', background: '#05050d', marginTop: s(20)  }}
    >
      <div className="max-w-7xl mx-auto" style={{ paddingLeft: s(6), paddingRight: s(6), paddingTop: s(12), paddingBottom: s(12), marginLeft: "auto", marginRight: "auto" }}>
        <div className="grid grid-cols-1 md:grid-cols-4" style={{ gap: s(8) }}>
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center" style={{ gap: s(2), marginBottom: s(4) }}>
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-amber-400 to-amber-700 flex items-center justify-center">
                <Mic2 className="w-5 h-5 text-black" />
              </div>
              <span className="font-black text-lg text-gold-gradient" style={{ fontFamily: 'var(--font-outfit)' }}>
                Golden Mic 237
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              La première compétition musicale 100% digitale au Cameroun. Votez, soutenez, célébrez la musique camerounaise.
            </p>
            <div className="flex" style={{ gap: s(3), marginTop: s(5) }}>
              {[
                { icon: Mic2, href: '#' },
                { icon: Mic2, href: '#' },
                { icon: Mic2, href: '#' },
              ].map((social, i) => (
                <a key={i} href={social.href} className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-amber-400 hover:bg-amber-400/10 transition-all"
                  style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-amber-400 text-xs font-bold uppercase tracking-widest" style={{ marginBottom: s(4) }}>Navigation</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: s(2) }}>
              {[
                { href: '/candidates', label: 'Candidats' },
                { href: '/leaderboard', label: 'Classement' },
                { href: '/register', label: 'Inscription' },
                { href: '/sponsors', label: 'Sponsoring' },
              ].map((link) => (
                <Link key={link.href} href={link.href}
                  className="block text-sm text-white/50 hover:text-amber-400 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Vote info */}
          <div>
            <p className="text-amber-400 text-xs font-bold uppercase tracking-widest" style={{ marginBottom: s(4) }}>Vote</p>
            <div className="text-sm text-white/40" style={{ display: 'flex', flexDirection: 'column', gap: s(2) }}>
              <p>100 FCFA = 10 points</p>
              <p>Mobile Money MTN</p>
              <p>Mobile Money Orange</p>
              <p>Sans inscription</p>
            </div>
          </div>
        </div>

        <div
          className="border-t flex flex-col sm:flex-row justify-between items-center"
          style={{ borderColor: 'rgba(255,255,255,0.06)', marginTop: s(10), paddingTop: s(6), gap: s(4) }}
        >
          <p className="text-white/30 text-xs">© 2026 Golden Mic 237. Tous droits réservés. 🇨🇲</p>
          <p className="text-white/20 text-xs">design and built by <a href="https://portfolio-socrate.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300">Etarcos Dev</a></p>
        </div>
      </div>
    </footer>
  );
}
