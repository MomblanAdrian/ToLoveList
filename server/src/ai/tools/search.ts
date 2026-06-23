export const SEARCH_TOOL_DEFINITION = {
  type: 'function',
  function: {
    name: 'web_search',
    description: 'Search the internet for current information about restaurants, events, places, or any topic',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query',
        },
        location: {
          type: 'string',
          description: 'Optional location to narrow results',
        },
      },
      required: ['query'],
    },
  },
};

export async function webSearch(query: string, location?: string): Promise<string> {
  const searchQuery = location ? `${query} in ${location}` : query;

  try {
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&format=json&no_html=1`,
    );

    if (!response.ok) {
      return `Unable to search for "${searchQuery}". Please use general knowledge to provide recommendations.`;
    }

    const data: Record<string, unknown> = await response.json() as Record<string, unknown>;
    const results: string[] = [];

    if (data.AbstractText) {
      results.push(data.AbstractText as string);
    }

    if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
      for (const topic of (data.RelatedTopics as Array<Record<string, unknown>>).slice(0, 5)) {
        if (topic.Text) {
          results.push(topic.Text as string);
        }
      }
    }

    if (results.length === 0) {
      return `No search results found for "${searchQuery}". Use general knowledge.`;
    }

    return results.join('\n');
  } catch {
    return `Search unavailable for "${searchQuery}". Use general knowledge.`;
  }
}
