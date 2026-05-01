const API_BASE = 'https://en.wikipedia.org/api/rest_v1';

export async function searchWikipedia(query: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const summaryRes = await fetch(
      `${API_BASE}/page/summary/${encodeURIComponent(query.replace(/ /g, '_'))}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
    
    if (summaryRes.ok) {
      const data = await summaryRes.json();
      return {
        title: data.title,
        extract: data.extract,
        thumbnail: data.thumbnail?.source,
        url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/ /g, '_'))}`,
      };
    }
    
    // Fallback to search
    const searchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`,
      { signal: controller.signal }
    );
    const searchData = await searchRes.json();
    if (searchData.query?.search?.[0]) {
      const result = searchData.query.search[0];
      return {
        title: result.title,
        extract: result.snippet.replace(/<[^>]*>/g, ''),
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title.replace(/ /g, '_'))}`,
      };
    }
    return null;
  } catch (e) {
    return null;
  }
}
