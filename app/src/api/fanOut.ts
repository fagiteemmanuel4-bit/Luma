import { searchWikipedia } from './wikipedia';
import { searchPubMed } from './pubmed';
import { searchNASA } from './nasa';
import { searchNewsApi } from './newsApi';
import { searchWorldBank } from './worldBank';
import { searchRestCountries } from './restCountries';
import { searchOpenMeteo } from './openMeteo';
import { synthesizeAnswer, identifyImage } from './gemma';
import type { ApiResult, ProgressStatus } from '../types/api';

const API_REGISTRY: Record<string, { name: string; icon: string; fn: (query: string) => Promise<unknown> }> = {
  wikipedia: { name: 'Wikipedia', icon: '📚', fn: searchWikipedia },
  pubmed: { name: 'PubMed', icon: '🧬', fn: searchPubMed },
  nasa: { name: 'NASA', icon: '🚀', fn: searchNASA },
  newsapi: { name: 'NewsAPI', icon: '📰', fn: searchNewsApi },
  worldBank: { name: 'World Bank', icon: '🌍', fn: searchWorldBank },
  restCountries: { name: 'REST Countries', icon: '🏳️', fn: searchRestCountries },
  openMeteo: { name: 'Open-Meteo', icon: '🌤️', fn: searchOpenMeteo },
};

const TOPIC_APIS = {
  health: ['pubmed', 'worldBank'],
  science: ['nasa', 'pubmed', 'wikipedia'],
  education: ['pubmed', 'wikipedia', 'worldBank'],
  climate: ['openMeteo', 'nasa', 'worldBank'],
  economics: ['worldBank', 'newsapi'],
  world: ['restCountries', 'newsapi', 'wikipedia'],
};

export function getApisForTopics(topics: string[]) {
  if (!topics || topics.length === 0) return Object.keys(API_REGISTRY);
  const apis = new Set<string>();
  topics.forEach(topic => {
    const topicKey = topic.toLowerCase();
    const mapped = TOPIC_APIS[topicKey as keyof typeof TOPIC_APIS];
    if (mapped) {
      mapped.forEach(api => apis.add(api));
    }
  });
  if (apis.size === 0) return Object.keys(API_REGISTRY);
  return Array.from(apis);
}

export async function getDualSynthesis(query: string, apiData: Record<string, unknown>, readingLevel: string, mode: string = 'general') {
  // First synthesis with Gemma
  const initialSynthesis = await synthesizeAnswer(query, apiData, readingLevel);
  
  // Second refinement (simulating Grok or another model)
  const refinedSynthesis = await refineWithSecondModel(initialSynthesis, query, mode);
  
  return refinedSynthesis;
}

async function refineWithSecondModel(initialResponse: string, query: string, mode: string): Promise<string> {
  // Simulate second model refinement
  // In production, this would call Grok API or another LLM
  
  const modeEnhancements = {
    study: `\n\n📚 **Study Mode Enhancement:**\n- Key learning objectives: ${query}\n- Practice question: How would you explain this to someone else?\n- Related concepts to explore: ${query.split(' ').slice(0, 2).join(' ')} fundamentals`,
    research: `\n\n🔬 **Research Mode Enhancement:**\n- Methodology insights: Data sourced from ${Object.keys(API_REGISTRY).length} APIs\n- Research implications: This information could inform studies in ${query.toLowerCase().includes('health') ? 'public health' : 'various fields'}\n- Future research directions: Longitudinal studies on ${query}`,
    general: `\n\n💡 **Enhanced Analysis:**\n- This response combines insights from multiple authoritative sources\n- Consider the broader context: How does this connect to current events?\n- Practical application: How might this knowledge be useful in daily life?`
  };

  const enhancement = modeEnhancements[mode as keyof typeof modeEnhancements] || modeEnhancements.general;
  
  return `${initialResponse}${enhancement}`;
}

export async function fanOutSearch(query: string, topics: string[], onProgress?: (api: string, status: ProgressStatus, time?: number) => void) {
  const apis = getApisForTopics(topics);
  const results: Record<string, ApiResult> = {};
  
  const promises = apis.map(async (apiKey) => {
    const startTime = performance.now();
    onProgress?.(apiKey, 'started');
    
    try {
      const api = API_REGISTRY[apiKey as keyof typeof API_REGISTRY];
      if (!api) {
        results[apiKey] = { data: null, time: 0, status: 'not_found' };
        onProgress?.(apiKey, 'error', 0);
        return;
      }
      
      const data = await api.fn(query);
      const time = Math.round(performance.now() - startTime);
      
      results[apiKey] = { data, time, status: data ? 'success' : 'empty' };
      onProgress?.(apiKey, 'done', time);
    } catch {
      console.error(`Error fetching from ${apiKey}`);
      const time = Math.round(performance.now() - startTime);
      results[apiKey] = { data: null, time, status: 'error' };
      onProgress?.(apiKey, 'error', time);
    }
  });

  await Promise.allSettled(promises);
  
  return { results, apis };
}

export async function getSynthesis(query: string, results: Record<string, ApiResult>, readingLevel: string, imageBase64?: string) {
  const cleanData: Record<string, unknown> = {};
  Object.entries(results).forEach(([key, val]) => {
    if (val.data) cleanData[key] = val.data;
  });
  
  return await synthesizeAnswer(query, cleanData, readingLevel, imageBase64);
}

export async function processVisionSearch(imageBase64: string, topics: string[], onProgress?: (api: string, status: ProgressStatus, time?: number) => void) {
  // Stage 1: Identify image with Gemma 3 Vision
  const identifiedQuery = await identifyImage(imageBase64);

  // Stage 2: Fan out search with identified query
  const { results } = await fanOutSearch(identifiedQuery, topics, onProgress);

  return { results, identifiedQuery };
}

export { API_REGISTRY };
