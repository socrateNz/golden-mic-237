'use client';

import { useState, useEffect } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { s } from '@/lib/spacing';
import Loading from './loading';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const isFetching = useIsFetching();
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Détection de la fin du chargement des requêtes initiales (ex: leaderboard, candidats)
  useEffect(() => {
    if (mounted && isFetching === 0) {
      const timer = setTimeout(() => {
        setInitialLoadDone(true);
      }, 500); // Transition fluide après chargement complet
      return () => clearTimeout(timer);
    }
  }, [mounted, isFetching]);

  // 2. Sécurité (Fallback) : Affiche l'interface après 3.5 secondes max en cas de réseau lent ou d'erreur
  useEffect(() => {
    if (mounted) {
      const fallbackTimer = setTimeout(() => {
        setInitialLoadDone(true);
      }, 3500);
      return () => clearTimeout(fallbackTimer);
    }
  }, [mounted]);

  return (
    <AnimatePresence mode="wait">
      {!initialLoadDone ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="min-h-screen flex flex-col bg-[#080810] justify-center"
        >
          <Loading />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen flex flex-col"
        >
          <Header />
          <main className="flex-1" style={{ paddingTop: s(24) }}>
            {children}
          </main>
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

