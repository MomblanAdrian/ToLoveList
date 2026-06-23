import { useState, useEffect } from 'react';
import { getCurrentLocation, getCityFromCoords } from '../services/location';

interface LocationState {
  lat?: number;
  lng?: number;
  city?: string;
  loading: boolean;
  error: string | null;
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function init() {
      try {
        const coords = await getCurrentLocation();

        if (coords.lat && coords.lng) {
          const city = await getCityFromCoords(coords.lat, coords.lng);
          setState({
            lat: coords.lat,
            lng: coords.lng,
            city: city || undefined,
            loading: false,
            error: null,
          });
        } else {
          setState({ loading: false, error: null });
        }
      } catch {
        setState({ loading: false, error: 'Location unavailable' });
      }
    }

    init();
  }, []);

  const setCity = (city: string) => {
    setState((prev) => ({ ...prev, city }));
  };

  return { ...state, setCity };
}
