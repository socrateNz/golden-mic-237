'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, ChevronRight, AlertTriangle } from 'lucide-react';
import LoadingButton from '@/components/LoadingButton';
import { s } from '@/lib/spacing';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface PhaseManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminToken: string;
  currentPhaseName: string | undefined;
}

export default function PhaseManagerModal({ isOpen, onClose, adminToken, currentPhaseName }: PhaseManagerModalProps) {
  const [nextPhaseName, setNextPhaseName] = useState('');
  const [eliminationCount, setEliminationCount] = useState<number>(1);
  const qc = useQueryClient();

  const { mutate: transitionPhase, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await api.post(
        '/api/admin/phases/transition',
        { nextPhaseName, eliminationCount: Number(eliminationCount) },
        { headers: { 'x-admin-token': adminToken } }
      );
      return data;
    },
    onSuccess: () => {
      toast.success('Phase passée avec succès, les candidats ont été éliminés.');
      qc.invalidateQueries({ queryKey: ['admin-candidates'] });
      qc.invalidateQueries({ queryKey: ['current-phase'] });
      onClose();
      setNextPhaseName('');
      setEliminationCount(1);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Erreur lors de la transition');
    }
  });

  const inputCls = "input-gold w-full";
  const labelCls = "block text-xs font-semibold text-white/50 uppercase tracking-wider";
  const labelStyle: React.CSSProperties = { marginBottom: s(1.5) };
  const fieldStyle: React.CSSProperties = { padding: `${s(3)} ${s(4)}`, borderRadius: s(2.5) };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
        <Dialog.Content 
          className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] overflow-hidden outline-none"
          style={{ 
            borderRadius: s(4),
            background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0e00 100%)',
            border: '1px solid rgba(245,158,11,0.3)',
            boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 60px rgba(245, 158, 11, 0.1)',
          }}
        >
          <div className="flex items-center justify-between border-b" style={{ borderColor: 'rgba(245,158,11,0.1)', padding: s(5) }}>
            <Dialog.Title className="text-xl font-black text-gold-gradient" style={{ fontFamily: 'var(--font-outfit)' }}>
              Gestion des Phases
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all" style={{ padding: s(2) }}>
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div style={{ padding: s(6), display: 'flex', flexDirection: 'column', gap: s(5) }}>
            
            <div style={{ padding: s(4), borderRadius: s(3), border: '1px solid rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'flex-start', gap: s(3) }}>
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" style={{ marginTop: '2px' }} />
              <div className="text-sm text-amber-200/80 leading-relaxed">
                <p className="font-bold text-amber-400 mb-1">Attention, cette action est irréversible.</p>
                Les candidats avec les notes les plus faibles seront marqués comme éliminés. Les compteurs de votes et notes de la phase actuelle seront réinitialisés pour les qualifiés afin de démarrer la nouvelle phase.
              </div>
            </div>

            <div>
              <label className={labelCls} style={labelStyle}>Phase Actuelle</label>
              <div className={inputCls} style={{ ...fieldStyle, opacity: 0.5, cursor: 'not-allowed', background: 'rgba(255,255,255,0.05)' }}>
                {currentPhaseName || 'Inconnue'}
              </div>
            </div>

            <div>
              <label className={labelCls} style={labelStyle}>Nom de la nouvelle phase</label>
              <input
                type="text"
                value={nextPhaseName}
                onChange={(e) => setNextPhaseName(e.target.value)}
                placeholder="Ex: Huitièmes de finale"
                className={inputCls}
                style={fieldStyle}
                required
              />
            </div>

            <div>
              <label className={labelCls} style={labelStyle}>Nombre de candidats à éliminer</label>
              <input
                type="number"
                min="0"
                value={eliminationCount}
                onChange={(e) => setEliminationCount(parseInt(e.target.value))}
                className={inputCls}
                style={fieldStyle}
                required
              />
            </div>

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
                onClick={() => transitionPhase()}
                isLoading={isPending}
                className="btn-gold"
                disabled={!nextPhaseName || eliminationCount < 0}
                style={{ padding: `${s(2.5)} ${s(6)}`, borderRadius: s(2), display: 'flex', alignItems: 'center' }}
              >
                Clôturer la phase <ChevronRight className="w-4 h-4 ml-1" />
              </LoadingButton>
            </div>

          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
