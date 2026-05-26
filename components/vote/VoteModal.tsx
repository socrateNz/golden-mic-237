'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Smartphone, CheckCircle2, AlertCircle } from 'lucide-react';
import { useInitiateVote } from '@/hooks/useVote';
import { VOTE_AMOUNTS, type Candidate, type VoteInitiateResponse } from '@/types';
import { formatFCFA } from '@/lib/utils';
import { toast } from 'sonner';
import { s } from '@/lib/spacing';
import LoadingButton from '@/components/LoadingButton';
import { api } from '@/lib/api';

interface VoteModalProps {
  candidate: Candidate;
  isOpen: boolean;
  onClose: () => void;
}

export default function VoteModal({ candidate, isOpen, onClose }: VoteModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [voterName, setVoterName] = useState('');
  const [voterEmail, setVoterEmail] = useState('');
  const [voterPhone, setVoterPhone] = useState('');
  const [paymentData, setPaymentData] = useState<VoteInitiateResponse | null>(null);
  const [hasLaunchedUssd, setHasLaunchedUssd] = useState(false);
  const [paymentFrameLoaded, setPaymentFrameLoaded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'complete' | 'failed'>('pending');
  const [statusCheckTimeout, setStatusCheckTimeout] = useState<NodeJS.Timeout | null>(null);

  const { mutate: initiateVote, isPending } = useInitiateVote();

  const effectiveAmount = selectedAmount ?? (customAmount ? parseInt(customAmount) : null);
  const points = effectiveAmount ? Math.floor(effectiveAmount / 10) : 0;
  const inputStyle: React.CSSProperties = { padding: `${s(3)} ${s(4)}`, borderRadius: s(2.5) };
  const paymentUrl = paymentData?.paymentUrl ?? paymentData?.checkoutUrl ?? null;
  const currentStep = paymentData ? 2 : 1;

  // Nettoyage à la fermeture
  useEffect(() => {
    return () => {
      if (statusCheckTimeout) clearTimeout(statusCheckTimeout);
    };
  }, [statusCheckTimeout]);

  // Arrêter la vérification de statut si le modal ferme
  useEffect(() => {
    if (!isOpen && statusCheckTimeout) {
      clearTimeout(statusCheckTimeout);
      setStatusCheckTimeout(null);
    }
  }, [isOpen, statusCheckTimeout]);

  useEffect(() => {
    if (paymentUrl) setPaymentFrameLoaded(false);
  }, [paymentUrl]);

  const startStatusChecking = (reference: string) => {
    let checkCount = 0;
    const maxChecks = 60; // 2 minutes avec 2s intervalle

    const checkStatus = async () => {
      try {
        checkCount++;
        const { data } = await api.get(`/api/payments/check-status?reference=${reference}`);

        if (data.data?.status === 'complete') {
          setPaymentStatus('complete');
          setStatusCheckTimeout(null);
          toast.success('Paiement confirmé! Vos points ont été attribués.');
          
          // Fermer le modal après 2 secondes
          setTimeout(() => closeAll(), 2000);
        } else if (data.data?.status === 'failed' || data.data?.status === 'cancelled') {
          setPaymentStatus('failed');
          setStatusCheckTimeout(null);
          toast.error(`Paiement ${data.data.status}`);
        } else if (checkCount >= maxChecks) {
          // Timeout après 2 minutes
          setStatusCheckTimeout(null);
          toast.info('Vérification du paiement terminée. Contactez le support si vous avez des questions.');
        } else {
          // Planifier la prochaine vérification
          const timeout = setTimeout(checkStatus, 2000);
          setStatusCheckTimeout(timeout);
        }
      } catch (err) {
        console.error('Erreur vérification statut:', err);
        // Planifier la prochaine tentative même en cas d'erreur de réseau, sauf si max de tentatives atteint
        if (checkCount < maxChecks) {
          const timeout = setTimeout(checkStatus, 2000);
          setStatusCheckTimeout(timeout);
        } else {
          setStatusCheckTimeout(null);
        }
      }
    };

    // Check immédiatement
    checkStatus();
  };

  const tryLaunchUssdOnce = (message?: string | null) => {
    if (!message || hasLaunchedUssd) return;
    const match = message.match(/(\*[0-9*#]+#)/);
    if (!match?.[1]) return;
    setHasLaunchedUssd(true);
    window.location.href = `tel:${encodeURIComponent(match[1])}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveAmount || effectiveAmount < 100) {
      toast.error('Montant minimum : 100 FCFA');
      return;
    }
    if (!voterPhone) {
      toast.error('Numéro de téléphone requis');
      return;
    }

    initiateVote(
      {
        candidateId: candidate.id,
        amount: effectiveAmount,
        voterName: voterName || undefined,
        voterEmail: voterEmail || undefined,
        voterPhone,
      },
      {
        onSuccess: (data) => {
          setPaymentData(data);
          setPaymentStatus('checking');
          tryLaunchUssdOnce(data.ussdMessage);
          startStatusChecking(data.reference);
        },
        onError: (err) => toast.error(err.message ?? 'Erreur lors du vote'),
      }
    );
  };

  const closeAll = () => {
    setPaymentData(null);
    setHasLaunchedUssd(false);
    setPaymentFrameLoaded(false);
    setPaymentStatus('pending');
    setVoterName('');
    setVoterEmail('');
    setVoterPhone('');
    setSelectedAmount(null);
    setCustomAmount('');
    if (statusCheckTimeout) clearTimeout(statusCheckTimeout);
    setStatusCheckTimeout(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ padding: s(4) }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeAll}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0e00 100%)',
              border: '1px solid rgba(245,158,11,0.3)',
              boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 60px rgba(245,158,11,0.1)',
            }}
          >
            {/* Header */}
            <div className="border-b border-amber-400/10" style={{ padding: s(6) }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest">Voter pour</p>
                  <h2 className="text-xl font-black text-white" style={{ fontFamily: 'var(--font-outfit)', marginTop: s(0.5) }}>
                    {candidate.artist_name}
                  </h2>
                </div>
                <button
                  onClick={closeAll}
                  className="rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all"
                  style={{ padding: s(2) }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div style={{ marginTop: s(4) }}>
                <div className="flex items-center justify-between text-[11px] uppercase tracking-wider">
                  <span className={currentStep >= 1 ? 'text-amber-400 font-semibold' : 'text-white/40'}>1. Infos</span>
                  <span className={currentStep >= 2 ? 'text-amber-400 font-semibold' : 'text-white/40'}>2. Paiement</span>
                </div>
                <div className="w-full rounded-full bg-white/10" style={{ marginTop: s(2), height: '4px' }}>
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-300"
                    style={{ width: currentStep === 1 ? '50%' : '100%' }}
                  />
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: s(5), display: 'flex', flexDirection: 'column', gap: s(4) }}>
              {currentStep === 1 && (
                <>
                  {/* Infos du voteur */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: s(2) }}>
                    <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Votre numéro de téléphone *
                    </label>
                    <input
                      type="tel"
                      placeholder="Ex: 237 6XXXXXXXX"
                      value={voterPhone}
                      onChange={(e) => setVoterPhone(e.target.value)}
                      className="input-gold"
                      style={inputStyle}
                      required
                    />
                  </div>

                  {/* Montants prédéfinis */}
                  <div>
                    <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider" style={{ marginBottom: s(3) }}>
                      Choisir un montant
                    </label>
                    <div className="grid grid-cols-3" style={{ gap: s(2) }}>
                      {VOTE_AMOUNTS.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                          className="rounded-xl text-sm font-bold transition-all"
                          style={{
                            paddingTop: s(3),
                            paddingBottom: s(3),
                            paddingLeft: s(2),
                            paddingRight: s(2),
                            background: selectedAmount === amount
                              ? 'linear-gradient(135deg, #f59e0b, #b45309)'
                              : 'rgba(255,255,255,0.04)',
                            color: selectedAmount === amount ? '#000' : '#fff',
                            border: `1px solid ${selectedAmount === amount ? '#f59e0b' : 'rgba(255,255,255,0.08)'}`,
                          }}
                        >
                          <div>{formatFCFA(amount)}</div>
                          <div className="text-[10px] opacity-70" style={{ marginTop: s(0.5) }}>
                            {Math.floor(amount / 10)} pts
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Montant libre */}
                  <div>
                    <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider" style={{ marginBottom: s(2) }}>
                      Ou montant libre (min. 100 FCFA)
                    </label>
                    <input
                      type="number"
                      min={100}
                      placeholder="Ex: 2500"
                      value={customAmount}
                      onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                      className="input-gold"
                      style={inputStyle}
                    />
                  </div>

                  {/* Points preview */}
                  {effectiveAmount && effectiveAmount >= 100 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-xl text-center"
                      style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', padding: s(4) }}
                    >
                      <p className="text-white/60 text-xs">Vous allez attribuer</p>
                      <p className="text-3xl font-black text-gold-gradient" style={{ fontFamily: 'var(--font-outfit)', marginTop: s(1) }}>
                        +{points.toLocaleString('fr-FR')} points
                      </p>
                      <p className="text-white/40 text-xs" style={{ marginTop: s(1) }}>à {candidate.artist_name}</p>
                    </motion.div>
                  )}

                  {/* Payment info */}
                  <div className="flex text-xs text-white/40 items-center" style={{ gap: s(2) }}>
                    <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Mobile Money MTN/Orange</span>
                  </div>

                  {/* Submit */}
                  <LoadingButton
                    type="submit"
                    isLoading={isPending}
                    loadingText="Initialisation du paiement..."
                    disabled={!effectiveAmount || effectiveAmount < 100 || !voterPhone}
                    className="w-full"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Continuer vers paiement {effectiveAmount ? formatFCFA(effectiveAmount) : ''}
                  </LoadingButton>
                </>
              )}

              {currentStep === 2 && paymentData && (
                <>
                  <div className="rounded-xl" style={{ padding: s(4), background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <p className="text-sm text-white/80">
                      Référence: <span className="text-amber-400 font-semibold">{paymentData.reference}</span>
                    </p>
                    {paymentData.ussdMessage && (
                      <p className="text-xs text-white/60" style={{ marginTop: s(2) }}>
                        {paymentData.ussdMessage}
                      </p>
                    )}
                  </div>

                  {paymentStatus === 'checking' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-xl text-center"
                      style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', padding: s(4) }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        style={{ display: 'inline-block' }}
                      >
                        <AlertCircle className="w-8 h-8 text-blue-400" />
                      </motion.div>
                      <p className="text-white text-sm font-medium" style={{ marginTop: s(2) }}>Vérification du paiement en cours...</p>
                      <p className="text-white/50 text-xs" style={{ marginTop: s(1) }}>Veuillez patienter</p>
                    </motion.div>
                  )}

                  {paymentStatus === 'complete' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-xl text-center"
                      style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', padding: s(4) }}
                    >
                      <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto" />
                      <p className="text-white text-sm font-medium" style={{ marginTop: s(2) }}>Paiement confirmé!</p>
                      <p className="text-white/50 text-xs" style={{ marginTop: s(1) }}>Vos points ont été attribués</p>
                    </motion.div>
                  )}

                  {paymentUrl && paymentStatus === 'pending' && (
                    <div
                      className="relative rounded-xl overflow-hidden"
                      style={{
                        border: '1px solid rgba(255,255,255,0.08)',
                        height: '360px',
                        background: 'linear-gradient(180deg, #14141f 0%, #0a0a10 100%)',
                      }}
                    >
                      {!paymentFrameLoaded && (
                        <div
                          className="absolute inset-0 z-10 flex flex-col items-center justify-center"
                          style={{ gap: s(3), background: 'rgba(10,10,16,0.92)' }}
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          >
                            <CreditCard className="w-10 h-10 text-amber-400" />
                          </motion.div>
                          <p className="text-sm font-medium text-white/75">Chargement de la page de paiement…</p>
                          <p className="text-xs text-white/40">NotchPay peut prendre quelques secondes</p>
                        </div>
                      )}
                      <iframe
                        src={paymentUrl}
                        title="Paiement NotchPay"
                        className="w-full h-full border-0 bg-transparent transition-opacity duration-300"
                        style={{ opacity: paymentFrameLoaded ? 1 : 0 }}
                        onLoad={() => setPaymentFrameLoaded(true)}
                      />
                    </div>
                  )}

                  {paymentStatus === 'failed' && (
                    <div style={{ display: 'flex', gap: s(2), flexDirection: 'column' }}>
                      <LoadingButton
                        type="button"
                        onClick={() => {
                          setPaymentData(null);
                          setPaymentFrameLoaded(false);
                          setPaymentStatus('pending');
                        }}
                      >
                        Réessayer
                      </LoadingButton>
                    </div>
                  )}

                  {paymentStatus !== 'failed' && paymentStatus !== 'complete' && (
                    <div style={{ display: 'flex', gap: s(2), flexDirection: 'column' }}>
                      <LoadingButton
                        type="button"
                        variant="outline-gold"
                        onClick={() => {
                          setPaymentData(null);
                          setPaymentFrameLoaded(false);
                          setPaymentStatus('pending');
                        }}
                      >
                        Modifier le montant
                      </LoadingButton>
                    </div>
                  )}
                </>
              )}

              <p className="text-center text-[11px] text-white/30">
                🔒 Paiement sécurisé via NotchPay • Aucun compte requis
              </p>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
