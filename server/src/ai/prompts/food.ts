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
- Location proximity — follow the SEARCH RADIUS instruction below strictly
- Meal type preferences (breakfast, brunch, lunch, dinner, dessert)

When multiple users are involved, find common ground and suggest options that accommodate all preferences.

Return recommendations as a valid JSON array.`;

export function buildFoodPrompt(
  profiles: Array<{ name: string; answers: Array<{ questionText: string; value: number }> }>,
  location?: { city?: string; lat?: number; lng?: number },
  locationRadius?: number,
): string {
  const locationStr = location?.city ? `Location: ${location.city}` : 'Location: Not specified (recommend popular options)';

  let radiusInstruction = '';
  if (locationRadius !== undefined && location?.city) {
    if (locationRadius <= 20) {
      radiusInstruction = `SEARCH RADIUS: The user does NOT care about location proximity. Recommend places anywhere in the world or country, not limited to ${location.city}.`;
    } else if (locationRadius <= 50) {
      radiusInstruction = `SEARCH RADIUS: The user has moderate location preference. Recommend places within ${location.city} and its surrounding metropolitan area. Do NOT recommend places outside the city/country.`;
    } else if (locationRadius <= 70) {
      radiusInstruction = `SEARCH RADIUS: The user prefers nearby options. Recommend places within ${location.city} or a short drive (up to 15km).`;
    } else {
      radiusInstruction = `SEARCH RADIUS: Location is very important to the user. Recommend places that are very close to ${location.city} — walking distance or a very short drive.`;
    }
  } else if (location?.city) {
    radiusInstruction = `SEARCH RADIUS: Recommend places within ${location.city}.`;
  }

  const profilesStr = profiles
    .map(
      (p) => `Profile: ${p.name}
Preferences:
${p.answers.map((a) => `  - "${a.questionText}": ${a.value}/100`).join('\n')}`,
    )
    .join('\n\n');

  return `${locationStr}
${radiusInstruction}

User profiles and their food preferences:

${profilesStr}

Generate exactly 5 highly personalized food and restaurant recommendations based on the preferences above. Consider the number of users and their combined preferences.`;
}
