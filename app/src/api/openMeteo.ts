export async function searchOpenMeteo(query: string) {
  try {
    // Parse coordinates from query if possible, or use defaults
    let lat = 51.5074, lon = -0.1278; // London default
    
    const coordMatch = query.match(/(-?\d+\.?\d*)\s*[°,]?\s*[NnSs]?\s*,?\s*(-?\d+\.?\d*)\s*[°,]?\s*[EeWw]?/);
    if (coordMatch) {
      lat = parseFloat(coordMatch[1]);
      lon = parseFloat(coordMatch[2]);
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
    
    const data = await res.json();
    
    return {
      location: { lat, lon, timezone: data.timezone },
      current: data.current,
      daily: data.daily,
      elevation: data.elevation,
    };
  } catch (e) {
    return null;
  }
}
