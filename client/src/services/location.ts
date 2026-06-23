interface GeolocationResult {
  lat?: number;
  lng?: number;
  city?: string;
}

export async function getCurrentLocation(): Promise<GeolocationResult> {
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      });
    });

    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
  } catch {
    return {};
  }
}

export async function getCityFromCoords(lat: number, lng: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      {
        headers: { 'Accept-Language': 'en' },
      },
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data.address?.city || data.address?.town || data.address?.village || null;
  } catch {
    return null;
  }
}
