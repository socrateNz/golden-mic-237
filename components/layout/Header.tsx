'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Mic2, Trophy, Users, Star } from 'lucide-react';
import { s } from '@/lib/spacing';

const navLinks = [
  { href: '/candidates', label: 'Candidats', icon: Users },
  { href: '/leaderboard', label: 'Classement', icon: Trophy },
  { href: '/register', label: "S'inscrire", icon: Star },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className="rounded-2xl flex justify-center"
        style={{
          marginLeft: s(4),
          marginRight: s(4),
          marginTop: s(3),
          background: 'rgba(8,8,16,0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(245,158,11,0.2)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.4)',
        }}
      >
        <div
          className="max-w-7xl w-full mx-auto flex items-center justify-between"
          style={{ paddingLeft: s(5), paddingRight: s(5), paddingTop: s(3), paddingBottom: s(3) }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center group" style={{ gap: s(2) }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <img src="/logo.png" alt="Golden Mic" />
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-sm leading-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                <span className="text-gold-gradient">Golden Mic</span>
                <span className="text-white"> 237</span>
              </p>
              <p className="text-[10px] text-amber-400/60 tracking-widest uppercase">Cameroun</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center" style={{ gap: s(1) }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center rounded-xl text-sm font-medium text-white/70 hover:text-amber-400 hover:bg-amber-400/10 transition-all"
                style={{ gap: s(1.5), paddingLeft: s(4), paddingRight: s(4), paddingTop: s(2), paddingBottom: s(2) }}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center" style={{ gap: s(3) }}>
            <Link
              href="/candidates"
              style={{ padding: `${s(3)} ${s(6)}` }}
              className="btn-gold text-lg shadow-2xl"
            >
              🗳️ Voter maintenant
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden rounded-xl text-white/70 hover:text-amber-400 hover:bg-amber-400/10 transition-all"
            style={{ padding: s(2) }}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl overflow-hidden"
            style={{
              marginLeft: s(4),
              marginRight: s(4),
              marginTop: s(1),
              background: 'rgba(8,8,16,0.97)',
              border: '1px solid rgba(245,158,11,0.2)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex flex-col" style={{ padding: s(4), gap: s(2) }}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center rounded-xl text-white/70 hover:text-amber-400 hover:bg-amber-400/10 transition-all"
                  style={{ gap: s(3), paddingLeft: s(4), paddingRight: s(4), paddingTop: s(3), paddingBottom: s(3) }}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
              <Link
                href="/candidates"
                onClick={() => setMenuOpen(false)}
                style={{ padding: `${s(3)} ${s(6)}` }}
                className="btn-gold text-lg shadow-2xl text-center"
              >
                🗳️ Voter maintenant
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
