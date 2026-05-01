export async function searchNASA(query: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    // Try APOD first (simple, reliable)
    const apodRes = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY`,
      { signal: controller.signal }
    );
    
    const apodData = await apodRes.json();
    clearTimeout(timeoutId);
    
    // Try NASA Image and Video Library for the query
    const ivlController = new AbortController();
    const ivlTimeout = setTimeout(() => ivlController.abort(), 5000);
    
    const ivlRes = await fetch(
      `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image&page_size=3`,
      { signal: ivlController.signal }
    );
    clearTimeout(ivlTimeout);
    
    const ivlData = await ivlRes.json();
    const items = ivlData.collection?.items || [];
    
    return {
      apod: {
        title: apodData.title,
        explanation: apodData.explanation,
        url: apodData.url,
        hdurl: apodData.hdurl,
      },
      images: items.slice(0, 3).map((item: any) => ({
        title: item.data?.[0]?.title || 'NASA Image',
        description: item.data?.[0]?.description || '',
        thumbnail: item.links?.[0]?.href,
        url: item.href,
        center: item.data?.[0]?.center,
        date_created: item.data?.[0]?.date_created,
      })),
    };
  } catch (e) {
    return null;
  }
}
