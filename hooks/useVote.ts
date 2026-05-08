'use client';

import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { VoteInitiatePayload, VoteInitiateResponse, ApiResponse } from '@/types';

export function useInitiateVote() {
  return useMutation({
    mutationFn: async (payload: VoteInitiatePayload): Promise<VoteInitiateResponse> => {
      const { data } = await api.post<ApiResponse<VoteInitiateResponse>>('/api/votes/initiate', payload);
      return data.data;
    },
  });
}
