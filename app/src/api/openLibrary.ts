export async function searchOpenLibrary(query: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const res = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
    
    const data = await res.json();
    
    return {
      numFound: data.numFound,
      books: data.docs?.slice(0, 5).map((b: any) => ({
        title: b.title,
        author_name: b.author_name?.[0] || 'Unknown',
        first_publish_year: b.first_publish_year,
        key: b.key,
        url: `https://openlibrary.org${b.key}`,
        cover_i: b.cover_i,
      })) || [],
    };
  } catch (e) {
    return null;
  }
}
