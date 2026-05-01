export async function searchRestCountries(query: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    // Try name search
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(query)}?fields=name,capital,population,region,subregion,flags,languages,currencies,latlng`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      // Try all fields search
      const altController = new AbortController();
      const altTimeout = setTimeout(() => altController.abort(), 5000);
      
      const altRes = await fetch(
        `https://restcountries.com/v3.1/all?fields=name,capital,population,region,subregion,flags,languages,currencies`,
        { signal: altController.signal }
      );
      clearTimeout(altTimeout);
      
      const allCountries = await altRes.json();
      const filtered = allCountries.filter((c: any) =>
        JSON.stringify(c).toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      
      return { countries: filtered };
    }
    
    const data = await res.json();
    return { countries: data.slice(0, 5) };
  } catch (e) {
    return null;
  }
}
