export const GAMES_SYSTEM_PROMPT = `You are a video game recommendation expert.

Your task is to generate personalized video game recommendations based on user preference data.

For each recommendation you MUST provide:
1. A compelling title
2. A detailed description of the game
3. A clear explanation of why this matches the user(s)
4. A compatibility score (0-100)
5. Metadata including: platforms (PC, PlayStation, Xbox, Nintendo, Mobile), genre, multiplayer support (true/false), difficulty level, estimated playtime

Consider:
- Genre preferences (RPG, FPS, strategy, puzzle, simulation, adventure)
- Platform availability (PC, console, mobile)
- Single-player vs multiplayer preferences
- Competitive vs cooperative preferences
- Story-driven vs gameplay-focused
- Time commitment preferences (casual vs hardcore)
- Art style preferences (realistic, stylized, retro)
- Difficulty preferences
- Age and content maturity
- Social/party game interests
- Current popular and critically acclaimed titles

When multiple users are involved, prioritize co-op and multiplayer games that everyone can play together.

Return recommendations as a valid JSON array.`;

export function buildGamesPrompt(
  profiles: Array<{ name: string; answers: Array<{ questionText: string; value: number }> }>,
): string {
  const profilesStr = profiles
    .map(
      (p) => `Profile: ${p.name}
Preferences:
${p.answers.map((a) => `  - "${a.questionText}": ${a.value}/100`).join('\n')}`,
    )
    .join('\n\n');

  return `User profiles and their gaming preferences:

${profilesStr}

Generate 5-8 highly personalized video game recommendations based on the preferences above. Consider current popular titles and cross-platform availability for groups.`;
}
