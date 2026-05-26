'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { CAMEROON_REGIONS, type Category } from '@/types';
import { toast } from 'sonner';
import { CheckCircle2, Upload } from 'lucide-react';
import { s } from '@/lib/spacing';
import LoadingButton from '@/components/LoadingButton';

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post('/api/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => setSubmitted(true),
    onError: (err: Error) => toast.error(err.message),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Category[] }>('/api/categories');
      return data.data ?? [];
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (photoFile) fd.set('photo', photoFile);
    mutate(fd);
  };

  if (submitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ paddingTop: s(28), paddingLeft: s(6), paddingRight: s(6) }}
      >
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="glass text-center max-w-md w-full" style={{ padding: s(10) }}>
          <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto" style={{ marginBottom: s(4) }} />
          <h2 className="text-2xl font-black" style={{ fontFamily: 'var(--font-outfit)', marginBottom: s(3) }}>
            Candidature envoyée ! 🎉
          </h2>
          <p className="text-white/60 leading-relaxed">
            Votre dossier est en attente de validation. Notre équipe vous contactera sous 48h.
          </p>
        </motion.div>
      </div>
    );
  }

  const inputCls = "input-gold w-full";
  const labelCls = "block text-xs font-semibold text-white/50 uppercase tracking-wider";
  const labelStyle: React.CSSProperties = { marginBottom: s(1.5) };
  const fieldStyle: React.CSSProperties = { padding: `${s(3)} ${s(4)}`, borderRadius: s(2.5) };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ paddingTop: s(28), paddingBottom: s(20), paddingLeft: s(6), paddingRight: s(6) }}>
      <div className="max-w-2xl w-full mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center" style={{ marginBottom: s(10) }}>
          <h1 className="text-4xl font-black" style={{ fontFamily: 'var(--font-outfit)', marginBottom: s(3) }}>
            🎤 Rejoindre <span className="text-gold-gradient">Golden Mic 237</span>
          </h1>
          <p className="text-white/50">Remplissez le formulaire. Votre profil sera validé sous 48h.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass"
          style={{ padding: s(6) }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: s(6) }}>

            {/* Photo */}
            <div className="flex flex-col items-center" style={{ gap: s(4) }}>
              <label className="cursor-pointer group">
                <div className="w-28 h-28 rounded-2xl overflow-hidden ring-2 ring-amber-400/20 group-hover:ring-amber-400/50 transition-all flex items-center justify-center relative"
                  style={{ background: 'rgba(245,158,11,0.07)' }}>
                  {photoPreview
                    ? <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                    : <Upload className="w-8 h-8 text-amber-400/50" />}
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </label>
              <p className="text-xs text-white/40">Cliquez pour télécharger votre photo</p>
            </div>

            {/* Infos perso */}
            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: s(4) }}>
              <div>
                <label className={labelCls} style={labelStyle}>Nom complet *</label>
                <input name="fullName" required className={inputCls} style={fieldStyle} placeholder="Jean Dupont" />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Nom d&apos;artiste *</label>
                <input name="artistName" required className={inputCls} style={fieldStyle} placeholder="DJ Fiela" />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Date de naissance *</label>
                <input name="dateOfBirth" type="date" required className={inputCls} style={fieldStyle} />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Région *</label>
                <select name="region" required className={`${inputCls} bg-[#0f0f1a]`} style={fieldStyle}>
                  <option value="">Sélectionner...</option>
                  {CAMEROON_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Catégorie *</label>
                <select name="categoryId" required className={`${inputCls} bg-[#0f0f1a]`} style={fieldStyle}>
                  <option value="">Sélectionner...</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Téléphone *</label>
                <input name="phone" required className={inputCls} style={fieldStyle} placeholder="237XXXXXXXXX" />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Email</label>
                <input name="email" type="email" className={inputCls} style={fieldStyle} placeholder="artiste@email.com" />
              </div>
            </div>

            {/* Biographie */}
            <div>
              <label className={labelCls} style={labelStyle}>Biographie * (min. 50 caractères)</label>
              <textarea name="biography" required rows={4} className={inputCls} style={{ ...fieldStyle, resize: 'vertical' }}
                placeholder="Parlez-nous de vous, votre parcours musical, votre style..." />
            </div>

            {/* Vidéo */}
            <div>
              <label className={labelCls} style={labelStyle}>Lien vidéo YouTube (live / clip)</label>
              <input name="videoUrl" type="url" className={inputCls} style={fieldStyle} placeholder="https://youtube.com/watch?v=..." />
            </div>

            {/* Réseaux */}
            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: s(4) }}>
              <div>
                <label className={labelCls} style={labelStyle}>Instagram</label>
                <input name="instagramUrl" type="url" className={inputCls} style={fieldStyle} placeholder="https://instagram.com/..." />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Facebook</label>
                <input name="facebookUrl" type="url" className={inputCls} style={fieldStyle} placeholder="https://facebook.com/..." />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>TikTok</label>
                <input name="tiktokUrl" type="url" className={inputCls} style={fieldStyle} placeholder="https://tiktok.com/..." />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>YouTube</label>
                <input name="youtubeUrl" type="url" className={inputCls} style={fieldStyle} placeholder="https://youtube.com/..." />
              </div>
            </div>

            {/* Submit */}
            <LoadingButton
              type="submit"
              isLoading={isPending}
              loadingText="Envoi en cours..."
              size="lg"
              className="w-full"
            >
              🎤 Soumettre ma candidature
            </LoadingButton>
            <p className="text-center text-xs text-white/30">
              En soumettant, vous acceptez les conditions de participation à Golden Mic 237.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
