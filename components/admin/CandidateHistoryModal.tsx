'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, History, Award, CheckCircle2, XCircle, Star, ThumbsUp, MessageSquare, Share2, PenTool, Cpu, Heart, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { s } from '@/lib/spacing';
import { type Candidate } from '@/types';

interface PhaseScoreRecord {
  id: string;
  candidate_id: string;
  phase_id: string;
  phase_name: string;
  vote_points: number;
  jury_ecriture: number;
  jury_technique: number;
  jury_attitude: number;
  jury_originalite: number;
  social_likes: number;
  social_comments: number;
  social_shares: number;
  total_score: number;
  is_eliminated_in_phase: boolean;
  created_at: string;
}

interface CandidateHistoryModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  adminToken: string;
}

export default function CandidateHistoryModal({ candidate, isOpen, onClose, adminToken }: CandidateHistoryModalProps) {
  const { data: history = [], isLoading } = useQuery<PhaseScoreRecord[]>({
    queryKey: ['candidate-history', candidate?.id],
    queryFn: async () => {
      if (!candidate?.id) return [];
      const { data } = await api.get(`/api/admin/candidates/${candidate.id}/history`, {
        headers: { 'x-admin-token': adminToken },
      });
      return data.history || [];
    },
    enabled: isOpen && !!candidate?.id && !!adminToken,
  });

  if (!candidate) return null;

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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gold-gradient" style={{ fontFamily: 'var(--font-outfit)' }}>
                    Historique des Phases
                  </h2>
                  <p className="text-xs text-white/50">Candidat : <strong className="text-white">{candidate.artist_name}</strong> ({candidate.full_name})</p>
                </div>
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
              {isLoading ? (
                <div className="py-12 text-center text-white/40 text-sm">Chargement de l&apos;historique...</div>
              ) : history.length === 0 ? (
                <div className="py-12 text-center text-white/40 text-sm">
                  Aucun historique de phase archivé pour l&apos;instant.
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {history.map((record, index) => {
                    const juryTotal = (record.jury_ecriture || 0) + (record.jury_technique || 0) + (record.jury_attitude || 0) + (record.jury_originalite || 0);
                    const socialTotal = (record.social_likes || 0) + ((record.social_comments || 0) * 2) + ((record.social_shares || 0) * 5);

                    return (
                      <div
                        key={record.id || index}
                        className="rounded-xl border border-white/10 bg-white/5 overflow-hidden flex flex-col gap-4"
                        style={{ padding: s(4.5) }}
                      >
                        {/* Header de phase */}
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-amber-400 uppercase tracking-wider">{record.phase_name}</span>
                            <span className="text-[10px] text-white/40">
                              • {new Date(record.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          {record.is_eliminated_in_phase ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                              <XCircle className="w-3.5 h-3.5" /> Éliminé
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Qualifié
                            </span>
                          )}
                        </div>

                        {/* Detail Scores */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {/* Votes Public */}
                          <div className="bg-black/30 border border-white/5 rounded-lg p-3 flex flex-col gap-1">
                            <span className="text-[10px] uppercase text-white/40 font-semibold flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-amber-400" /> Public (Votes)
                            </span>
                            <span className="text-lg font-black text-white">{record.vote_points.toLocaleString('fr-FR')} pts</span>
                          </div>

                          {/* Jury */}
                          <div className="bg-black/30 border border-white/5 rounded-lg p-3 flex flex-col gap-1">
                            <span className="text-[10px] uppercase text-white/40 font-semibold flex items-center gap-1">
                              <Award className="w-3.5 h-3.5 text-amber-400" /> Jury ({juryTotal}/50)
                            </span>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px] text-white/70">
                              <span className="flex items-center gap-1"><PenTool className="w-2.5 h-2.5 text-white/40" /> Écrit: {record.jury_ecriture}</span>
                              <span className="flex items-center gap-1"><Cpu className="w-2.5 h-2.5 text-white/40" /> Tech: {record.jury_technique}</span>
                              <span className="flex items-center gap-1"><Heart className="w-2.5 h-2.5 text-white/40" /> Att: {record.jury_attitude}</span>
                              <span className="flex items-center gap-1"><Sparkles className="w-2.5 h-2.5 text-white/40" /> Orig: {record.jury_originalite}</span>
                            </div>
                          </div>

                          {/* Social */}
                          <div className="bg-black/30 border border-white/5 rounded-lg p-3 flex flex-col gap-1">
                            <span className="text-[10px] uppercase text-white/40 font-semibold flex items-center gap-1">
                              <Share2 className="w-3.5 h-3.5 text-amber-400" /> Réseaux ({socialTotal} pts)
                            </span>
                            <div className="flex items-center gap-3 text-[11px] text-white/70">
                              <span className="flex items-center gap-1"><ThumbsUp className="w-2.5 h-2.5 text-white/40" /> {record.social_likes}</span>
                              <span className="flex items-center gap-1"><MessageSquare className="w-2.5 h-2.5 text-white/40" /> {record.social_comments}</span>
                              <span className="flex items-center gap-1"><Share2 className="w-2.5 h-2.5 text-white/40" /> {record.social_shares}</span>
                            </div>
                          </div>
                        </div>

                        {/* Total Score Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <span className="text-xs text-white/60 font-medium">Score Total Phase :</span>
                          <span className="text-xl font-black text-amber-400" style={{ fontFamily: 'var(--font-outfit)' }}>
                            {record.total_score.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} pts
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
