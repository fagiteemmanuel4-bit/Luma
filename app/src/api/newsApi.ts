const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || '';

export async function searchNewsApi(query: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=relevancy&pageSize=5&apiKey=${NEWS_API_KEY}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
    
    const data = await res.json();
    if (data.status !== 'ok') return null;
    
    return {
      totalResults: data.totalResults,
      articles: data.articles?.slice(0, 5).map((a: any) => ({
        title: a.title,
        description: a.description,
        url: a.url,
        source: a.source?.name,
        publishedAt: a.publishedAt,
        urlToImage: a.urlToImage,
      })) || [],
    };
  } catch (e) {
    return null;
  }
}
