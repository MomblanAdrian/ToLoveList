export interface Recommendation {
  id: string;
  title: string;
  description: string;
  whyMatch: string;
  compatibilityScore: number;
  categorySlug: string;
  metadata: Record<string, unknown>;
  source: string;
  createdAt: string;
}

export interface GenerateRecommendationRequest {
  categorySlug: string;
  profileIds: string[];
  groupId?: string;
  location?: {
    lat?: number;
    lng?: number;
    city?: string;
  };
}

export interface RecommendationMetadata {
  food?: FoodMetadata;
  travel?: TravelMetadata;
  book?: BookMetadata;
  game?: GameMetadata;
  leisure?: LeisureMetadata;
  tvShow?: TvShowMetadata;
}

export interface FoodMetadata {
  address?: string;
  rating?: number;
  cuisine?: string;
  priceRange?: string;
  openingHours?: string;
  website?: string;
}

export interface TravelMetadata {
  distance?: string;
  duration?: string;
  budget?: string;
  bestSeason?: string;
  highlights?: string[];
}

export interface BookMetadata {
  author?: string;
  genre?: string;
  readingDifficulty?: string;
  pageCount?: number;
  isbn?: string;
}

export interface GameMetadata {
  platforms?: string[];
  genre?: string;
  multiplayerSupport?: boolean;
  difficulty?: string;
  estimatedHours?: number;
}

export interface LeisureMetadata {
  address?: string;
  duration?: string;
  cost?: string;
  category?: string;
  website?: string;
}

export interface TvShowMetadata {
  genre?: string;
  seasons?: number;
  episodes?: number;
  platform?: string;
  year?: number;
  rating?: number;
}
