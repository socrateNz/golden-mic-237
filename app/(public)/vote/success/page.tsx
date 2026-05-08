import { Suspense } from 'react';
import VoteSuccessClient from './vote-success-client';

export default function VoteSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <VoteSuccessClient />
    </Suspense>
  );
}
