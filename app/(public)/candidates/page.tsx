'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useCandidates } from '@/hooks/useCandidates';
import CandidateCard from '@/components/candidates/CandidateCard';
import LoadingButton from '@/components/LoadingButton';
import { CAMEROON_REGIONS } from '@/types';
import { s } from '@/lib/spacing';

export default function CandidatesPage() {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [sort, setSort] = useState<'points' | 'recent' | 'votes'>('points');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useCandidates({ search, region, sort, page, limit: 12 });
  const filterInputStyle: React.CSSProperties = { padding: `${s(3)} ${s(4)}`, borderRadius: s(2.5) };

  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ paddingTop: s(28), paddingBottom: s(20), paddingLeft: s(6), paddingRight: s(6) }}>
      <div className="max-w-7xl w-full mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: s(10) }}>
          <h1 className="text-4xl font-black" style={{ fontFamily: 'var(--font-outfit)', marginBottom: s(2) }}>
            🎤 Les <span className="text-gold-gradient">Candidats</span>
          </h1>
          <p className="text-white/50">
            {data?.meta.total ?? '...'} artistes en compétition
          </p>
        </motion.div>

        {/* Filtres */}
        <div className="glass flex flex-col sm:flex-row" style={{ padding: s(4), marginBottom: s(8), gap: s(3) }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Rechercher un artiste..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-gold"
              style={{ ...filterInputStyle, paddingLeft: s(10) }}
            />
          </div>
          <select
            value={region}
            onChange={(e) => { setRegion(e.target.value); setPage(1); }}
            className="input-gold sm:w-48 bg-[#0f0f1a]"
            style={filterInputStyle}
          >
            <option value="">Toutes les régions</option>
            {CAMEROON_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value as typeof sort); setPage(1); }}
            className="input-gold sm:w-44 bg-[#0f0f1a]"
            style={filterInputStyle}
          >
            <option value="points">Par score</option>
            <option value="votes">Par votes</option>
            <option value="recent">Plus récents</option>
          </select>
        </div>

        {/* États */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ gap: s(5) }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass h-72 animate-pulse rounded-2xl" />
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center" style={{ paddingTop: s(20), paddingBottom: s(20) }}>
            <p className="text-4xl" style={{ marginBottom: s(4) }}>😕</p>
            <p className="text-white/50">Impossible de charger les candidats.</p>
          </div>
        )}

        {!isLoading && data?.data.length === 0 && (
          <div className="text-center" style={{ paddingTop: s(20), paddingBottom: s(20) }}>
            <p className="text-4xl" style={{ marginBottom: s(4) }}>🔍</p>
            <p className="text-white/50">Aucun candidat trouvé.</p>
          </div>
        )}

        {data && data.data.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ gap: s(5) }}>
              {data.data.map((candidate, i) => (
                <CandidateCard key={candidate.id} candidate={candidate} index={i} />
              ))}
            </div>

            {data.meta.totalPages > 1 && (
              <div className="flex justify-center" style={{ gap: s(3), marginTop: s(10) }}>
                <LoadingButton
                  variant="outline-gold"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ← Précédent
                </LoadingButton>
                <span className="flex items-center text-sm text-white/50" style={{ paddingLeft: s(5), paddingRight: s(5) }}>
                  Page {page} / {data.meta.totalPages}
                </span>
                <LoadingButton
                  variant="outline-gold"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))}
                  disabled={page === data.meta.totalPages}
                >
                  Suivant →
                </LoadingButton>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
