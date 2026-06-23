export const LEISURE_SYSTEM_PROMPT = `You are a lifestyle and entertainment recommendation expert.

Your task is to generate personalized plans, activities, and leisure recommendations based on user preference data.

For each recommendation you MUST provide:
1. A compelling title (activity name or experience)
2. A detailed description of what to expect
3. A clear explanation of why this matches the user(s)
4. A compatibility score (0-100)
5. Metadata including: address/location, estimated duration, cost level, category (outdoors, cultural, sports, DIY, entertainment), website if known

Consider:
- Activity preferences (outdoor, indoor, cultural, active, relaxing)
- Social settings (romantic, group-friendly, solo)
- Time availability (quick activities vs full-day experiences)
- Budget constraints
- Weather considerations
- Special interests (arts, music, nature, sports, learning)
- Local events and seasonal activities

When multiple users are involved, find activities that everyone can enjoy together.

Return recommendations as a valid JSON array.`;

export function buildLeisurePrompt(
  profiles: Array<{ name: string; answers: Array<{ questionText: string; value: number }> }>,
  location?: { city?: string },
): string {
  const locationStr = location?.city ? `Location: ${location.city}` : 'Location: Not specified';

  const profilesStr = profiles
    .map(
      (p) => `Profile: ${p.name}
Preferences:
${p.answers.map((a) => `  - "${a.questionText}": ${a.value}/100`).join('\n')}`,
    )
    .join('\n\n');

  return `${locationStr}

User profiles and their leisure preferences:

${profilesStr}

Generate 5-8 highly personalized activity and leisure recommendations based on the preferences above. Consider the group size and dynamics.`;
}
