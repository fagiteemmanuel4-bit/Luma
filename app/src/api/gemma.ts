const GEMMA_API_KEY = import.meta.env.VITE_GEMMA_API_KEY || '';
const GEMMA_MODEL = import.meta.env.VITE_GEMMA_MODEL || 'gemma-4-27b-it';

export async function synthesizeAnswer(query: string, apiData: any, readingLevel: string) {
  try {
    const levelPrompt = readingLevel === 'simple'
      ? 'Respond as if explaining to a 12-year-old. Short sentences. No jargon. Use analogies.'
      : readingLevel === 'technical'
      ? 'Respond for a domain expert. Include precise terminology, cite mechanisms, and explain clearly.'
      : 'Respond for a general educated adult audience. Be conversational, clear, and informative.';

    const systemPrompt = `You are Luma, a friendly AI research assistant. Use the user question and the API data to answer in natural, human-like language. Start with a short explanation that directly answers the question, then include a few helpful facts, practical meaning, and source-based reading suggestions.

Structure your answer like this:
1) A natural short summary sentence or two
2) Key Facts: 3-4 bullets, with source labels if possible
3) What This Means: one sentence of practical context
4) Further Reading: two suggestions based on the provided sources
${levelPrompt}
Respond in the same language as the query.
Do not make up facts. If information is missing, say that clearly.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMMA_MODEL}:generateContent?key=${GEMMA_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: 'Understood. I am Luma, ready to synthesize knowledge from the provided API data.' }] },
            { role: 'user', parts: [{ text: `QUERY: ${query}\n\nRAW API DATA:\n${JSON.stringify(apiData, null, 2)}` }] },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
          },
        }),
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    const data = await res.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return text;
  } catch (e) {
    console.error('Gemma synthesis error:', e);
    return generateFallbackAnswer(query, apiData, readingLevel);
  }
}

function generateFallbackAnswer(query: string, apiData: any, readingLevel: string) {
  const sources = Object.entries(apiData).filter(([, value]) => value);
  const sourceNames = sources.map(([key]) => key).join(', ');
  const firstSource = sources[0]?.[0] || 'the available sources';
  const levelLabel = readingLevel === 'simple' ? 'simple terms' : readingLevel === 'technical' ? 'technical detail' : 'clear, informative language';

  const textFromSource = getSourceSnippetForFallback(sources[0]?.[0], sources[0]?.[1]);
  const naturalSummary = textFromSource
    ? `${textFromSource}`
    : `I found information from ${sources.length} source(s) for "${query}". The best match came from ${firstSource}.`;

  const facts = sources.slice(0, 4).map(([key, data]) => {
    const snippet = getSourceSnippetForFallback(key, data);
    return `- ${key}: ${snippet || 'Information is available from this source.'}`;
  });

  const practical = sources.length > 0
    ? `Use this information as a starting point, and follow the source links for more detail.`
    : `There is not enough data to answer the question confidently.`;

  return `## Summary\n\n${naturalSummary}\n\n## Key Facts\n\n${facts.join('\n')}\n\n## What This Means\n\n${practical}\n\n## Further Reading\n\n- Check the source data from ${sourceNames || 'the available APIs'} for more detail.\n- Refine your query with a more specific question if you need deeper insight.`;
}

function getSourceSnippetForFallback(key: string, data: any) {
  if (!data) return '';
  switch (key) {
    case 'wikipedia':
      return data.extract || data.title || 'Wikipedia provided an overview.';
    case 'nasa':
      return data.apod?.explanation?.slice(0, 160) || 'NASA provided a space-related summary.';
    case 'newsapi':
      return data.articles?.[0]?.description || data.articles?.[0]?.title || 'NewsAPI returned a news summary.';
    case 'openLibrary':
      return data.books?.[0]?.title ? `${data.books[0].title} by ${data.books[0].author_name?.join(', ') || 'unknown author'}` : 'Open Library returned book metadata.';
    case 'openMeteo':
      return data.current?.temperature_2m != null ? `Current temperature is ${data.current.temperature_2m}°C.` : 'Open-Meteo provided local weather details.';
    case 'pubmed':
      return data.articles?.[0]?.title || 'PubMed returned medical literature information.';
    case 'restCountries':
      return data.countries?.[0]?.name?.common || 'REST Countries returned country information.';
    case 'worldBank':
      return data.indicators?.[0]?.name || 'World Bank returned economic indicators.';
    default:
      return '';
  }
}
