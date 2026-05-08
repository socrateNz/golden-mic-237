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
      className="glass glass-hover group relative overflow-hidden rounded-2xl"
      style={{ 
        height: '480px', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top 3 glow */}
      {isTop3 && (
        <div
          className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none z-0"
          style={{ 
            background: `linear-gradient(135deg, ${displayRank === 1 ? '#fcd34d' : displayRank === 2 ? '#d1d5db' : '#d97706'}, transparent)`,
            position: 'absolute',
            inset: 0
          }}
        />
      )}

      {/* Trending badge */}
      {candidate.is_trending && (
        <div
          className="absolute z-20 rounded-full text-[10px] font-bold uppercase tracking-wider pointer-events-none"
          style={{
            position: 'absolute',
            top: s(3),
            right: s(3),
            paddingLeft: s(2),
            paddingRight: s(2),
            paddingTop: s(0.5),
            paddingBottom: s(0.5),
            background: 'rgba(245,158,11,0.9)',
            color: '#000',
            borderRadius: '9999px',
            fontSize: '10px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            zIndex: 20
          }}
        >
          🔥 Trending
        </div>
      )}

      {/* Rank badge en haut à gauche */}
      <div 
        className="absolute z-20"
        style={{ 
          position: 'absolute',
          top: s(3), 
          left: s(3),
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          borderRadius: '9999px',
          paddingLeft: s(3),
          paddingRight: s(3),
          paddingTop: s(1.5),
          paddingBottom: s(1.5),
          zIndex: 20
        }}
      >
        <span 
          className={`text-xl font-black ${isTop3 ? `rank-${displayRank}` : 'text-white'}`}
          style={{ 
            fontFamily: 'var(--font-outfit)',
            fontSize: '1.25rem',
            fontWeight: 900
          }}
        >
          {displayRank <= 3 ? ['🥇', '🥈', '🥉'][displayRank - 1] : `#${displayRank}`}
        </span>
      </div>

      <Link href={`/candidates/${candidate.id}`} className="block flex-1 flex flex-col relative z-10" style={{ display: 'block', flex: 1, flexDirection: 'column', position: 'relative', zIndex: 10 }}>
        {/* Photo pleine largeur - occupe au moins 80% de la hauteur */}
        <div className="relative w-full" style={{ position: 'relative', width: '100%', height: '80%', minHeight: '80%' }}>
          {candidate.photo_url ? (
            <Image
              src={candidate.photo_url}
              alt={`Photo de ${candidate.artist_name}`}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={index < 4}
              style={{ objectFit: 'cover', objectPosition: 'top' }}
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'linear-gradient(to bottom right, rgba(245,158,11,0.5), rgba(245,158,11,0.3))'
              }}
            >
              <span style={{ fontSize: '6rem' }}>🎤</span>
            </div>
          )}
        </div>

        {/* Dégradé en bas avec les infos */}
        <div 
          className="relative w-full"
          style={{ 
            position: 'relative',
            width: '100%', 
            height: '20%',
            padding: s(4),
            background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.95) 100%)',
            borderTop: '1px solid rgba(245,158,11,0.2)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            gap: s(2)
          }}
        >
          {/* Nom et région */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: s(0.5) }}>
            <h3 
              className="font-bold text-white text-lg truncate"
              style={{ 
                fontFamily: 'var(--font-outfit)',
                fontWeight: 'bold',
                color: 'white',
                fontSize: '1.125rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {candidate.artist_name}
            </h3>
            <p 
              className="text-white/50 text-xs truncate"
              style={{ 
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.75rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {candidate.region}
            </p>
          </div>

          {/* Catégorie */}
          {candidate.categories && (
            <span
              className="inline-block rounded-full text-[10px] font-medium"
              style={{
                display: 'inline-block',
                borderRadius: '9999px',
                fontSize: '10px',
                fontWeight: 500,
                paddingLeft: s(2),
                paddingRight: s(2),
                paddingTop: s(0.5),
                paddingBottom: s(0.5),
                background: 'rgba(245,158,11,0.2)',
                color: '#f59e0b',
                width: 'fit-content'
              }}
            >
              {candidate.categories.name}
            </span>
          )}

          {/* Points et stats */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: s(1) }}>
            <div>
              <p 
                className="text-[8px] text-white/40 uppercase tracking-wider"
                style={{ 
                  fontSize: '8px', 
                  color: 'rgba(255,255,255,0.4)', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em',
                  marginBottom: s(0.5)
                }}
              >
                Score
              </p>
              <p 
                className="text-lg font-black text-gold-gradient"
                style={{ 
                  fontFamily: 'var(--font-outfit)',
                  fontSize: '1.125rem',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #f59e0b, #fcd34d)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {formatPoints(candidate.total_points)}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p 
                className="text-[8px] text-white/40 uppercase tracking-wider"
                style={{ 
                  fontSize: '8px', 
                  color: 'rgba(255,255,255,0.4)', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em',
                  marginBottom: s(0.5)
                }}
              >
                Votes
              </p>
              <p 
                className="text-xs font-bold text-white/60"
                style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold', 
                  color: 'rgba(255,255,255,0.6)'
                }}
              >
                {candidate.vote_count.toLocaleString('fr-FR')}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div 
            className="overflow-hidden"
            style={{ 
              height: s(1),
              borderRadius: '9999px',
              background: 'rgba(255,255,255,0.1)',
              overflow: 'hidden',
              marginTop: s(0.5)
            }}
          >
            <motion.div
              style={{ 
                height: '100%',
                borderRadius: '9999px',
                background: 'linear-gradient(90deg, #f59e0b, #fcd34d)'
              }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (candidate.total_points / 10000) * 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: index * 0.06 + 0.3 }}
            />
          </div>
        </div>
      </Link>

      {/* Vote button - en bas de la carte */}
      <div style={{ 
        position: 'relative', 
        zIndex: 20, 
        paddingLeft: s(3), 
        paddingRight: s(3), 
        paddingBottom: s(3), 
        paddingTop: 0 
      }}>
        <Link
          href={`/candidates/${candidate.id}`}
          className="btn-gold w-full text-center text-sm block cursor-pointer"
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'center',
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          🗳️ Voter — 100 FCFA
        </Link>
      </div>
    </motion.div>
  );
}