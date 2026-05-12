const GEMMA_API_KEY = import.meta.env.VITE_GEMMA_API_KEY || '';
const GEMMA_MODEL = import.meta.env.VITE_GEMMA_MODEL || 'gemma-2-27b-it';

export async function synthesizeAnswer(query: string, apiData: any, readingLevel: string) {
  try {
    if (!GEMMA_API_KEY) {
      console.warn('VITE_GEMMA_API_KEY is not set. Synthesis will use fallback.');
      return generateFallbackAnswer(query, apiData, readingLevel);
    }

    const levelPrompt = readingLevel === 'simple'
      ? 'Respond as if explaining to a 12-year-old. Short sentences. No jargon. Use analogies.'
      : readingLevel === 'technical'
      ? 'Respond for a domain expert. Include precise terminology, cite mechanisms, and explain clearly.'
      : 'Respond for a general educated adult audience. Be conversational, clear, and informative.';

    const systemPrompt = `You are Luma, a friendly AI research assistant. Your goal is to provide a detailed, conversational, and comprehensive research briefing based on the user's question and the provided API data.

CRITICAL INSTRUCTION: Synthesize the information into a cohesive narrative. Do not just list facts. Explain the "why" and "how". Only use RELEVANT data. Always attribute facts to their source (e.g., "(Source: Wikipedia)").

Structure your answer EXACTLY like this:

## Research Briefing
[A detailed, conversational, and comprehensive explanation of the topic. This should be 2-3 paragraphs of deep information that helps the user truly understand the subject.]

## Key Findings
- [Crucial Fact 1] (Source: [API Name])
- [Crucial Fact 2] (Source: [API Name])
- [Crucial Fact 3] (Source: [API Name])

## Expert Analysis & Implications
[Deep dive into what this means for society or the individual. Focus on the social impact and future outlook.]

## Actionable Steps
[2-3 practical, high-impact steps the user can take based on this research.]

## Recommended Resources
- [Resource 1]
- [Resource 2]

## Social Impact Score
Score: [0-100]/100
Reason: [A clear explanation of why this topic is vital for social progress or human well-being.]

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
            { role: 'model', parts: [{ text: 'Understood. I will provide research syntheses with Summary, Key Facts, What This Means, Take Action, and Further Reading sections.' }] },
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
    if (!text) throw new Error('Empty response');
    return text;
  } catch (e) {
    console.error('Gemma synthesis error:', e);
    return generateFallbackAnswer(query, apiData, readingLevel);
  }
}

function generateFallbackAnswer(query: string, apiData: any, readingLevel: string) {
  const sources = Object.entries(apiData).filter(([key, value]) => value && !keyIsContext(key, value));
  const sourceNames = sources.map(([key]) => key).join(', ');
  const firstSource = sources[0]?.[0] || 'the available sources';

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

  const action = sources.length > 0
    ? `Explore the sources provided to verify this information and share it with your community.`
    : `Try refining your search to find actionable data.`;

  const score = sources.length > 0 ? 85 : 0;
  const reason = sources.length > 0
    ? "This research provides cited evidence from multiple global databases, increasing transparency and access to critical information."
    : "No data was found to evaluate.";

  return `## Research Briefing\n\n${naturalSummary}\n\n## Key Findings\n\n${facts.length > 0 ? facts.join('\n') : '- No specific facts available.'}\n\n## Expert Analysis & Implications\n\n${practical}\n\n## Actionable Steps\n\n${action}\n\n## Recommended Resources\n\n- Check the source data from ${sourceNames || 'the available APIs'} for more detail.\n- Refine your query with a more specific question if you need deeper insight.\n\n## Social Impact Score\nScore: ${score}/100\nReason: ${reason}`;
}

function keyIsContext(key: string, val: any) {
    return key === 'refinement_context' || (typeof val === 'object' && val !== null && 'refinement_context' in val);
}

function getSourceSnippetForFallback(key: string, data: any) {
  if (!data) return '';
  const actualData = data.data || data;

  switch (key) {
    case 'wikipedia':
      return actualData.extract || actualData.title || 'Wikipedia provided an overview.';
    case 'nasa':
      return actualData.apod?.explanation?.slice(0, 160) || 'NASA provided a space-related summary.';
    case 'newsapi':
      return actualData.articles?.[0]?.description || actualData.articles?.[0]?.title || 'NewsAPI returned a news summary.';
    case 'openLibrary':
      return actualData.books?.[0]?.title ? `${actualData.books[0].title} by ${actualData.books[0].author_name?.join(', ') || 'unknown author'}` : 'Open Library returned book metadata.';
    case 'openMeteo':
      return actualData.current?.temperature_2m != null ? `Current temperature is ${actualData.current.temperature_2m}°C.` : 'Open-Meteo provided local weather details.';
    case 'pubmed':
      return actualData.articles?.[0]?.title || 'PubMed returned medical literature information.';
    case 'restCountries':
      return actualData.countries?.[0]?.name?.common || 'REST Countries returned country information.';
    case 'worldBank':
      return actualData.indicators?.[0]?.name || 'World Bank returned economic indicators.';
    default:
      return '';
  }
}
