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
- Proximity to user's location — follow the RADIUS instruction below

When multiple users are involved, find destinations that appeal to everyone's travel style.

Return recommendations as a valid JSON array.`;

export function buildTravelPrompt(
  profiles: Array<{ name: string; answers: Array<{ questionText: string; value: number }> }>,
  location?: { city?: string; lat?: number; lng?: number },
  locationRadius?: number,
): string {
  const locationStr = location?.city ? `Current Location: ${location.city}` : 'Current Location: Not specified';

  let radiusInstruction = '';
  if (locationRadius !== undefined) {
    if (locationRadius <= 30) {
      radiusInstruction = `TRAVEL RADIUS: The user is open to long-distance travel. Recommend destinations anywhere in the world. Do NOT limit to nearby areas.`;
    } else if (locationRadius <= 60) {
      radiusInstruction = `TRAVEL RADIUS: The user has a moderate preference for nearby travel. Recommend destinations within the same country or region. Include both nearby getaways and mid-range destinations.`;
    } else if (locationRadius <= 80) {
      radiusInstruction = `TRAVEL RADIUS: The user prefers places close by. Recommend destinations within a few hours drive or a short flight from ${location?.city || 'their location'}.`;
    } else {
      radiusInstruction = `TRAVEL RADIUS: The user strongly prefers local/nearby travel. Recommend staycations, nearby towns, and destinations within a 2-hour drive from ${location?.city || 'their location'}.`;
    }
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

User profiles and their travel preferences:

${profilesStr}

Generate exactly 5 highly personalized travel and getaway recommendations based on the preferences above. Consider proximity to their location and the group dynamic.`;
}
