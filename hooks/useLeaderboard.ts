'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { LeaderboardData, ApiResponse } from '@/types';

export function useLeaderboard() {
  return useQuery<LeaderboardData>({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<LeaderboardData>>('/api/leaderboard');
      return data.data;
    },
    staleTime: 10 * 1000, // 10 secondes (données live)
    refetchInterval: 30 * 1000, // Fallback polling 30s
  });
}
