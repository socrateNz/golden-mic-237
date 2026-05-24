'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Trophy, Flame, Music2, Zap } from 'lucide-react';
import type { Candidate } from '@/types';
import { formatPoints, getWhatsAppShareUrl } from '@/lib/utils';
import { s } from '@/lib/spacing';

interface CandidateCardProps {
  candidate: Candidate;
  rank?: number;
  index?: number;
}

export default function CandidateCard({ candidate, rank, index = 0 }: CandidateCardProps) {
  const displayRank = rank ?? candidate.rank ?? index + 1;
  const isTop3 = displayRank <= 3;

  console.log(candidate.photo_url);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="group relative h-full flex flex-col overflow-hidden rounded-3xl"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(15,15,26,0.8), rgba(5,5,8,0.95))',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(245,158,11,0.15)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}
    >
      {/* Animated background glow */}
      <div
        className="absolute -inset-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          position: 'absolute',
          inset: '-50%',
          background: `radial-gradient(circle, ${isTop3 ? (displayRank === 1 ? '#fcd34d' : displayRank === 2 ? '#d1d5db' : '#f59e0b') : '#f59e0b'}40, transparent 70%)`,
          opacity: 0,
          transition: 'opacity 0.5s',
          pointerEvents: 'none',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />

      {/* Rank Badge - Élégant et flottant */}
      {isTop3 && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: index * 0.06 + 0.15, type: 'spring', stiffness: 200 }}
          className="absolute z-30 top-4 right-4"
          style={{
            position: 'absolute',
            top: s(4),
            right: s(4),
            zIndex: 30,
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${displayRank === 1 ? '#fcd34d' : displayRank === 2 ? '#d1d5db' : '#f59e0b'}, ${displayRank === 1 ? '#f59e0b' : displayRank === 2 ? '#9ca3af' : '#ea580c'})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 20px ${displayRank === 1 ? '#fcd34d' : displayRank === 2 ? '#d1d5db' : '#f59e0b'}40`,
              border: '2px solid rgba(255,255,255,0.2)',
            }}
          >
            <span style={{ fontSize: '2rem' }}>
              {['🥇', '🥈', '🥉'][displayRank - 1]}
            </span>
          </div>
        </motion.div>
      )}

      {/* Trending Flame Badge */}
      {candidate.is_trending && (
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute z-30 top-4 left-4"
          style={{
            position: 'absolute',
            top: s(4),
            left: s(4),
            zIndex: 30,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: s(1),
              paddingLeft: s(2),
              paddingRight: s(2),
              paddingTop: s(1),
              paddingBottom: s(1),
              background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
              borderRadius: '9999px',
              boxShadow: '0 4px 15px rgba(245,158,11,0.4)',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            <Flame size={14} style={{ color: '#fff' }} />
            <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Trending
            </span>
          </div>
        </motion.div>
      )}

      <Link
        href={`/candidates/${candidate.id}`}
        className="relative flex flex-col h-full group/link"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'relative',
          zIndex: 10,
          textDecoration: 'none',
        }}
      >
        {/* Image Container avec effet parallaxe */}
        <div
          className="relative overflow-hidden flex-shrink-0"
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '2.5/3',
            overflow: 'hidden',
          }}
        >
          {/* Overlay glow effect sur image */}
          <div
            className="absolute inset-0 opacity-0 group-hover/link:opacity-100 transition-opacity duration-500 z-20 pointer-events-none"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, rgba(245,158,11,0.4), transparent)',
              opacity: 0,
              transition: 'opacity 0.5s',
              zIndex: 20,
              pointerEvents: 'none',
            }}
          />

          {candidate.photo_url ? (
            <Image
              src={candidate.photo_url}
              alt={`Photo de ${candidate.artist_name}`}
              fill
              className="object-cover transition-transform duration-700 group-hover/link:scale-120"
              sizes="(max-width: 540px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={index < 4}
              style={{
                objectFit: 'cover',
                objectPosition: 'top center',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
              }}
            >
              <Music2 size={80} style={{ color: '#fff', opacity: 0.3 }} />
            </div>
          )}

          {/* Dégradé en bas de l'image */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
              zIndex: 15,
            }}
          />

          {/* Catégorie flottante */}
          {candidate.categories && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.06 + 0.2 }}
              style={{
                position: 'absolute',
                bottom: s(3),
                left: s(3),
                zIndex: 20,
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: s(1),
                  paddingLeft: s(2),
                  paddingRight: s(2),
                  paddingTop: s(1),
                  paddingBottom: s(1),
                  background: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '9999px',
                  border: '1px solid rgba(245,158,11,0.3)',
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {candidate.categories.name}
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Info Section - Compact et épuré */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: `${s(2)} ${s(2.5)}`,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.6))',
            borderTop: '1px solid rgba(245,158,11,0.1)',
            gap: s(1.5),
          }}
        >
          {/* Nom artiste */}
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-outfit)',
                fontSize: '0.9rem',
                fontWeight: 900,
                color: '#fff',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                marginBottom: s(0.2),
              }}
            >
              {candidate.artist_name}
            </h3>
            <p
              style={{
                fontSize: '0.6rem',
                color: 'rgba(255,255,255,0.5)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {candidate.region}
            </p>
          </div>

          {/* Stats Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: s(1),
              paddingTop: s(1),
              borderTop: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {/* Points */}
            <div>
              <p
                style={{
                  fontSize: '6px',
                  color: 'rgba(255,255,255,0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: s(0.2),
                  fontWeight: 'bold',
                }}
              >
                Score
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-outfit)',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #f59e0b, #fcd34d)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {formatPoints(candidate.total_points)}
              </p>
            </div>

            {/* Votes */}
            <div style={{ textAlign: 'right' }}>
              <p
                style={{
                  fontSize: '6px',
                  color: 'rgba(255,255,255,0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: s(0.2),
                  fontWeight: 'bold',
                }}
              >
                Votes
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: s(0.2) }}>
                <Zap size={10} style={{ color: '#f59e0b' }} />
                <p
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    color: '#fff',
                  }}
                >
                  {candidate.vote_count > 999 ? `${(candidate.vote_count / 1000).toFixed(1)}k` : candidate.vote_count}
                </p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div
            style={{
              height: '3px',
              borderRadius: '9999px',
              background: 'rgba(255,255,255,0.1)',
              overflow: 'hidden',
            }}
          >
            <motion.div
              style={{
                height: '100%',
                borderRadius: '9999px',
                background: 'linear-gradient(90deg, #f59e0b, #fcd34d)',
                boxShadow: '0 0 10px rgba(245,158,11,0.5)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (candidate.total_points / 10000) * 100)}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: index * 0.06 + 0.3 }}
            />
          </div>
        </div>
      </Link>

      {/* CTA Button - Standalone */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: index * 0.06 + 0.4 }}
        style={{
          padding: `${s(1.5)} ${s(2.5)} ${s(2)} ${s(2.5)}`,
          zIndex: 20,
        }}
      >
        <Link
          href={`/candidates/${candidate.id}`}
          className="block w-full font-bold text-center transition-all duration-300 overflow-hidden rounded-full group/btn relative"
          style={{
            display: 'block',
            width: '100%',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            padding: `${s(1.5)} ${s(2.5)}`,
            textAlign: 'center',
            cursor: 'pointer',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
            color: '#fff',
            border: 'none',
            boxShadow: '0 4px 15px rgba(245,158,11,0.3)',
            position: 'relative',
            overflow: 'hidden',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(245,158,11,0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(245,158,11,0.3)';
          }}
        >
          <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: s(0.3) }}>
            🗳️ Voter
          </span>
        </Link>
      </motion.div>
    </motion.div>
  );
}