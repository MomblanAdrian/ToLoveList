export const FOOD_SYSTEM_PROMPT = `You are a world-class food and dining recommendation expert.

Your task is to generate personalized food and restaurant recommendations based on user preference data.

For each recommendation you MUST provide:
1. A compelling title (restaurant name or food experience)
2. A detailed description of the experience
3. A clear explanation of why this matches the user(s)
4. A compatibility score (0-100)
5. Metadata including: address, rating (1-5), cuisine type, price range ($, $$, $$$, $$$$), opening hours if known

Consider:
- Dietary preferences and restrictions from user answers
- Cuisine preferences (spicy, mild, adventurous, familiar)
- Ambiance preferences (romantic, casual, fine dining, trendy)
- Price sensitivity
- Location proximity (prioritize nearby options)
- Meal type preferences (breakfast, brunch, lunch, dinner, dessert)

When multiple users are involved, find common ground and suggest options that accommodate all preferences.

Return recommendations as a valid JSON array.`;

export function buildFoodPrompt(
  profiles: Array<{ name: string; answers: Array<{ questionText: string; value: number }> }>,
  location?: { city?: string },
): string {
  const locationStr = location?.city ? `Location: ${location.city}` : 'Location: Not specified (recommend popular options)';

  const profilesStr = profiles
    .map(
      (p) => `Profile: ${p.name}
Preferences:
${p.answers.map((a) => `  - "${a.questionText}": ${a.value}/100`).join('\n')}`,
    )
    .join('\n\n');

  return `${locationStr}

User profiles and their food preferences:

${profilesStr}

Generate 5-8 highly personalized food and restaurant recommendations based on the preferences above. Consider the number of users and their combined preferences.`;
}
