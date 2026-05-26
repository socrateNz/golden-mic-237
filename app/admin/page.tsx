'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, setAdminToken } from '@/lib/api';
import { useAdminStore } from '@/store';
import { CheckCircle2, XCircle, PauseCircle, Users, TrendingUp, DollarSign, AlertTriangle, LogOut, Loader2 } from 'lucide-react';
import { formatPoints, formatFCFA } from '@/lib/utils';
import { toast } from 'sonner';
import { s } from '@/lib/spacing';
import LoadingButton from '@/components/LoadingButton';

export default function AdminDashboardPage() {
  const { adminToken, isAdmin, setAdminToken: storeToken, logout } = useAdminStore();
  const [loginKey, setLoginKey] = useState('');
  const qc = useQueryClient();
  const adminInputStyle: React.CSSProperties = { padding: `${s(3)} ${s(4)}`, borderRadius: s(2.5) };

  // Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    storeToken(loginKey);
    setAdminToken(loginKey);
  };

  // Data
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const { data } = await api.get('/api/admin/analytics', {
        headers: { 'x-admin-token': adminToken! },
      });
      return data.data;
    },
    enabled: isAdmin && !!adminToken,
    refetchInterval: 30_000,
  });

  const { data: candidates } = useQuery({
    queryKey: ['admin-candidates'],
    queryFn: async () => {
      const { data } = await api.get('/api/admin/candidates', {
        headers: { 'x-admin-token': adminToken! },
      });
      return data.data;
    },
    enabled: isAdmin && !!adminToken,
  });

  const { mutate: updateStatus, isPending: updating } = useMutation({
    mutationFn: async ({ id, status, reason }: { id: string; status: string; reason?: string }) => {
      await api.patch('/api/admin/candidates',
        { id, status, reason },
        { headers: { 'x-admin-token': adminToken! } }
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-candidates'] });
      qc.invalidateQueries({ queryKey: ['admin-analytics'] });
      toast.success('Statut mis à jour');
    },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  });

  // Login gate
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#050508', paddingLeft: s(6), paddingRight: s(6) }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass w-full max-w-sm text-center"
          style={{ padding: s(8) }}
        >
          <div className="text-4xl" style={{ marginBottom: s(4) }}>🔐</div>
          <h1 className="text-xl font-black" style={{ fontFamily: 'var(--font-outfit)', marginBottom: s(6) }}>
            Admin <span className="text-gold-gradient">Golden Mic 237</span>
          </h1>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: s(4) }}>
            <input
              type="password"
              placeholder="Clé d'accès admin"
              value={loginKey}
              onChange={(e) => setLoginKey(e.target.value)}
              className="input-gold"
              style={adminInputStyle}
              required
            />
            <LoadingButton
              type="submit"
              size="md"
              className="w-full"
            >
              Accéder
            </LoadingButton>
          </form>
        </motion.div>
      </div>
    );
  }

  const stats = analytics?.summary;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#050508', paddingTop: s(6), paddingBottom: s(20), paddingLeft: s(6), paddingRight: s(6) }}>
      <div className="max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between" style={{ marginBottom: s(8) }}>
          <h1 className="text-2xl font-black text-gold-gradient" style={{ fontFamily: 'var(--font-outfit)' }}>
            🎛️ Dashboard Admin
          </h1>
          <button onClick={() => { logout(); setAdminToken(null); }}
            className="flex items-center text-sm text-white/50 hover:text-red-400 transition-colors"
            style={{ gap: s(2) }}
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: s(4), marginBottom: s(8) }}>
          {[
            { icon: Users, label: 'Candidats', value: stats?.totalCandidates ?? '—', color: '#6366f1' },
            { icon: DollarSign, label: 'Revenus', value: stats ? formatFCFA(stats.totalRevenue) : '—', color: '#22c55e' },
            { icon: TrendingUp, label: 'Votes total', value: stats?.totalVotes?.toLocaleString('fr-FR') ?? '—', color: '#f59e0b' },
            { icon: AlertTriangle, label: 'Fraudes', value: analytics?.fraudAttempts?.length ?? '—', color: '#ef4444' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="glass"
              style={{ padding: s(5) }}
            >
              <div className="flex items-center" style={{ gap: s(3), marginBottom: s(3) }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${stat.color}20` }}>
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <p className="text-xs text-white/50 uppercase tracking-wider">{stat.label}</p>
              </div>
              <p className="text-2xl font-black" style={{ fontFamily: 'var(--font-outfit)' }}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Candidates table */}
        <div className="glass overflow-hidden" style={{ marginBottom: s(8) }}>
          <div
            className="border-b flex items-center justify-between"
            style={{
              borderColor: 'rgba(255,255,255,0.06)',
              paddingLeft: s(5),
              paddingRight: s(5),
              paddingTop: s(4),
              paddingBottom: s(4),
            }}
          >
            <h2 className="font-bold text-lg" style={{ fontFamily: 'var(--font-outfit)' }}>Gestion des candidats</h2>
            {updating && <Loader2 className="w-5 h-5 animate-spin text-amber-400" />}
          </div>

          {isLoading ? (
            <div className="text-center text-white/40" style={{ padding: s(8) }}>Chargement...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {['Artiste', 'Région', 'Points', 'Statut', 'Actions'].map((h) => (
                      <th
                        key={h}
                        className="text-left text-xs text-white/30 uppercase tracking-wider"
                        style={{ paddingLeft: s(5), paddingRight: s(5), paddingTop: s(3), paddingBottom: s(3) }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {candidates?.map((c: any) => (
                    <tr key={c.id} className="hover:bg-white/3 transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ paddingLeft: s(5), paddingRight: s(5), paddingTop: s(4), paddingBottom: s(4) }}>
                        <p className="font-semibold">{c.artist_name}</p>
                        <p className="text-white/40 text-xs">{c.full_name}</p>
                      </td>
                      <td className="text-white/60" style={{ paddingLeft: s(5), paddingRight: s(5), paddingTop: s(4), paddingBottom: s(4) }}>{c.region}</td>
                      <td className="font-bold text-amber-400" style={{ paddingLeft: s(5), paddingRight: s(5), paddingTop: s(4), paddingBottom: s(4) }}>{formatPoints(c.total_points)}</td>
                      <td style={{ paddingLeft: s(5), paddingRight: s(5), paddingTop: s(4), paddingBottom: s(4) }}>
                        <span className="text-xs font-semibold" style={{
                          paddingLeft: s(2),
                          paddingRight: s(2),
                          paddingTop: s(1),
                          paddingBottom: s(1),
                          borderRadius: '999px',
                          background: c.status === 'approved' ? 'rgba(34,197,94,0.15)' : c.status === 'pending' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                          color: c.status === 'approved' ? '#22c55e' : c.status === 'pending' ? '#f59e0b' : '#ef4444',
                        }}>
                          {c.status}
                        </span>
                      </td>
                      <td style={{ paddingLeft: s(5), paddingRight: s(5), paddingTop: s(4), paddingBottom: s(4) }}>
                        <div className="flex" style={{ gap: s(2) }}>
                          {c.status !== 'approved' && (
                            <button onClick={() => updateStatus({ id: c.id, status: 'approved' })}
                              className="rounded-lg text-green-400 hover:bg-green-400/10 transition-colors"
                              style={{ padding: s(1.5) }}
                              title="Valider"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          {c.status !== 'rejected' && (
                            <button onClick={() => updateStatus({ id: c.id, status: 'rejected' })}
                              className="rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
                              style={{ padding: s(1.5) }}
                              title="Rejeter"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          {c.status !== 'suspended' && (
                            <button onClick={() => updateStatus({ id: c.id, status: 'suspended' })}
                              className="rounded-lg text-orange-400 hover:bg-orange-400/10 transition-colors"
                              style={{ padding: s(1.5) }}
                              title="Suspendre"
                            >
                              <PauseCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Fraud logs */}
        {analytics?.fraudAttempts?.length > 0 && (
          <div className="glass overflow-hidden">
            <div
              className="border-b"
              style={{
                borderColor: 'rgba(255,255,255,0.06)',
                paddingLeft: s(5),
                paddingRight: s(5),
                paddingTop: s(4),
                paddingBottom: s(4),
              }}
            >
              <h2 className="font-bold text-lg text-red-400" style={{ fontFamily: 'var(--font-outfit)' }}>
                ⚠️ Tentatives de fraude
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {['IP', 'Type', 'Date'].map((h) => (
                      <th
                        key={h}
                        className="text-left text-xs text-white/30 uppercase"
                        style={{ paddingLeft: s(5), paddingRight: s(5), paddingTop: s(3), paddingBottom: s(3) }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {analytics.fraudAttempts.slice(0, 20).map((f: any) => (
                    <tr key={f.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td className="font-mono text-xs text-red-300" style={{ paddingLeft: s(5), paddingRight: s(5), paddingTop: s(3), paddingBottom: s(3) }}>
                        {f.ip_address}
                      </td>
                      <td className="text-white/60" style={{ paddingLeft: s(5), paddingRight: s(5), paddingTop: s(3), paddingBottom: s(3) }}>
                        {f.attempt_type}
                      </td>
                      <td className="text-white/40 text-xs" style={{ paddingLeft: s(5), paddingRight: s(5), paddingTop: s(3), paddingBottom: s(3) }}>
                        {new Date(f.created_at).toLocaleString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
