import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPoints(points: number): string {
  if (points >= 1_000_000) return `${(points / 1_000_000).toFixed(1)}M pts`;
  if (points >= 1_000) return `${(points / 1_000).toFixed(1)}K pts`;
  return `${points} pts`;
}

export function formatFCFA(amount: number): string {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatRelativeTime(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'À l\'instant';
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  return formatDate(dateString);
}

export function getWhatsAppShareUrl(candidateName: string, slug: string): string {
  let baseUrl = 'http://localhost:3000';
  if (typeof window !== 'undefined') {
    baseUrl = window.location.origin;
  } else if (process.env.NEXT_PUBLIC_APP_URL) {
    baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  } else if (process.env.NEXT_PUBLIC_API_URL) {
    // Fallback: Attempt to guess frontend URL from API URL
    baseUrl = process.env.NEXT_PUBLIC_API_URL.replace('-backend', '-frontend').replace('3001', '3000');
  }

  const url = `${baseUrl}/candidates/${slug}`;
  const text = encodeURIComponent(
    `🎤 Votez pour *${candidateName}* sur Golden Mic 237 ! 🇨🇲\n\n` +
    `Soutenez votre artiste préféré avec seulement 100 FCFA.\n\n${url}`
  );
  return `https://wa.me/?text=${text}`;
}
