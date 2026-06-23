export const EVENTS_TOOL_DEFINITION = {
  type: 'function',
  function: {
    name: 'get_local_events',
    description: 'Find local events, festivals, and happenings in a specific location',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'City or area to find events in',
        },
        category: {
          type: 'string',
          enum: ['music', 'festivals', 'sports', 'theatre', 'workshops', 'food', 'all'],
          description: 'Type of events to look for',
        },
      },
      required: ['location'],
    },
  },
};

interface EventResult {
  name: string;
  date: string;
  description: string;
  category: string;
  location: string;
}

export async function getLocalEvents(location: string, category: string = 'all'): Promise<EventResult[]> {
  const results: EventResult[] = [];

  try {
    const query = category !== 'all' ? `${category} events in ${location}` : `events and festivals in ${location}`;
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`,
    );

    if (response.ok) {
      const data: Record<string, unknown> = await response.json() as Record<string, unknown>;

      if (data.AbstractText) {
        results.push({
          name: `${category === 'all' ? 'Local' : category} events in ${location}`,
          date: 'Ongoing',
          description: data.AbstractText as string,
          category,
          location,
        });
      }

      if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
        for (const topic of (data.RelatedTopics as Array<Record<string, unknown>>).slice(0, 8)) {
          if (topic.Text) {
            const text = String(topic.Text);
            const parts = text.split(' - ');
            results.push({
              name: parts[0] || text,
              date: 'Check local listings',
              description: text,
              category,
              location,
            });
          }
        }
      }
    }
  } catch {
    // Return empty results on error
  }

  return results;
}
