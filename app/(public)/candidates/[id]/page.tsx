'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Share2, Tv2, Music2, MapPin, Trophy } from 'lucide-react';
import { useCandidate } from '@/hooks/useCandidates';
import VoteModal from '@/components/vote/VoteModal';
import { formatPoints, getWhatsAppShareUrl } from '@/lib/utils';
import { s } from '@/lib/spacing';

export default function CandidateProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: candidate, isLoading, isError } = useCandidate(id);
  const [voteOpen, setVoteOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: s(28), paddingLeft: s(6), paddingRight: s(6) }}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-amber-400/10 animate-pulse mx-auto" style={{ marginBottom: s(4) }} />
          <p className="text-white/40">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (isError || !candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center" style={{ paddingTop: s(28), paddingLeft: s(6), paddingRight: s(6) }}>
        <div>
          <p className="text-5xl" style={{ marginBottom: s(4) }}>😕</p>
          <p className="text-white/50">Candidat introuvable</p>
          <Link href="/candidates" className="btn-outline-gold inline-block" style={{ marginTop: s(6), paddingLeft: s(6), paddingRight: s(6), paddingTop: s(3), paddingBottom: s(3) }}>
            ← Retour aux candidats
          </Link>
        </div>
      </div>
    );
  }

  const socials = [
    { url: candidate.instagram_url, icon: Tv2, label: 'Instagram' },
    { url: candidate.facebook_url, icon: Tv2, label: 'Facebook' },
    { url: candidate.youtube_url, icon: Tv2, label: 'YouTube' },
    { url: candidate.tiktok_url, icon: Music2, label: 'TikTok' },
  ].filter((s) => s.url);

  return (
    <>
      <div className="min-h-screen" style={{ paddingTop: s(24), paddingBottom: s(20) }}>
        {/* Hero banner */}
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, #1a0800, #0f0820, #080810)',
          }} />
          {candidate.photo_url && (
            <Image
              src={candidate.photo_url}
              alt={candidate.artist_name}
              fill
              className="object-cover opacity-20"
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-transparent to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10" style={{ marginTop: `-${s(24)}`, paddingLeft: s(6), paddingRight: s(6) }}>
          {/* Back */}
          <Link href="/candidates" className="inline-flex items-center text-white/50 hover:text-amber-400 text-sm transition-colors" style={{ gap: s(2), marginBottom: s(6) }}>
            <ArrowLeft className="w-4 h-4" /> Retour aux candidats
          </Link>

          {/* Profile card */}
          <div className="glass" style={{ padding: s(6) }}>
            <div className="flex flex-col sm:flex-row" style={{ gap: s(6) }}>
              {/* Photo */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden flex-shrink-0 ring-4 ring-amber-400/30">
                {candidate.photo_url ? (
                  <Image src={candidate.photo_url} alt={candidate.artist_name} fill className="object-cover" sizes="144px" />
                ) : (
                  <div className="w-full h-full bg-amber-900/40 flex items-center justify-center text-5xl">🎤</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-start" style={{ gap: s(3), marginBottom: s(2) }}>
                  <h1 className="text-3xl sm:text-4xl font-black" style={{ fontFamily: 'var(--font-outfit)' }}>
                    {candidate.artist_name}
                  </h1>
                  {candidate.is_trending && (
                    <span className="rounded-full text-xs font-bold"
                      style={{ background: 'rgba(245,158,11,0.9)', color: '#000', paddingLeft: s(3), paddingRight: s(3), paddingTop: s(1), paddingBottom: s(1) }}>
                      🔥 Trending
                    </span>
                  )}
                </div>

                <p className="text-white/50 text-sm" style={{ marginBottom: s(1) }}>{candidate.full_name}</p>

                <div className="flex flex-wrap" style={{ gap: s(3), marginTop: s(3) }}>
                  <span className="flex items-center text-sm text-white/60" style={{ gap: s(1) }}>
                    <MapPin className="w-4 h-4 text-amber-400" /> {candidate.region}
                  </span>
                  {candidate.categories && (
                    <span className="rounded-full text-xs font-medium"
                      style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', paddingLeft: s(3), paddingRight: s(3), paddingTop: s(1), paddingBottom: s(1) }}>
                      {candidate.categories.name}
                    </span>
                  )}
                  {candidate.rank && (
                    <span className="flex items-center text-sm text-amber-400 font-bold" style={{ gap: s(1) }}>
                      <Trophy className="w-4 h-4" /> Rang #{candidate.rank}
                    </span>
                  )}
                </div>

                {/* Socials */}
                {socials.length > 0 && (
                  <div className="flex" style={{ gap: s(2), marginTop: s(4) }}>
                    {socials.map((social) => (
                      <a key={social.label} href={social.url!} target="_blank" rel="noopener noreferrer"
                        className="rounded-xl text-white/40 hover:text-amber-400 hover:bg-amber-400/10 transition-all"
                        style={{ padding: s(2), border: '1px solid rgba(255,255,255,0.08)' }}>
                        <social.icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Score */}
              <div className="sm:text-right">
                <p className="text-xs text-white/40 uppercase tracking-wider" style={{ marginBottom: s(1) }}>Score total</p>
                <p className="text-4xl font-black text-gold-gradient" style={{ fontFamily: 'var(--font-outfit)' }}>
                  {formatPoints(candidate.total_points)}
                </p>
                <p className="text-white/40 text-sm" style={{ marginTop: s(1) }}>{candidate.vote_count.toLocaleString('fr-FR')} votes</p>
              </div>
            </div>

            {/* Bio */}
            {candidate.biography && (
              <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.06)', marginTop: s(6), paddingTop: s(6) }}>
                <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-widest" style={{ marginBottom: s(3) }}>Biographie</h2>
                <p className="text-white/70 leading-relaxed">{candidate.biography}</p>
              </div>
            )}

            {/* Video */}
            {candidate.video_url && (
              <div style={{ marginTop: s(6) }}>
                <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-widest" style={{ marginBottom: s(3) }}>Vidéo live</h2>
                <div className="rounded-2xl overflow-hidden aspect-video">
                  <iframe
                    src={candidate.video_url.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    allowFullScreen
                    title={`${candidate.artist_name} — vidéo`}
                  />
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row" style={{ marginTop: s(8), gap: s(3) }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setVoteOpen(true)}
                className="btn-gold text-lg flex-1 text-center"
                style={{ paddingLeft: s(8), paddingRight: s(8), paddingTop: s(4), paddingBottom: s(4) }}
              >
                🗳️ Voter pour {candidate.artist_name}
              </motion.button>

              <a
                href={getWhatsAppShareUrl(candidate.artist_name, candidate.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold flex items-center justify-center text-sm"
                style={{ paddingLeft: s(6), paddingRight: s(6), paddingTop: s(4), paddingBottom: s(4), gap: s(2) }}
              >
                <Share2 className="w-4 h-4" />
                Partager sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Vote Modal */}
      <VoteModal candidate={candidate} isOpen={voteOpen} onClose={() => setVoteOpen(false)} />
    </>
  );
}
