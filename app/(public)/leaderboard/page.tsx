'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useRealtimeLeaderboard } from '@/hooks/useRealtimeLeaderboard';
import { formatPoints, formatRelativeTime } from '@/lib/utils';
import { s } from '@/lib/spacing';

export default function LeaderboardPage() {
  useRealtimeLeaderboard();
  const { data: lb, isLoading } = useLeaderboard();

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center"
      style={{ paddingTop: s(28), paddingBottom: s(20), paddingLeft: s(6), paddingRight: s(6) }}
    >
      <div className="max-w-5xl w-full mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center" style={{ marginBottom: s(12) }}>
          <h1 className="text-4xl sm:text-5xl font-black" style={{ fontFamily: 'var(--font-outfit)', marginBottom: s(3) }}>
            🏆 Classement <span className="text-gold-gradient">Live</span>
          </h1>
          <p className="text-white/50 flex items-center justify-center" style={{ gap: s(2) }}>
            <span className="live-dot" />
            Mis à jour en temps réel
          </p>
        </motion.div>

        {/* Podium top 3 */}
        {lb?.leaderboard && lb.leaderboard.length >= 3 && (
          <div className="grid grid-cols-3 items-end" style={{ gap: s(4), marginBottom: s(10) }}>
            {[
              { c: lb.leaderboard[1], emoji: '🥈', height: 'h-36', order: 'order-1' },
              { c: lb.leaderboard[0], emoji: '🥇', height: 'h-48', order: 'order-2' },
              { c: lb.leaderboard[2], emoji: '🥉', height: 'h-28', order: 'order-3' },
            ].map(({ c, emoji, height, order }) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                className={`${order} flex flex-col items-center glass text-center`}
                style={{ gap: s(3), padding: s(4) }}
              >
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-amber-400/30">
                  {c.photo_url
                    ? <Image src={c.photo_url} alt={c.artist_name} fill className="object-cover" sizes="64px" />
                    : <div className="w-full h-full bg-amber-900/40 flex items-center justify-center text-2xl">🎤</div>}
                </div>
                <div className="text-3xl">{emoji}</div>
                <p className="font-bold text-sm leading-tight truncate w-full" style={{ fontFamily: 'var(--font-outfit)' }}>
                  {c.artist_name}
                </p>
                <p className="text-amber-400 font-black text-lg">{formatPoints(c.total_points)}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Full ranking table */}
        <div className="glass overflow-hidden">
          <div
            className="grid grid-cols-12 text-xs font-bold text-white/30 uppercase tracking-widest"
            style={{
              paddingLeft: s(5),
              paddingRight: s(5),
              paddingTop: s(3),
              paddingBottom: s(3),
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <span className="col-span-1">#</span>
            <span className="col-span-5">Artiste</span>
            <span className="col-span-3 text-right">Score</span>
            <span className="col-span-2 text-right hidden sm:block">Votes</span>
            <span className="col-span-1" />
          </div>

          {isLoading && Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-white/5" style={{ marginLeft: s(5), marginRight: s(5), marginTop: s(2), marginBottom: s(2) }} />
          ))}

          {lb?.leaderboard.map((c, i) => (
            <motion.div key={c.id}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="grid grid-cols-12 items-center transition-colors hover:bg-amber-400/5"
              style={{
                paddingLeft: s(5),
                paddingRight: s(5),
                paddingTop: s(4),
                paddingBottom: s(4),
                borderBottom: '1px solid rgba(255,255,255,0.03)',
              }}
            >
              <div className="col-span-1 font-black text-lg"
                style={{ fontFamily: 'var(--font-outfit)', color: i < 3 ? '#f59e0b' : 'rgba(255,255,255,0.3)' }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
              </div>
              <div className="col-span-5 flex items-center" style={{ gap: s(3) }}>
                <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                  {c.photo_url
                    ? <Image src={c.photo_url} alt={c.artist_name} fill className="object-cover" sizes="40px" />
                    : <div className="w-full h-full bg-amber-900/40 flex items-center justify-center">🎤</div>}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate">{c.artist_name}</p>
                  <p className="text-white/30 text-xs">{c.region}</p>
                </div>
              </div>
              <div className="col-span-3 text-right">
                <p className="font-black text-amber-400" style={{ fontFamily: 'var(--font-outfit)' }}>
                  {formatPoints(c.total_points)}
                </p>
              </div>
              <div className="col-span-2 text-right hidden sm:block">
                <p className="text-white/40 text-sm">{c.vote_count.toLocaleString('fr-FR')}</p>
              </div>
              <div className="col-span-1 flex justify-end">
                <Link href={`/candidates/${c.id}`}
                  className="text-xs text-amber-400 hover:underline font-semibold">
                  Voter
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent votes */}
        {lb?.recentVotes && lb.recentVotes.length > 0 && (
          <div style={{ marginTop: s(10) }}>
            <h2 className="text-xl font-black" style={{ fontFamily: 'var(--font-outfit)', marginBottom: s(4) }}>
              ⚡ Derniers votes
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: s(2) }}>
              {lb.recentVotes.slice(0, 10).map((vote, i) => (
                <motion.div key={vote.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass flex items-center"
                  style={{ gap: s(3), paddingLeft: s(4), paddingRight: s(4), paddingTop: s(3), paddingBottom: s(3) }}
                >
                  <span className="text-lg">🗳️</span>
                  <div className="flex-1 text-sm">
                    <span className="text-white/70">{vote.voter_name ?? 'Anonyme'}</span>
                    <span className="text-white/40"> a voté pour </span>
                    <span className="text-amber-400 font-semibold">{vote.candidates?.artist_name}</span>
                  </div>
                  <span className="font-bold text-amber-400 text-sm">+{vote.points} pts</span>
                  <span className="text-white/30 text-xs hidden sm:block">{formatRelativeTime(vote.created_at)}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
