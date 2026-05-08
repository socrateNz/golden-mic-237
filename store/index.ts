'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VoteStore {
  // Vote en cours
  selectedCandidateId: string | null;
  selectedAmount: number | null;
  pendingReference: string | null;

  // Actions
  selectCandidate: (id: string) => void;
  selectAmount: (amount: number) => void;
  setPendingReference: (ref: string) => void;
  resetVote: () => void;
}

export const useVoteStore = create<VoteStore>()(
  persist(
    (set) => ({
      selectedCandidateId: null,
      selectedAmount: null,
      pendingReference: null,

      selectCandidate: (id) => set({ selectedCandidateId: id }),
      selectAmount: (amount) => set({ selectedAmount: amount }),
      setPendingReference: (ref) => set({ pendingReference: ref }),
      resetVote: () => set({ selectedCandidateId: null, selectedAmount: null, pendingReference: null }),
    }),
    { name: 'gm237-vote-store' }
  )
);

interface AdminStore {
  adminToken: string | null;
  isAdmin: boolean;
  setAdminToken: (token: string) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      adminToken: null,
      isAdmin: false,
      setAdminToken: (token) => set({ adminToken: token, isAdmin: true }),
      logout: () => set({ adminToken: null, isAdmin: false }),
    }),
    { name: 'gm237-admin-store' }
  )
);
