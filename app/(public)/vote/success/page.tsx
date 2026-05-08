'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Share2, Trophy } from 'lucide-react';
import { useVoteStore } from '@/store';
import { s } from '@/lib/spacing';

export default function VoteSuccessPage() {
  const params = useSearchParams();
  const ref = params.get('ref');
  const { resetVote } = useVoteStore();

  useEffect(() => {
    resetVote();
  }, [resetVote]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ paddingLeft: s(6), paddingRight: s(6), paddingTop: s(24) }}
    >
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="max-w-md w-full glass text-center"
        style={{ padding: s(10) }}
      >
        {/* Animated check */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
          style={{ background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.4)', marginBottom: s(6) }}
        >
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="text-3xl font-black" style={{ fontFamily: 'var(--font-outfit)', marginBottom: s(2) }}>
            Vote enregistré ! 🎉
          </h1>
          <p className="text-white/60" style={{ marginBottom: s(2) }}>Vos points ont été attribués instantanément.</p>
          {ref && <p className="text-xs text-white/30" style={{ marginBottom: s(6) }}>Réf : {ref}</p>}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="rounded-xl"
          style={{
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.2)',
            padding: s(4),
            marginBottom: s(8),
          }}
        >
          <p className="text-amber-400 text-sm font-semibold">
            ✨ Votez à nouveau pour augmenter le score de votre artiste !
          </p>
          <p className="text-white/40 text-xs" style={{ marginTop: s(1) }}>Aucune limite de votes — 100 FCFA = 10 points</p>
        </motion.div>

        <div className="flex flex-col" style={{ gap: s(3) }}>
          <Link
            href="/leaderboard"
            className="btn-gold flex items-center justify-center"
            style={{ gap: s(2), paddingTop: s(3), paddingBottom: s(3) }}
          >
            <Trophy className="w-5 h-5" /> Voir le classement
          </Link>
          <Link href="/candidates" className="btn-outline-gold" style={{ paddingTop: s(3), paddingBottom: s(3) }}>
            Voter à nouveau
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
