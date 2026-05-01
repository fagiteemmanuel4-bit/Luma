export async function searchPubMed(query: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const searchRes = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=5&retmode=json`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
    
    const searchData = await searchRes.json();
    const ids = searchData.esearchresult?.idlist || [];
    
    if (ids.length === 0) return null;
    
    const summaryRes = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.slice(0, 3).join(',')}&retmode=json`,
      { signal: controller.signal }
    );
    const summaryData = await summaryRes.json();
    const articles = Object.values(summaryData.result || {}).filter((a: any) => a.uid);
    
    return {
      count: searchData.esearchresult?.count || '0',
      articles: articles.slice(0, 3).map((a: any) => ({
        title: a.title,
        authors: a.authors?.map((au: any) => au.name).slice(0, 3).join(', ') || 'N/A',
        journal: a.fulljournalname || a.source || 'Journal',
        year: a.pubdate?.split(' ')[0] || 'N/A',
        url: `https://pubmed.ncbi.nlm.nih.gov/${a.uid}/`,
      })),
    };
  } catch (e) {
    return null;
  }
}
