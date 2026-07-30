export interface Candidate {
  id: string;
  full_name: string;
  artist_name: string;
  slug: string;
  date_of_birth: string;
  region: string;
  category_id: string | null;
  phone: string;
  email: string | null;
  biography: string | null;
  photo_url: string | null;
  video_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;
  total_points: number;
  vote_count: number;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  is_trending: boolean;
  rank: number | null;
  created_at: string;
  note_totale?: number;
  jury_ecriture?: number;
  jury_technique?: number;
  jury_attitude?: number;
  jury_originalite?: number;
  social_likes?: number;
  social_comments?: number;
  social_shares?: number;
  phase_vote_points?: number;
  phase_jury_ecriture?: number;
  phase_jury_technique?: number;
  phase_jury_attitude?: number;
  phase_jury_originalite?: number;
  phase_social_likes?: number;
  phase_social_comments?: number;
  phase_social_shares?: number;
  categories?: { name: string; slug: string } | null;
}

export interface Vote {
  id: string;
  points: number;
  amount: number;
  voter_name: string | null;
  created_at: string;
  candidates?: {
    artist_name: string;
    photo_url: string | null;
    slug: string;
  } | null;
}

export interface LeaderboardData {
  leaderboard: Candidate[];
  recentVotes: Vote[];
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface VoteInitiatePayload {
  candidateId: string;
  amount: number;
  voterName?: string;
  voterEmail?: string;
  voterPhone?: string;
}

export interface VoteInitiateResponse {
  transactionId: string;
  reference: string;
  paymentUrl?: string;
  checkoutUrl?: string;
  action?: string;
  ussdMessage?: string;
}

export interface Sponsor {
  id: string;
  company_name: string;
  logo_url: string | null;
  website_url: string | null;
  sponsorship_type: 'gold' | 'silver' | 'bronze' | 'media' | 'tech';
  display_order: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export const CAMEROON_REGIONS = ['Douala', 'Yaoundé'] as const;

export const VOTE_AMOUNTS = [100, 500, 1000, 2000, 5000, 10000] as const;
