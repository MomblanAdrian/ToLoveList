export type CategorySlug = 'food' | 'leisure' | 'travel' | 'tv-shows' | 'video-games' | 'books';

export interface Category {
  id: string;
  name: string;
  slug: CategorySlug;
  description: string;
  icon: string;
  color: string;
}

export interface CategoryWithProgress extends Category {
  questionCount: number;
  answeredCount: number;
}
