'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Trophy, Users, Zap, ChevronRight, Mic2, Star } from 'lucide-react';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useRealtimeLeaderboard } from '@/hooks/useRealtimeLeaderboard';
import { formatPoints, formatRelativeTime } from '@/lib/utils';
import { s } from '@/lib/spacing';

export default function HomePage() {
  useRealtimeLeaderboard();
  const { data: lb } = useLeaderboard();

  return (
    <div className="bg-bg min-h-screen text-white overflow-x-hidden">
      {/* ── HERO ── */}
      <section
        className="relative min-h-[90vh] flex items-start justify-center"
        style={{ paddingTop: s(32), paddingBottom: s(20), paddingLeft: s(4), paddingRight: s(4) }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px] animate-pulse"
            style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-10 blur-[120px]"
            style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{
              gap: s(2),
              paddingLeft: s(4),
              paddingRight: s(4),
              paddingTop: s(2),
              paddingBottom: s(2),
              marginBottom: s(8),
            }}
            className='flex items-center justify-center'
          >
            <img src="/logo.png" alt="Golden Mic" className='max-w-40 w-full h-full aspect-square object-cover mx-auto' />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter"
            style={{ fontFamily: 'var(--font-outfit)', marginBottom: s(8) }}
          >
            GOLDEN <span className="text-gold-gradient">MIC</span>
            <br />
            <span
              className="text-white/20 text-3xl sm:text-5xl md:text-6xl tracking-widest inline-block"
              style={{ marginTop: s(4) }}
            >
              CAMEROUN 237
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed font-medium"
            style={{ marginBottom: s(12) }}
          >
            La première compétition musicale <span className="text-white">100% digitale</span> au Cameroun.
            Propulsez votre artiste préféré vers la victoire à partir de <span className="text-amber-400 font-bold">100 FCFA</span>.
          </motion.p>

          {/* Main Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-center items-center"
            style={{ gap: s(5) }}
          >
            <Link
              href="/candidates"
              className="btn-gold text-lg w-full sm:w-auto flex items-center justify-center group"
              style={{ padding: `${s(5)} ${s(10)}`, gap: s(3) }}
            >
              🗳️ Voter maintenant
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/register"
              className="btn-outline-gold text-lg w-full sm:w-auto flex items-center justify-center"
              style={{ padding: `${s(5)} ${s(10)}`, gap: s(3) }}
            >
              <Mic2 className="w-5 h-5" />
              S&apos;inscrire
            </Link>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="border-t border-white/5 grid grid-cols-2 md:grid-cols-4 max-w-4xl mx-auto"
            style={{ marginTop: s(20), paddingTop: s(10), gap: s(8) }}
          >
            {[
              { icon: Users, value: lb?.leaderboard?.length ?? '...', label: 'Candidats' },
              { icon: Trophy, value: lb?.leaderboard?.[0] ? formatPoints(lb.leaderboard[0].total_points) : '...', label: 'Record Points' },
              { icon: Zap, value: '100 F', label: 'Vote Minimum' },
              { icon: Star, value: 'TOP 10', label: 'Récompensés' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="w-5 h-5 text-amber-500 mx-auto opacity-50" style={{ marginBottom: s(3) }} />
                <p className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-outfit)' }}>{stat.value}</p>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold" style={{ marginTop: s(1) }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TOP 3 SPOTLIGHT ── */}
      {lb?.leaderboard && lb.leaderboard.length >= 3 && (
        <section
          className="mx-auto relative bg-gradient-to-b from-transparent to-[#0f0f1a]/50"
          style={{ paddingTop: s(24), paddingBottom: s(24), paddingLeft: s(6), paddingRight: s(6) }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center" style={{ marginBottom: s(16) }}>
              <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: 'var(--font-outfit)', marginBottom: s(4) }}>
                LE <span className="text-gold-gradient">TOP 3</span> ACTUEL
              </h2>
              <div className="h-1 w-20 bg-amber-500 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 items-end" style={{ gap: s(8) }}>
              {/* Rank 2 */}
              <div className="order-2 md:order-1">
                <TopCandidateCard candidate={lb.leaderboard[1]} rank={2} />
              </div>
              {/* Rank 1 */}
              <div className="order-1 md:order-2">
                <TopCandidateCard candidate={lb.leaderboard[0]} rank={1} isLarge />
              </div>
              {/* Rank 3 */}
              <div className="order-3 md:order-3">
                <TopCandidateCard candidate={lb.leaderboard[2]} rank={3} />
              </div>
            </div>
          </div>
        </section>
      )}
      {/* ── RECENT ACTIVITY ── */}
      <section className="flex flex-col items-center" style={{ paddingTop: s(20), paddingBottom: s(20), paddingLeft: s(6), paddingRight: s(6) }}>
        <div className="max-w-6xl w-full" style={{ paddingTop: s(10), paddingBottom: s(10) }}>
          <div className="flex flex-col md:flex-row md:items-end justify-between" style={{ gap: s(6), marginBottom: s(12) }}>
            <div>
              <h2 className="text-3xl font-black" style={{ fontFamily: 'var(--font-outfit)', marginBottom: s(2) }}>
                Derniers <span className="text-gold-gradient">Votes</span>
              </h2>
              <p className="text-white/40 flex items-center" style={{ gap: s(2) }}>
                <span className="live-dot" /> Activité en temps réel
              </p>
            </div>
            <Link href="/leaderboard" className="text-amber-400 hover:text-amber-300 font-bold text-sm flex items-center group" style={{ gap: s(2) }}>
              Voir tout le classement <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: s(4) }}>
            {lb?.recentVotes?.slice(0, 8).map((vote, i) => (
              <motion.div
                key={vote.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="glass flex items-center group"
                style={{ padding: s(4), gap: s(4) }}
              >
                <div className="w-10 h-10 rounded-full bg-amber-400/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                  <Mic2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate text-white/90">{vote.candidates?.artist_name ?? '—'}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">{formatRelativeTime(vote.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="text-amber-400 font-black">+{vote.points}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* ── STEPS ── */}
      <section
        className="flex flex-col items-center relative bg-surface/30"
        style={{ paddingTop: s(24), paddingBottom: s(24), paddingLeft: s(6), paddingRight: s(6) }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center" style={{ marginBottom: s(16) }}>
            <h2 className="text-3xl font-black" style={{ fontFamily: 'var(--font-outfit)', marginBottom: s(4) }}>
              Comment <span className="text-gold-gradient">Voter</span> ?
            </h2>
            <p className="text-white/40 max-w-md mx-auto">Soutenez vos artistes préférés en quelques clics seulement.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: s(12) }}>
            {[
              { step: '01', title: 'Choisissez', desc: 'Explorez la liste des candidats et découvrez de nouveaux talents.' },
              { step: '02', title: 'Montant', desc: 'Déterminez le nombre de points que vous souhaitez attribuer.' },
              { step: '03', title: 'Validation', desc: 'Payez via Mobile Money et voyez les points s’ajouter en direct.' },
            ].map((item, i) => (
              <div key={i} className="relative text-center group">
                <div className="text-6xl font-black text-white/[0.03] absolute -top-10 left-1/2 -translate-x-1/2 select-none group-hover:text-amber-400/5 transition-colors">
                  {item.step}
                </div>
                <h3
                  className="text-xl font-bold text-amber-400"
                  style={{ fontFamily: 'var(--font-outfit)', marginTop: s(4), marginBottom: s(3) }}
                >
                  {item.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION ── */}
      <section style={{
        paddingTop: '100px',
        paddingBottom: '100px',
        paddingLeft: '24px',
        paddingRight: '24px',
      }} className="flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass text-center relative overflow-hidden group"
          style={{ 
            borderColor: 'rgba(245,158,11,0.2)',
            padding: 'clamp(48px, 6vw, 80px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            borderRadius: '16px',
            backgroundColor: 'rgba(245,158,11,0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(245,158,11,0.2)',
            boxShadow: '0 4px 30px rgba(0,0,0,0.4)',
           }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 blur-[100px]" style={{ marginRight: `-${s(32)}`, marginTop: `-${s(32)}` }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/5 blur-[100px]" style={{ marginLeft: `-${s(32)}`, marginBottom: `-${s(32)}` }} />

          <Star style={{ marginBottom: '8px' }} className="w-12 h-12 text-amber-500 mx-auto opacity-50" />
          <h2 className="text-4xl md:text-5xl font-black leading-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
            Vous avez du <span className="text-gold-gradient">Talent</span> ?
          </h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto font-medium">
            Inscrivez-vous dès maintenant, mobilisez vos fans et devenez la prochaine légende de la musique camerounaise.
          </p>
          <div className="flex flex-col sm:flex-row justify-center" style={{ gap: s(4) }}>
            <Link 
            href="/register" 
            style={{
              padding: '12px 24px',
            }}  className="btn-gold text-lg shadow-2xl">
              🚀 Déposer ma candidature
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

function TopCandidateCard({ candidate, rank, isLarge = false }: { candidate: any; rank: number; isLarge?: boolean }) {
  const rankColors = {
    1: 'border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.2)]',
    2: 'border-white/20',
    3: 'border-amber-900/40',
  };

  const rankIcons = ['🥇', '🥈', '🥉'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      viewport={{ once: true }}
      className={`glass group relative flex flex-col items-center text-center transition-all hover:translate-y-[-5px] ${rankColors[rank as keyof typeof rankColors]}`}
      style={{
        paddingLeft: s(8),
        paddingRight: s(8),
        paddingTop: isLarge ? s(16) : s(8),
        paddingBottom: isLarge ? s(16) : s(8),
      }}
    >
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#080810] border border-inherit flex items-center justify-center text-2xl shadow-xl z-10">
        {rankIcons[rank - 1]}
      </div>

      <div className={`relative ${isLarge ? 'w-32 h-32 md:w-40 md:h-40' : 'w-24 h-24'} rounded-3xl overflow-hidden ring-4 ring-white/5 group-hover:ring-amber-400/30 transition-all`} style={{ marginBottom: s(6) }}>
        {candidate.photo_url ? (
          <Image src={candidate.photo_url} alt={candidate.artist_name} fill className="object-cover" sizes="200px" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-4xl">🎤</div>
        )}
      </div>

      <h3 className={`${isLarge ? 'text-2xl' : 'text-xl'} font-black text-white`} style={{ fontFamily: 'var(--font-outfit)', marginBottom: s(1) }}>
        {candidate.artist_name}
      </h3>
      <p className="text-white/40 text-sm uppercase tracking-widest font-bold" style={{ marginBottom: s(6) }}>{candidate.region}</p>

      <div className="w-full border-t border-white/5" style={{ paddingTop: s(6) }}>
        <p className="text-xs text-white/30 uppercase tracking-[0.2em] font-bold" style={{ marginBottom: s(1) }}>Score Actuel</p>
        <p className={`font-black text-gold-gradient ${isLarge ? 'text-4xl' : 'text-3xl'}`} style={{ fontFamily: 'var(--font-outfit)' }}>
          {formatPoints(candidate.total_points)}
        </p>
      </div>

      <Link
        href={`/candidates/${candidate.id}`}
        className={`w-full rounded-xl font-bold text-sm transition-all ${rank === 1 ? 'bg-amber-500 text-black hover:bg-amber-400' : 'bg-white/5 text-white hover:bg-white/10'
          }`}
        style={{ marginTop: s(8), paddingTop: s(3), paddingBottom: s(3) }}      >
        🗳️ Voter
      </Link>
    </motion.div>
  );
}
