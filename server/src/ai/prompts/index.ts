import { FOOD_SYSTEM_PROMPT, buildFoodPrompt } from './food.js';
import { LEISURE_SYSTEM_PROMPT, buildLeisurePrompt } from './leisure.js';
import { TRAVEL_SYSTEM_PROMPT, buildTravelPrompt } from './travel.js';
import { TVSHOWS_SYSTEM_PROMPT, buildTvShowsPrompt } from './tvshows.js';
import { GAMES_SYSTEM_PROMPT, buildGamesPrompt } from './games.js';
import { BOOKS_SYSTEM_PROMPT, buildBooksPrompt } from './books.js';

interface ProfileData {
  name: string;
  answers: Array<{ questionText: string; value: number }>;
}

export function getCategoryPrompts(categorySlug: string, profiles: ProfileData[], location?: { city?: string }) {
  switch (categorySlug) {
    case 'food':
      return {
        systemPrompt: FOOD_SYSTEM_PROMPT,
        userPrompt: buildFoodPrompt(profiles, location),
      };
    case 'leisure':
      return {
        systemPrompt: LEISURE_SYSTEM_PROMPT,
        userPrompt: buildLeisurePrompt(profiles, location),
      };
    case 'travel':
      return {
        systemPrompt: TRAVEL_SYSTEM_PROMPT,
        userPrompt: buildTravelPrompt(profiles, location),
      };
    case 'tv-shows':
      return {
        systemPrompt: TVSHOWS_SYSTEM_PROMPT,
        userPrompt: buildTvShowsPrompt(profiles),
      };
    case 'video-games':
      return {
        systemPrompt: GAMES_SYSTEM_PROMPT,
        userPrompt: buildGamesPrompt(profiles),
      };
    case 'books':
      return {
        systemPrompt: BOOKS_SYSTEM_PROMPT,
        userPrompt: buildBooksPrompt(profiles),
      };
    default:
      throw new Error(`Unknown category: ${categorySlug}`);
  }
}
