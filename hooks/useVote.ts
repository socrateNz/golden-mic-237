'use client';

import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { VoteInitiatePayload, VoteInitiateResponse, ApiResponse } from '@/types';

export function useInitiateVote() {
  return useMutation({
    mutationFn: async (payload: VoteInitiatePayload): Promise<VoteInitiateResponse> => {
      // NotchPay + DB peuvent dépasser 15 s (timeout global axios) : sans délai dédié, la requête est annulée côté navigateur alors que le backend répond encore 200.
      const { data } = await api.post<ApiResponse<VoteInitiateResponse>>(
        '/api/votes/initiate',
        payload,
        { timeout: 90_000 }
      );
      return data.data;
    },
  });
}
