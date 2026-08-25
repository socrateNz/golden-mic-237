'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Smartphone, CheckCircle2, XCircle } from 'lucide-react';
import { useInitiateVote } from '@/hooks/useVote';
import { VOTE_AMOUNTS, type Candidate, type VoteInitiateResponse } from '@/types';
import { formatFCFA } from '@/lib/utils';
import { toast } from 'sonner';
import { s } from '@/lib/spacing';
import LoadingButton from '@/components/LoadingButton';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

const SUPPORTED_COUNTRIES = [
  { code: 'CM', dialCode: '+237', name: 'Cameroun', flag: '🇨🇲' },
  { code: 'GA', dialCode: '+241', name: 'Gabon', flag: '🇬🇦' },
  { code: 'CI', dialCode: '+225', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { code: 'SN', dialCode: '+221', name: 'Sénégal', flag: '🇸🇳' },
  { code: 'NG', dialCode: '+234', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'GH', dialCode: '+233', name: 'Ghana', flag: '🇬🇭' },
  { code: 'KE', dialCode: '+254', name: 'Kenya', flag: '🇰🇪' },
  { code: 'UG', dialCode: '+256', name: 'Ouganda', flag: '🇺🇬' },
];

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
  const [selectedCountry, setSelectedCountry] = useState(SUPPORTED_COUNTRIES[0]);
  const [localPhone, setLocalPhone] = useState('');
  const voterPhone = localPhone ? `${selectedCountry.dialCode}${localPhone.replace(/\D/g, '')}` : '';
  const [paymentData, setPaymentData] = useState<VoteInitiateResponse | null>(null);
  const [paymentFrameLoaded, setPaymentFrameLoaded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'complete' | 'failed'>('pending');
  const [statusCheckTimeout, setStatusCheckTimeout] = useState<NodeJS.Timeout | null>(null);

  const queryClient = useQueryClient();

  const { mutate: initiateVote, isPending } = useInitiateVote();

  const effectiveAmount = selectedAmount ?? (customAmount ? parseInt(customAmount) : null);
  const points = effectiveAmount ? Math.floor(effectiveAmount / 10) : 0;
  const inputStyle: React.CSSProperties = { padding: `${s(3)} ${s(4)}`, borderRadius: s(2.5) };
  const paymentUrl = paymentData?.paymentUrl ?? null;
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

  const startStatusChecking = (payment: VoteInitiateResponse) => {
    let checkCount = 0;
    const maxChecks = 75; // 5 minutes avec 4s intervalle

    const checkStatus = async () => {
      try {
        checkCount++;
        const { data } = await api.get(`/api/payments/check-status?reference=${payment.reference}`);

        if (data.data?.status === 'complete') {
          setPaymentStatus('complete');
          setStatusCheckTimeout(null);

          // Rafraîchir les points du candidat et le classement
          queryClient.invalidateQueries({ queryKey: ['candidates'] });
          queryClient.invalidateQueries({ queryKey: ['candidate', candidate.id] });
          queryClient.invalidateQueries({ queryKey: ['leaderboard'] });

          toast.success('Paiement confirmé! Vos points ont été attribués.');

          // Fermer le modal après 2 secondes
          setTimeout(() => closeAll(), 5000);
        } else if (data.data?.status === 'failed' || data.data?.status === 'cancelled') {
          setPaymentStatus('failed');
          setStatusCheckTimeout(null);
          toast.error(`Paiement ${data.data.status}`);
        } else if (checkCount >= maxChecks) {
          // Timeout après 5 minutes
          setStatusCheckTimeout(null);
          toast.info('Vérification du paiement terminée. Contactez le support si vous avez des questions.');
        } else {
          // Planifier la prochaine vérification toutes les 4s
          const timeout = setTimeout(checkStatus, 4000);
          setStatusCheckTimeout(timeout);
        }
      } catch (err) {
        console.error('Erreur vérification statut:', err);
        // Planifier la prochaine tentative même en cas d'erreur de réseau, sauf si max de tentatives atteint
        if (checkCount < maxChecks) {
          const timeout = setTimeout(checkStatus, 4000);
          setStatusCheckTimeout(timeout);
        } else {
          setStatusCheckTimeout(null);
        }
      }
    };

    // Check immédiatement
    checkStatus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveAmount || effectiveAmount < 200) {
      toast.error('Montant minimum : 200 FCFA');
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
          setPaymentStatus('pending');
          startStatusChecking(data);
        },
        onError: (err) => toast.error(err.message ?? 'Erreur lors du vote'),
      }
    );
  };

  const closeAll = () => {
    setPaymentData(null);
    setPaymentFrameLoaded(false);
    setPaymentStatus('pending');
    setVoterName('');
    setVoterEmail('');
    setLocalPhone('');
    setSelectedCountry(SUPPORTED_COUNTRIES[0]);
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
              border: '1px solid rgba(245, 158, 11, 0.3)',
              boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 60px rgba(245, 158, 11, 0.1)',
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
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: currentStep === 1 ? '50%' : '100%',
                      background: '#f59e0b',
                    }}
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
                    <div className="flex" style={{ gap: s(2) }}>
                      <select
                        value={selectedCountry.code}
                        onChange={(e) => {
                          const country = SUPPORTED_COUNTRIES.find(c => c.code === e.target.value);
                          if (country) setSelectedCountry(country);
                        }}
                        className="input-gold"
                        style={{
                          ...inputStyle,
                          width: '110px',
                          padding: `0 ${s(3)}`,
                          cursor: 'pointer'
                        }}
                      >
                        {SUPPORTED_COUNTRIES.map(c => (
                          <option key={c.code} value={c.code} style={{ background: '#0f0f1a', color: '#fff' }}>
                            {c.flag} {c.dialCode}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        placeholder={selectedCountry.code === 'CM' ? "6XX XX XX XX" : "Numéro de téléphone"}
                        value={localPhone}
                        onChange={(e) => setLocalPhone(e.target.value)}
                        className="input-gold"
                        style={{ ...inputStyle, flex: 1 }}
                        required
                      />
                    </div>
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
                      Ou montant libre (min. 200 FCFA)
                    </label>
                    <input
                      type="number"
                      min={200}
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
                    <span>Mobile Money (Cameroun & International)</span>
                  </div>

                  {/* Submit */}
                  <LoadingButton
                    type="submit"
                    isLoading={isPending}
                    loadingText="Initialisation du paiement..."
                    disabled={!effectiveAmount || effectiveAmount < 200 || !voterPhone}
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
                  </div>

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
                          <p className="text-xs text-white/40">MoneyFusion peut prendre quelques secondes</p>
                        </div>
                      )}
                      <iframe
                        src={paymentUrl}
                        title="Paiement MoneyFusion"
                        className="w-full h-full border-0 bg-transparent transition-opacity duration-300"
                        style={{ opacity: paymentFrameLoaded ? 1 : 0 }}
                        onLoad={() => setPaymentFrameLoaded(true)}
                      />
                    </div>
                  )}

                  {paymentUrl && paymentStatus === 'pending' && (
                    <a
                      href={paymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center text-[10px] text-white/40 hover:text-amber-400 transition-colors underline"
                    >
                      Ouvrir la page de paiement dans un nouvel onglet
                    </a>
                  )}

                  {paymentStatus === 'failed' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-xl text-center flex flex-col gap-3"
                      style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: s(4), marginBottom: s(4) }}
                    >
                      <XCircle className="w-8 h-8 text-red-500 mx-auto" />
                      <div>
                        <p className="text-white text-sm font-bold">Échec du paiement</p>
                        <p className="text-white/60 text-xs mt-1">
                          Votre transaction n'a pas pu être finalisée. Veuillez vérifier votre solde ou essayer un autre moyen de paiement.
                        </p>
                      </div>
                      <LoadingButton
                        type="button"
                        onClick={() => {
                          setPaymentData(null);
                          setPaymentFrameLoaded(false);
                          setPaymentStatus('pending');
                        }}
                        style={{ marginTop: s(2), background: 'linear-gradient(135deg, #ef4444, #b91c1c)', color: '#fff' }}
                      >
                        Réessayer
                      </LoadingButton>
                    </motion.div>
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
                🔒 Paiement sécurisé via MoneyFusion • Aucun compte requis
              </p>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
