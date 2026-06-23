import { SEARCH_TOOL_DEFINITION, webSearch } from './search.js';
import { PLACES_TOOL_DEFINITION, getNearbyPlaces } from './places.js';
import { EVENTS_TOOL_DEFINITION, getLocalEvents } from './events.js';

export const AVAILABLE_TOOLS = [
  SEARCH_TOOL_DEFINITION,
  PLACES_TOOL_DEFINITION,
  EVENTS_TOOL_DEFINITION,
];

export const TOOL_HANDLERS: Record<string, (args: Record<string, unknown>) => Promise<string>> = {
  web_search: async (args) => {
    const result = await webSearch(
      args.query as string,
      args.location as string | undefined,
    );
    return result;
  },
  get_nearby_places: async (args) => {
    const places = await getNearbyPlaces(
      args.category as string,
      args.location as string,
      (args.limit as number) || 5,
    );
    return JSON.stringify(places);
  },
  get_local_events: async (args) => {
    const events = await getLocalEvents(
      args.location as string,
      args.category as string | undefined,
    );
    return JSON.stringify(events);
  },
};
