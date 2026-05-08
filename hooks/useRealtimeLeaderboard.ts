'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase';

export function useRealtimeLeaderboard() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('leaderboard-realtime')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'candidates' }, () => {
        queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
        queryClient.invalidateQueries({ queryKey: ['candidates'] });
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, () => {
        queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
        queryClient.invalidateQueries({ queryKey: ['recent-votes'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
