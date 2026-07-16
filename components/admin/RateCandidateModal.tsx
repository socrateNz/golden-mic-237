'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { type Candidate } from '@/types';
import { toast } from 'sonner';
import { X, Star, TrendingUp } from 'lucide-react';
import { s } from '@/lib/spacing';
import LoadingButton from '@/components/LoadingButton';

interface RateCandidateModalProps {
  candidate: any | null;
  isOpen: boolean;
  onClose: () => void;
  adminToken: string;
}

export default function RateCandidateModal({ candidate, isOpen, onClose, adminToken }: RateCandidateModalProps) {
  const queryClient = useQueryClient();

  const [juryEcriture, setJuryEcriture] = useState<number>(0);
  const [juryTechnique, setJuryTechnique] = useState<number>(0);
  const [juryAttitude, setJuryAttitude] = useState<number>(0);
  const [juryOriginalite, setJuryOriginalite] = useState<number>(0);

  const [socialLikes, setSocialLikes] = useState<number>(0);
  const [socialComments, setSocialComments] = useState<number>(0);
  const [socialShares, setSocialShares] = useState<number>(0);

  useEffect(() => {
    if (isOpen && candidate) {
      setJuryEcriture(candidate.jury_ecriture || 0);
      setJuryTechnique(candidate.jury_technique || 0);
      setJuryAttitude(candidate.jury_attitude || 0);
      setJuryOriginalite(candidate.jury_originalite || 0);

      setSocialLikes(candidate.social_likes || 0);
      setSocialComments(candidate.social_comments || 0);
      setSocialShares(candidate.social_shares || 0);
    }
  }, [isOpen, candidate]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/api/admin/candidates/score', data, {
        headers: { 
          'x-admin-token': adminToken
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Notes et statistiques mises à jour !');
      queryClient.invalidateQueries({ queryKey: ['admin-candidates'] });
      queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      if (candidate?.id) {
        queryClient.invalidateQueries({ queryKey: ['candidate', candidate.id] });
      }
      onClose();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!candidate) return;

    mutate({
      id: candidate.id,
      jury_ecriture: juryEcriture,
      jury_technique: juryTechnique,
      jury_attitude: juryAttitude,
      jury_originalite: juryOriginalite,
      social_likes: socialLikes,
      social_comments: socialComments,
      social_shares: socialShares,
    });
  };

  if (!candidate) return null;

  const totalJury = (juryEcriture + juryTechnique + juryAttitude + juryOriginalite).toFixed(2);
  const totalSocial = (socialLikes * 1) + (socialComments * 2) + (socialShares * 5);

  const inputCls = "input-gold w-full";
  const labelCls = "block text-xs font-semibold text-white/50 uppercase tracking-wider";
  const labelStyle: React.CSSProperties = { marginBottom: s(1.5) };
  const fieldStyle: React.CSSProperties = { padding: `${s(2.5)} ${s(4)}`, borderRadius: s(2) };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto" style={{ padding: s(4) }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

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
                <h2 className="text-xl font-black text-gold-gradient flex items-center gap-2" style={{ fontFamily: 'var(--font-outfit)' }}>
                  <Star className="w-5 h-5" /> Noter le candidat
                </h2>
                <p className="text-xs text-white/40">Évaluation de {candidate.artist_name}</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all"
                style={{ padding: s(2) }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="overflow-y-auto flex-1" style={{ padding: s(6) }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: s(6) }}>
                
                {/* Section Jury */}
                <div className="p-5 rounded-2xl border border-amber-400/20 bg-amber-400/5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-amber-400 flex items-center gap-2" style={{ fontFamily: 'var(--font-outfit)' }}>
                      <Star className="w-4 h-4" /> Note du Jury
                    </h3>
                    <div className="text-xl font-black text-white">{totalJury} <span className="text-sm text-white/40">/ 50</span></div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: s(4) }}>
                    <div>
                      <label className={labelCls} style={labelStyle}>Écriture (max 12.5)</label>
                      <input type="number" step="0.01" min="0" max="12.5" required value={juryEcriture} onChange={e => setJuryEcriture(Number(e.target.value))} className={inputCls} style={fieldStyle} />
                    </div>
                    <div>
                      <label className={labelCls} style={labelStyle}>Technique Vocale (max 12.5)</label>
                      <input type="number" step="0.01" min="0" max="12.5" required value={juryTechnique} onChange={e => setJuryTechnique(Number(e.target.value))} className={inputCls} style={fieldStyle} />
                    </div>
                    <div>
                      <label className={labelCls} style={labelStyle}>Attitude (max 12.5)</label>
                      <input type="number" step="0.01" min="0" max="12.5" required value={juryAttitude} onChange={e => setJuryAttitude(Number(e.target.value))} className={inputCls} style={fieldStyle} />
                    </div>
                    <div>
                      <label className={labelCls} style={labelStyle}>Originalité (max 12.5)</label>
                      <input type="number" step="0.01" min="0" max="12.5" required value={juryOriginalite} onChange={e => setJuryOriginalite(Number(e.target.value))} className={inputCls} style={fieldStyle} />
                    </div>
                  </div>
                </div>

                {/* Section Réseaux Sociaux */}
                <div className="p-5 rounded-2xl border border-blue-400/20 bg-blue-400/5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-blue-400 flex items-center gap-2" style={{ fontFamily: 'var(--font-outfit)' }}>
                      <TrendingUp className="w-4 h-4" /> Statistiques Réseaux Sociaux
                    </h3>
                    <div className="text-xl font-black text-white">{totalSocial} <span className="text-sm text-white/40">pts</span></div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: s(4) }}>
                    <div>
                      <label className={labelCls} style={labelStyle}>Likes (1 pt)</label>
                      <input type="number" min="0" required value={socialLikes} onChange={e => setSocialLikes(Number(e.target.value))} className={inputCls} style={fieldStyle} />
                    </div>
                    <div>
                      <label className={labelCls} style={labelStyle}>Commentaires (2 pts)</label>
                      <input type="number" min="0" required value={socialComments} onChange={e => setSocialComments(Number(e.target.value))} className={inputCls} style={fieldStyle} />
                    </div>
                    <div>
                      <label className={labelCls} style={labelStyle}>Partages (5 pts)</label>
                      <input type="number" min="0" required value={socialShares} onChange={e => setSocialShares(Number(e.target.value))} className={inputCls} style={fieldStyle} />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3 border-t border-amber-400/10" style={{ paddingTop: s(5), marginTop: s(2) }}>
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-outline-gold"
                    style={{ padding: `${s(2.5)} ${s(6)}`, borderRadius: s(2) }}
                  >
                    Annuler
                  </button>
                  <LoadingButton
                    type="submit"
                    isLoading={isPending}
                    loadingText="Enregistrement..."
                    size="md"
                    className="btn-gold"
                    style={{ padding: `${s(2.5)} ${s(6)}`, borderRadius: s(2) }}
                  >
                    Enregistrer les notes
                  </LoadingButton>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
