import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPoints(points: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(points)} pts`;
}

export function calculateTotalNote(candidate: any): number {
  if (!candidate) return 0;
  if (candidate.note_totale !== undefined && candidate.note_totale !== null) return Number(candidate.note_totale);
  
  // Si note_totale n'est pas fourni, on le recalcule basé sur les colonnes de la phase courante
  const juryTotal = (candidate.phase_jury_ecriture || 0) + (candidate.phase_jury_technique || 0) + (candidate.phase_jury_attitude || 0) + (candidate.phase_jury_originalite || 0);
  const socialTotal = (candidate.phase_social_likes || 0) + ((candidate.phase_social_comments || 0) * 2) + ((candidate.phase_social_shares || 0) * 5);
  
  // S'il n'a pas les colonnes phase_ (ex: ancienne donnée), on fallback sur les globales pour la rétrocompatibilité
  if (candidate.phase_vote_points === undefined) {
    const oldJuryTotal = (candidate.jury_ecriture || 0) + (candidate.jury_technique || 0) + (candidate.jury_attitude || 0) + (candidate.jury_originalite || 0);
    const oldSocialTotal = (candidate.social_likes || 0) + ((candidate.social_comments || 0) * 2) + ((candidate.social_shares || 0) * 5);
    return oldJuryTotal + oldSocialTotal + (candidate.total_points || 0);
  }

  return juryTotal + socialTotal + (candidate.phase_vote_points || 0);
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

export function getWhatsAppShareUrl(candidateName: string, id: string): string {
  let baseUrl = 'http://localhost:3000';
  if (typeof window !== 'undefined') {
    baseUrl = window.location.origin;
  } else if (process.env.NEXT_PUBLIC_APP_URL) {
    baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  } else if (process.env.NEXT_PUBLIC_API_URL) {
    // Fallback: Attempt to guess frontend URL from API URL
    baseUrl = process.env.NEXT_PUBLIC_API_URL.replace('-backend', '-frontend').replace('3001', '3000');
  }

  const url = `${baseUrl}/candidates/${id}`;
  const text = encodeURIComponent(
    `🎤 Votez pour *${candidateName}* sur Golden Mic 237 ! 🇨🇲\n\n` +
    `Soutenez votre artiste préféré avec seulement 100 FCFA.\n\n${url}`
  );
  return `https://wa.me/?text=${text}`;
}
