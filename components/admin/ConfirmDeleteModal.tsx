import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { s } from '@/lib/spacing';
import LoadingButton from '@/components/LoadingButton';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  candidateName?: string;
}

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, isDeleting, candidateName }: ConfirmDeleteModalProps) {
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

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md rounded-2xl overflow-hidden glass z-10 flex flex-col"
            style={{
              background: 'linear-gradient(135deg, #1a0f0f 0%, #0a0000 100%)',
              border: '1px solid rgba(239,68,68,0.3)',
              boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 60px rgba(239, 68, 68, 0.1)',
            }}
          >
            {/* Header */}
            <div className="border-b border-red-500/10 flex items-center justify-between" style={{ padding: s(5) }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white" style={{ fontFamily: 'var(--font-outfit)' }}>
                    Confirmer la suppression
                  </h2>
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

            {/* Body */}
            <div style={{ padding: s(6) }}>
              <p className="text-white/70">
                Êtes-vous sûr de vouloir supprimer le candidat <span className="font-bold text-white">{candidateName}</span> ?
                <br /><br />
                <span className="text-red-400 text-sm">Cette action est irréversible.</span>
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-red-500/10" style={{ padding: s(5), backgroundColor: 'rgba(0,0,0,0.2)' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-outline"
                style={{ padding: `${s(2)} ${s(4)}`, borderRadius: s(2), border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              >
                Annuler
              </button>
              <LoadingButton
                type="button"
                onClick={onConfirm}
                isLoading={isDeleting}
                loadingText="Suppression..."
                size="md"
                className="btn-primary bg-red-600 hover:bg-red-700 text-white"
                style={{ padding: `${s(2)} ${s(4)}`, borderRadius: s(2) }}
              >
                Supprimer
              </LoadingButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
