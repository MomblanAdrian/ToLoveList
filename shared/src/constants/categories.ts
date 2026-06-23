import type { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'cat-food',
    name: 'Food',
    slug: 'food',
    description: 'Restaurants, cafes, and culinary experiences',
    icon: 'utensils-crossed',
    color: '#FF6B35',
  },
  {
    id: 'cat-leisure',
    name: 'Plans & Leisure',
    slug: 'leisure',
    description: 'Activities, events, and entertainment',
    icon: 'sparkles',
    color: '#7C3AED',
  },
  {
    id: 'cat-travel',
    name: 'Travel & Getaways',
    slug: 'travel',
    description: 'Destinations and trip ideas',
    icon: 'globe',
    color: '#2563EB',
  },
  {
    id: 'cat-tv-shows',
    name: 'TV Shows & Streaming',
    slug: 'tv-shows',
    description: 'Shows, movies, and documentaries',
    icon: 'tv',
    color: '#EC4899',
  },
  {
    id: 'cat-video-games',
    name: 'Video Games',
    slug: 'video-games',
    description: 'Games for every platform and style',
    icon: 'gamepad-2',
    color: '#10B981',
  },
  {
    id: 'cat-books',
    name: 'Books',
    slug: 'books',
    description: 'Reading recommendations across genres',
    icon: 'book-open',
    color: '#F59E0B',
  },
] as const;
