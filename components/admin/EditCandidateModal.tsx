'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { type Category, type Candidate } from '@/types';
import { CAMEROON_REGIONS } from '@/types';
import { toast } from 'sonner';
import { X, Upload } from 'lucide-react';
import { s } from '@/lib/spacing';
import LoadingButton from '@/components/LoadingButton';

interface EditCandidateModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  adminToken: string;
}

export default function EditCandidateModal({ candidate, isOpen, onClose, adminToken }: EditCandidateModalProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen && candidate) {
      setPhotoPreview(candidate.photo_url);
      setPhotoFile(null);
    } else {
      setPhotoPreview(null);
      setPhotoFile(null);
    }
  }, [isOpen, candidate]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.patch('/api/admin/candidates', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'x-admin-token': adminToken
        },
      });
      return data;
    },
    onSuccess: () => {
      toast.success('Profil du candidat mis à jour !');
      queryClient.invalidateQueries({ queryKey: ['admin-candidates'] });
      queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
      onClose();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Category[] }>('/api/categories');
      return data.data ?? [];
    },
    enabled: isOpen,
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!candidate) return;

    const fd = new FormData(e.currentTarget);
    fd.set('id', candidate.id);
    if (photoFile) {
      fd.set('photo', photoFile);
    }
    mutate(fd);
  };

  if (!candidate) return null;

  const inputCls = "input-gold w-full";
  const labelCls = "block text-xs font-semibold text-white/50 uppercase tracking-wider";
  const labelStyle: React.CSSProperties = { marginBottom: s(1.5) };
  const fieldStyle: React.CSSProperties = { padding: `${s(3)} ${s(4)}`, borderRadius: s(2.5) };

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
                  📝 Modifier le candidat
                </h2>
                <p className="text-xs text-white/40">Modification du profil de {candidate.artist_name}</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all"
                style={{ padding: s(2) }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form (Scrollable) */}
            <div className="overflow-y-auto flex-1" style={{ padding: s(6) }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: s(5) }}>
                
                {/* Photo */}
                <div className="flex flex-col items-center" style={{ gap: s(2), marginBottom: s(2) }}>
                  <label className="cursor-pointer group">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-amber-400/20 group-hover:ring-amber-400/50 transition-all flex items-center justify-center relative"
                      style={{ background: 'rgba(245,158,11,0.07)' }}>
                      {photoPreview
                        ? <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                        : <Upload className="w-6 h-6 text-amber-400/50" />}
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  </label>
                  <p className="text-[11px] text-white/40">Cliquez pour modifier la photo</p>
                </div>

                {/* Infos perso */}
                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: s(4) }}>
                  <div>
                    <label className={labelCls} style={labelStyle}>Nom complet *</label>
                    <input name="fullName" required defaultValue={candidate.full_name} className={inputCls} style={fieldStyle} placeholder="Jean Dupont" />
                  </div>
                  <div>
                    <label className={labelCls} style={labelStyle}>Nom d&apos;artiste *</label>
                    <input name="artistName" required defaultValue={candidate.artist_name} className={inputCls} style={fieldStyle} placeholder="DJ Fiela" />
                  </div>

                  <div>
                    <label className={labelCls} style={labelStyle}>Catégorie *</label>
                    <select name="categoryId" required defaultValue={candidate.category_id ?? ''} className={`${inputCls} bg-[#0f0f1a]`} style={fieldStyle}>
                      <option value="">Sélectionner...</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls} style={labelStyle}>Région *</label>
                    <select name="region" required defaultValue={candidate.region ?? ''} className={`${inputCls} bg-[#0f0f1a]`} style={fieldStyle}>
                      <option value="">Sélectionner...</option>
                      {CAMEROON_REGIONS.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls} style={labelStyle}>Téléphone *</label>
                    <input name="phone" required defaultValue={candidate.phone} className={inputCls} style={fieldStyle} placeholder="237XXXXXXXXX" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls} style={labelStyle}>Email</label>
                    <input name="email" type="email" defaultValue={candidate.email ?? ''} className={inputCls} style={fieldStyle} placeholder="artiste@email.com" />
                  </div>
                </div>

                {/* Biographie */}
                <div>
                  <label className={labelCls} style={labelStyle}>Biographie * (min. 50 caractères)</label>
                  <textarea name="biography" required rows={3} defaultValue={candidate.biography ?? ''} className={inputCls} style={{ ...fieldStyle, resize: 'vertical' }}
                    placeholder="Parlez-nous de vous, votre parcours musical, votre style..." />
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
                    Enregistrer les modifications
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
