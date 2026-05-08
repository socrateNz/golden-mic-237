'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Trophy, Star, ChevronUp, ChevronDown, Minus } from 'lucide-react';
import type { Candidate } from '@/types';
import { formatPoints, getWhatsAppShareUrl } from '@/lib/utils';
import { s } from '@/lib/spacing';

interface CandidateCardProps {
  candidate: Candidate;
  rank?: number;
  index?: number;
}

const rankColors: Record<number, string> = {
  1: 'from-yellow-400 to-amber-600',
  2: 'from-gray-300 to-gray-500',
  3: 'from-amber-600 to-orange-800',
};

export default function CandidateCard({ candidate, rank, index = 0 }: CandidateCardProps) {
  const displayRank = rank ?? candidate.rank ?? index + 1;
  const isTop3 = displayRank <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="glass glass-hover group relative overflow-hidden"
    >
      {/* Top 3 glow */}
      {isTop3 && (
        <div
          className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
          style={{ background: `linear-gradient(135deg, ${displayRank === 1 ? '#fcd34d' : displayRank === 2 ? '#d1d5db' : '#d97706'}, transparent)` }}
        />
      )}

      {/* Trending badge */}
      {candidate.is_trending && (
        <div
          className="absolute z-10 rounded-full text-[10px] font-bold uppercase tracking-wider pointer-events-none"
          style={{
            top: s(3),
            right: s(3),
            paddingLeft: s(2),
            paddingRight: s(2),
            paddingTop: s(0.5),
            paddingBottom: s(0.5),
            background: 'rgba(245,158,11,0.9)',
            color: '#000',
          }}
        >
          🔥 Trending
        </div>
      )}

      <Link href={`/candidates/${candidate.id}`} className="block relative z-20" style={{ padding: s(5) }}>
        {/* Rank + Photo */}
        <div className="flex items-start" style={{ gap: s(4) }}>
          <div className="flex flex-col items-center min-w-[36px]" style={{ gap: s(1) }}>
            <span className={`text-2xl font-black ${isTop3 ? `rank-${displayRank}` : 'text-white/40'}`}
              style={{ fontFamily: 'var(--font-outfit)' }}>
              {displayRank <= 3 ? ['🥇', '🥈', '🥉'][displayRank - 1] : `#${displayRank}`}
            </span>
          </div>

          {/* Photo */}
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 ring-2 ring-amber-400/20 group-hover:ring-amber-400/50 transition-all">
            {candidate.photo_url ? (
              <Image
                src={candidate.photo_url}
                alt={candidate.artist_name}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-amber-900/50 to-amber-700/30 flex items-center justify-center">
                <span className="text-2xl">🎤</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white truncate" style={{ fontFamily: 'var(--font-outfit)' }}>
              {candidate.artist_name}
            </p>
            <p className="text-white/50 text-xs truncate">{candidate.region}</p>
            {candidate.categories && (
              <span
                className="inline-block rounded-full text-[10px] font-medium"
                style={{
                  marginTop: s(1),
                  paddingLeft: s(2),
                  paddingRight: s(2),
                  paddingTop: s(0.5),
                  paddingBottom: s(0.5),
                  background: 'rgba(245,158,11,0.15)',
                  color: '#f59e0b',
                }}
              >
                {candidate.categories.name}
              </span>
            )}
          </div>
        </div>

        {/* Points */}
        <div className="flex items-center justify-between" style={{ marginTop: s(4) }}>
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-wider">Score</p>
            <p className="text-xl font-black text-gold-gradient" style={{ fontFamily: 'var(--font-outfit)' }}>
              {formatPoints(candidate.total_points)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/40 uppercase tracking-wider">Votes</p>
            <p className="text-sm font-bold text-white/60">{candidate.vote_count.toLocaleString('fr-FR')}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden" style={{ marginTop: s(3) }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #f59e0b, #fcd34d)' }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (candidate.total_points / 10000) * 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: index * 0.06 + 0.3 }}
          />
        </div>
      </Link>

      {/* Vote button */}
      <div style={{ paddingLeft: s(5), paddingRight: s(5), paddingBottom: s(5) }}>
        <Link
          href={`/candidates/${candidate.id}`}
          className="btn-gold w-full text-center text-sm block cursor-pointer relative z-20"
          onClick={(e) => e.stopPropagation()}
        >
          🗳️ Voter — 100 FCFA
        </Link>
      </div>
    </motion.div>
  );
}
