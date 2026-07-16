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

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
        <Dialog.Content 
          className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] glass overflow-hidden shadow-xl"
          style={{ borderRadius: s(4) }}
        >
          <div className="flex items-center justify-between border-b" style={{ borderColor: 'rgba(255,255,255,0.06)', padding: s(4) }}>
            <Dialog.Title className="text-xl font-bold font-outfit text-white">Gestion des Phases</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-5 h-5 text-white/50" />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div className="text-sm text-amber-200/80">
                <p className="font-semibold text-amber-400 mb-1">Attention, cette action est irréversible.</p>
                Les candidats avec les notes les plus faibles seront marqués comme éliminés. Les compteurs de votes et notes de la phase actuelle seront réinitialisés pour les qualifiés afin de démarrer la nouvelle phase.
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">Phase Actuelle</label>
              <div className="input-gold px-4 py-3 rounded-xl bg-white/5 opacity-50 cursor-not-allowed">
                {currentPhaseName || 'Inconnue'}
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">Nom de la nouvelle phase</label>
              <input
                type="text"
                value={nextPhaseName}
                onChange={(e) => setNextPhaseName(e.target.value)}
                placeholder="Ex: Huitièmes de finale"
                className="input-gold w-full px-4 py-3 rounded-xl outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">Nombre de candidats à éliminer</label>
              <input
                type="number"
                min="0"
                value={eliminationCount}
                onChange={(e) => setEliminationCount(parseInt(e.target.value))}
                className="input-gold w-full px-4 py-3 rounded-xl outline-none"
                required
              />
            </div>

            <LoadingButton
              onClick={() => transitionPhase()}
              isLoading={isPending}
              className="w-full mt-4"
              disabled={!nextPhaseName || eliminationCount < 0}
            >
              Clôturer la phase et continuer <ChevronRight className="w-4 h-4 ml-2" />
            </LoadingButton>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
