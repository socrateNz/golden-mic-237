'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Candidate, PaginatedResponse } from '@/types';

interface UseCandidatesParams {
  page?: number;
  limit?: number;
  region?: string;
  categoryId?: string;
  search?: string;
  sort?: 'points' | 'recent' | 'votes';
}

export function useCandidates(params: UseCandidatesParams = {}) {
  const { page = 1, limit = 12, region, categoryId, search, sort = 'points' } = params;

  return useQuery<PaginatedResponse<Candidate>>({
    queryKey: ['candidates', { page, limit, region, categoryId, search, sort }],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort,
        ...(region && { region }),
        ...(categoryId && { categoryId }),
        ...(search && { search }),
      });
      const { data } = await api.get<PaginatedResponse<Candidate>>(`/api/candidates?${searchParams}`);
      return data;
    },
  });
}

export function useCandidate(id: string) {
  return useQuery<Candidate>({
    queryKey: ['candidate', id],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Candidate }>(`/api/candidates/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}
