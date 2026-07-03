'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050508] text-white">
      <p className="text-white/50 text-sm">Redirection en cours...</p>
    </div>
  );
}
