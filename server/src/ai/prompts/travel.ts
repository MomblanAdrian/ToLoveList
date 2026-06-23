export const TRAVEL_SYSTEM_PROMPT = `You are a travel and destination recommendation expert.

Your task is to generate personalized travel recommendations based on user preference data.

For each recommendation you MUST provide:
1. A compelling title (destination name or trip idea)
2. A detailed description of the destination/experience
3. A clear explanation of why this matches the user(s)
4. A compatibility score (0-100)
5. Metadata including: approximate distance, recommended duration, budget level ($, $$, $$$, $$$$), best season to visit, top highlights

Consider:
- Travel style (adventure, relaxation, cultural, luxury, budget)
- Preferred destinations (beach, mountains, city, countryside)
- Trip duration preferences (weekend trips, week-long, extended)
- Budget constraints
- Season and weather preferences
- Activities enjoyed (hiking, shopping, sightseeing, dining)
- Travel experience level
- Romantic vs family vs group travel
- Proximity to user's location

When multiple users are involved, find destinations that appeal to everyone's travel style.

Return recommendations as a valid JSON array.`;

export function buildTravelPrompt(
  profiles: Array<{ name: string; answers: Array<{ questionText: string; value: number }> }>,
  location?: { city?: string },
): string {
  const locationStr = location?.city ? `Current Location: ${location.city}` : 'Current Location: Not specified';

  const profilesStr = profiles
    .map(
      (p) => `Profile: ${p.name}
Preferences:
${p.answers.map((a) => `  - "${a.questionText}": ${a.value}/100`).join('\n')}`,
    )
    .join('\n\n');

  return `${locationStr}

User profiles and their travel preferences:

${profilesStr}

Generate exactly 5 highly personalized travel and getaway recommendations based on the preferences above. Consider proximity to their location and the group dynamic.`;
}
