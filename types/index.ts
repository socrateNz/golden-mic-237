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

export const CAMEROON_REGIONS = [
  'Adamaoua', 'Centre', 'Est', 'Extrême-Nord', 'Littoral',
  'Nord', 'Nord-Ouest', 'Ouest', 'Sud', 'Sud-Ouest',
] as const;

export const VOTE_AMOUNTS = [100, 500, 1000, 2000, 5000, 10000] as const;
