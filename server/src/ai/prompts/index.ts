import { FOOD_SYSTEM_PROMPT, buildFoodPrompt } from './food.js';
import { LEISURE_SYSTEM_PROMPT, buildLeisurePrompt } from './leisure.js';
import { TRAVEL_SYSTEM_PROMPT, buildTravelPrompt } from './travel.js';
import { TVSHOWS_SYSTEM_PROMPT, buildTvShowsPrompt } from './tvshows.js';
import { GAMES_SYSTEM_PROMPT, buildGamesPrompt } from './games.js';
import { BOOKS_SYSTEM_PROMPT, buildBooksPrompt } from './books.js';

export interface ProfileData {
  name: string;
  answers: Array<{ questionText: string; value: number }>;
}

export function getCategoryPrompts(
  categorySlug: string,
  profiles: ProfileData[],
  location?: { city?: string; lat?: number; lng?: number },
  locationRadius?: number,
  completedTitles?: string[],
  dismissedTitles?: string[],
) {
  const visitedStr =
    completedTitles && completedTitles.length > 0
      ? `\n\nThe user has already visited/done these ${categorySlug} recommendations (DO NOT recommend them again):\n${completedTitles.map((t) => `  - ${t}`).join('\n')}`
      : '';
  const dismissedStr =
    dismissedTitles && dismissedTitles.length > 0
      ? `\n\nThe user has dismissed/declined these ${categorySlug} recommendations (DO NOT recommend them again):\n${dismissedTitles.map((t) => `  - ${t}`).join('\n')}`
      : '';

  const baseUserPromptSuffix = `${visitedStr}${dismissedStr}`;

  switch (categorySlug) {
    case 'food':
      return {
        systemPrompt: FOOD_SYSTEM_PROMPT,
        userPrompt: buildFoodPrompt(profiles, location, locationRadius) + baseUserPromptSuffix,
      };
    case 'leisure':
      return {
        systemPrompt: LEISURE_SYSTEM_PROMPT,
        userPrompt: buildLeisurePrompt(profiles, location, locationRadius) + baseUserPromptSuffix,
      };
    case 'travel':
      return {
        systemPrompt: TRAVEL_SYSTEM_PROMPT,
        userPrompt: buildTravelPrompt(profiles, location, locationRadius) + baseUserPromptSuffix,
      };
    case 'tv-shows':
      return {
        systemPrompt: TVSHOWS_SYSTEM_PROMPT,
        userPrompt: buildTvShowsPrompt(profiles) + baseUserPromptSuffix,
      };
    case 'video-games':
      return {
        systemPrompt: GAMES_SYSTEM_PROMPT,
        userPrompt: buildGamesPrompt(profiles) + baseUserPromptSuffix,
      };
    case 'books':
      return {
        systemPrompt: BOOKS_SYSTEM_PROMPT,
        userPrompt: buildBooksPrompt(profiles) + baseUserPromptSuffix,
      };
    default:
      throw new Error(`Unknown category: ${categorySlug}`);
  }
}
