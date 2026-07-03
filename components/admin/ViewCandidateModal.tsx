'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Mail, MapPin, Tag, Calendar, Music, Video, Award, Star } from 'lucide-react';
import { s } from '@/lib/spacing';
import { formatPoints } from '@/lib/utils';
import { type Candidate } from '@/types';

interface ViewCandidateModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewCandidateModal({ candidate, isOpen, onClose }: ViewCandidateModalProps) {
  if (!candidate) return null;

  // Extract YouTube ID if valid URL
  const getYoutubeEmbedUrl = (url: string | null) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return null;
  };

  const embedUrl = getYoutubeEmbedUrl(candidate.video_url);

  // Status Badge styles
  const statusColors = {
    approved: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e' },
    pending: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b' },
    rejected: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444' },
    suspended: { bg: 'rgba(249,115,22,0.15)', text: '#f97316' },
  };
  const statusStyle = statusColors[candidate.status] || statusColors.pending;

  const detailItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: s(3),
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: s(2),
    padding: s(3.5),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto" style={{ padding: s(4) }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl rounded-2xl overflow-hidden glass z-10 max-h-[90vh] flex flex-col"
            style={{
              background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0e00 100%)',
              border: '1px solid rgba(245,158,11,0.3)',
              boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 60px rgba(245, 158, 11, 0.1)',
            }}
          >
            {/* Header */}
            <div className="border-b border-amber-400/10 flex items-center justify-between sticky top-0 bg-[#0f0f1a]/95 backdrop-blur-md z-20" style={{ padding: s(5) }}>
              <div>
                <h2 className="text-xl font-black text-gold-gradient" style={{ fontFamily: 'var(--font-outfit)' }}>
                  👁️ Aperçu du Candidat
                </h2>
                <p className="text-xs text-white/40">Fiche d&apos;informations complète</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all"
                style={{ padding: s(2) }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div className="overflow-y-auto flex-1" style={{ padding: s(6) }}>
              <div className="flex flex-col gap-6">
                {/* Hero profile section */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-white/5" style={{ paddingBottom: s(5) }}>
                  <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-amber-400/30 flex-shrink-0 bg-white/5">
                    {candidate.photo_url ? (
                      <img src={candidate.photo_url} alt={candidate.artist_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20">
                        <User className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                      <h3 className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-outfit)' }}>
                        {candidate.artist_name}
                      </h3>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block self-center sm:self-start" style={{
                        background: statusStyle.bg,
                        color: statusStyle.text
                      }}>
                        {candidate.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm font-medium" style={{ marginTop: s(0.5) }}>{candidate.full_name}</p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4" style={{ marginTop: s(3) }}>
                      <div className="flex items-center text-amber-400 font-bold" style={{ gap: s(1.5) }}>
                        <Award className="w-4 h-4" />
                        <span className="text-sm">{formatPoints(candidate.total_points)} points</span>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      <div className="text-white/50 text-sm">
                        <span>{candidate.vote_count.toLocaleString('fr-FR')} votes</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div style={detailItemStyle}>
                    <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-white/40 uppercase font-semibold">Région</p>
                      <p className="text-sm text-white font-medium">{candidate.region}</p>
                    </div>
                  </div>
                  <div style={detailItemStyle}>
                    <Tag className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-white/40 uppercase font-semibold">Catégorie</p>
                      <p className="text-sm text-white font-medium">
                        {candidate.categories?.name ?? '—'}
                      </p>
                    </div>
                  </div>
                  <div style={detailItemStyle}>
                    <Phone className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-white/40 uppercase font-semibold">Téléphone</p>
                      <p className="text-sm text-white font-mono">{candidate.phone}</p>
                    </div>
                  </div>
                  <div style={detailItemStyle}>
                    <Mail className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-white/40 uppercase font-semibold">Email</p>
                      <p className="text-sm text-white font-medium">{candidate.email || 'Non renseigné'}</p>
                    </div>
                  </div>
                  <div style={detailItemStyle}>
                    <Calendar className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-white/40 uppercase font-semibold">Date de naissance</p>
                      <p className="text-sm text-white font-medium">
                        {candidate.date_of_birth ? new Date(candidate.date_of_birth).toLocaleDateString('fr-FR') : '—'}
                      </p>
                    </div>
                  </div>
                  {candidate.is_trending && (
                    <div style={{ ...detailItemStyle, border: '1px solid rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.03)' }}>
                      <Star className="w-5 h-5 text-amber-500 flex-shrink-0 fill-amber-500/20" />
                      <div>
                        <p className="text-[10px] text-amber-400 uppercase font-semibold">Mise en avant</p>
                        <p className="text-sm text-white font-medium">Tendance / En Vedette</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Biography */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Biographie</h4>
                  <div className="bg-white/2 border border-white/5 rounded-xl text-sm text-white/80 leading-relaxed" style={{ padding: s(4) }}>
                    {candidate.biography || 'Aucune biographie fournie.'}
                  </div>
                </div>

                {/* Social Networks */}
                {/* <div className="flex flex-col gap-2">
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Réseaux Sociaux</h4>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { icon: Instagram, label: 'Instagram', url: candidate.instagram_url },
                      { icon: Facebook, label: 'Facebook', url: candidate.facebook_url },
                      { icon: Music, label: 'TikTok', url: candidate.tiktok_url },
                      { icon: Youtube, label: 'YouTube', url: candidate.youtube_url },
                    ].map((network, i) => {
                      if (!network.url) return null;
                      return (
                        <a key={i} href={network.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center text-xs font-medium text-white/70 hover:text-amber-400 bg-white/3 hover:bg-amber-400/10 border border-white/5 hover:border-amber-400/20 rounded-xl transition-all"
                          style={{ padding: `${s(2)} ${s(3.5)}`, gap: s(2) }}
                        >
                          <network.icon className="w-4 h-4 text-amber-400" />
                          {network.label}
                        </a>
                      );
                    })}
                    {!candidate.instagram_url && !candidate.facebook_url && !candidate.tiktok_url && !candidate.youtube_url && (
                      <p className="text-xs text-white/40">Aucun lien de réseaux sociaux renseigné.</p>
                    )}
                  </div>
                </div> */}

                {/* Video Embed */}
                {candidate.video_url && (
                  <div className="flex flex-col gap-2">
                    <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center" style={{ gap: s(1.5) }}>
                      <Video className="w-4 h-4" /> Vidéo de Présentation
                    </h4>
                    {embedUrl ? (
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-white/5">
                        <iframe
                          src={embedUrl}
                          title={`Présentation de ${candidate.artist_name}`}
                          className="w-full h-full absolute inset-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <a href={candidate.video_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center text-xs font-medium text-white/70 hover:text-amber-400 bg-white/3 border border-white/5 rounded-xl transition-colors"
                        style={{ padding: s(3), gap: s(2) }}
                      >
                        {/* <Youtube className="w-4 h-4 text-red-500" /> */}
                        Ouvrir le lien vidéo : {candidate.video_url}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
