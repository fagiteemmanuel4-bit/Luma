export async function searchWorldBank(query: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    // Search indicators
    const res = await fetch(
      `https://api.worldbank.org/v2/indicator?format=json&per_page=5&page=1`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
    
    const data = await res.json();
    const indicators = Array.isArray(data) ? data[1] : [];
    
    // Get data for first indicator as sample
    if (indicators.length > 0) {
      const sampleId = indicators[0].id;
      const dataController = new AbortController();
      const dataTimeout = setTimeout(() => dataController.abort(), 5000);
      
      const dataRes = await fetch(
        `https://api.worldbank.org/v2/country/all/indicator/${sampleId}?format=json&date=2020:2023&per_page=5`,
        { signal: dataController.signal }
      );
      clearTimeout(dataTimeout);
      
      const indicatorData = await dataRes.json();
      
      return {
        indicators: indicators.slice(0, 5).map((ind: any) => ({
          id: ind.id,
          name: ind.name,
          sourceNote: ind.sourceNote,
        })),
        sampleData: Array.isArray(indicatorData) ? indicatorData[1]?.slice(0, 5) : [],
      };
    }
    
    return { indicators: [], sampleData: [] };
  } catch (e) {
    return null;
  }
}
