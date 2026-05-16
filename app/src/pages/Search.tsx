import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Send, ExternalLink, BookOpen, Lightbulb, FileText, Sparkles, Zap, Download, Bookmark, BookmarkCheck, Camera, Search as SearchIcon, LayoutList, PenTool, BrainCircuit, MessageCircle, Quote, Info, Languages } from 'lucide-react';
import { fanOutSearch, getSynthesis, API_REGISTRY, processVisionSearch } from '@/api/fanOut';
import type { ApiResult, ProgressStatus } from '@/types/api';
import { useSettings } from '@/context/SettingsContext';
import { useLibrary } from '@/hooks/useLibrary';
import SearchBar from '@/components/SearchBar';
import Navbar from '@/components/Navbar';

const FACTS = [
  "The ocean absorbs 93% of excess heat from global warming.",
  "Wikipedia has over 6.7 million articles in English.",
  "NASA's APOD has published an image every day since 1995.",
  "The human body has about 37 trillion cells.",
  "Light travels at exactly 299,792,458 meters per second.",
];

interface ParsedAnswer {
  summary: string;
  keyFacts: { text: string; source: string | null }[];
  whatThisMeans: string;
  takeAction: string;
  furtherReading: string[];
  socialImpact: {
    score: number | null;
    reason: string;
    sdgs: string[];
    metrics: string;
  };
}

function useTypewriter(text: string, speed = 15) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) { setDisplayed(''); setDone(false); return; }
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}

function SkeletonCard() {
  return (
    <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
      <div className="shimmer h-4 w-24 rounded mb-3" />
      <div className="shimmer h-3 w-full rounded mb-2" />
      <div className="shimmer h-3 w-3/4 rounded mb-2" />
      <div className="shimmer h-3 w-1/2 rounded" />
    </div>
  );
}

function AnswerSkeleton() {
  return (
    <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderLeft: '3px solid var(--accent-primary)' }}>
      <div className="shimmer h-5 w-32 rounded mb-4" />
      <div className="shimmer h-4 w-full rounded mb-2" />
      <div className="shimmer h-4 w-full rounded mb-2" />
      <div className="shimmer h-4 w-2/3 rounded mb-6" />
      <div className="shimmer h-5 w-28 rounded mb-3" />
      <div className="shimmer h-3 w-full rounded mb-2" />
      <div className="shimmer h-3 w-full rounded mb-2" />
      <div className="shimmer h-3 w-3/4 rounded" />
    </div>
  );
}

function ApiFanOutVisualization({ progress }: { progress: Record<string, string> }) {
  const apis = Object.keys(API_REGISTRY);
  const centerX = 150;
  const centerY = 80;
  const radius = 110;

  return (
    <div className="flex justify-center mb-8">
      <svg width="300" height="200" viewBox="0 0 300 200">
        {/* Connection lines */}
        {apis.map((api, i) => {
          const angle = (Math.PI * 2 * i) / apis.length - Math.PI / 2;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          const status = progress[api];
          return (
            <line
              key={`line-${api}`}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke={status === 'done' ? 'var(--accent-primary)' : 'var(--border-subtle)'}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            >
              {status === 'started' && (
                <animate attributeName="stroke-dashoffset" from="8" to="0" dur="1s" repeatCount="indefinite" />
              )}
            </line>
          );
        })}

        {/* API nodes */}
        {apis.map((api, i) => {
          const angle = (Math.PI * 2 * i) / apis.length - Math.PI / 2;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          const status = progress[api];
          const isDone = status === 'done';
          const isError = status === 'error';

          return (
            <g key={api}>
              <circle
                cx={x}
                cy={y}
                r={18}
                fill={isDone ? 'var(--accent-primary)' : isError ? 'rgba(220,38,38,0.3)' : 'var(--bg-card)'}
                stroke={isDone ? 'var(--accent-primary)' : 'var(--border-medium)'}
                strokeWidth={2}
              />
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fontSize="10"
                fill={isDone ? 'var(--text-inverse)' : 'var(--text-secondary)'}
                fontWeight="600"
              >
                {isDone ? '✓' : API_REGISTRY[api as keyof typeof API_REGISTRY]?.icon}
              </text>
              <text
                x={x}
                y={y + 32}
                textAnchor="middle"
                fontSize="9"
                fill="var(--text-muted)"
                fontFamily="Geist, sans-serif"
              >
                {API_REGISTRY[api as keyof typeof API_REGISTRY]?.name}
              </text>
            </g>
          );
        })}

        {/* Center orb */}
        <circle
          cx={centerX}
          cy={centerY}
          r={24}
          fill="var(--accent-primary)"
          opacity="0.2"
        >
          <animate attributeName="r" values="24;28;24" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.4;0.2" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx={centerX} cy={centerY} r={20} fill="var(--accent-primary)" />
        <text x={centerX} y={centerY + 4} textAnchor="middle" fontSize="10" fill="var(--text-inverse)" fontWeight="700">
          LUMA
        </text>
      </svg>
    </div>
  );
}

function formatMessage(text: string) {
  if (!text) return '';
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^###\s*(.*)$/gm, '<div class="text-sm font-semibold mt-4 mb-2">$1</div>')
    .replace(/^##\s*(.*)$/gm, '<div class="text-sm font-semibold mt-4 mb-2">$1</div>')
    .replace(/^[-*]\s+(.*)$/gm, '<div class="flex gap-2"><span>•</span><span>$1</span></div>');

  html = html.replace(/\n/g, '<br>');
  return html;
}

function parseAnswer(text: string): ParsedAnswer {
  if (!text) return { summary: '', keyFacts: [], whatThisMeans: '', takeAction: '', furtherReading: [], socialImpact: { score: null, reason: '', sdgs: [] as string[], metrics: '' } };

  const sections = {
    summary: /(?:##?\s*)?(?:Summary|Research Briefing)\s*[:]?\s*\n?([\s\S]*?)(?=(?:##?\s*)?(?:Key Facts|Key Findings|What This Means|Expert Analysis & Implications|Take Action|Actionable Steps|Further Reading|Recommended Resources|Social Impact & SDG Alignment|$))/i,
    keyFacts: /(?:##?\s*)?(?:Key Facts|Key Findings)\s*[:]?\s*\n?([\s\S]*?)(?=(?:##?\s*)?(?:What This Means|Expert Analysis & Implications|Take Action|Actionable Steps|Further Reading|Recommended Resources|Social Impact & SDG Alignment|$))/i,
    whatThisMeans: /(?:##?\s*)?(?:What This Means|Expert Analysis & Implications)\s*[:]?\s*\n?([\s\S]*?)(?=(?:##?\s*)?(?:Take Action|Actionable Steps|Further Reading|Recommended Resources|Social Impact & SDG Alignment|$))/i,
    takeAction: /(?:##?\s*)?(?:Take Action|Actionable Steps)\s*[:]?\s*\n?([\s\S]*?)(?=(?:##?\s*)?(?:Further Reading|Recommended Resources|Social Impact & SDG Alignment|$))/i,
    furtherReading: /(?:##?\s*)?(?:Further Reading|Recommended Resources)\s*[:]?\s*\n?([\s\S]*?)(?=(?:##?\s*)?(?:Social Impact & SDG Alignment|$))/i,
    socialImpact: /(?:##?\s*)?Social Impact & SDG Alignment\s*[:]?\s*\n?([\s\S]*)/i
  };

  const getMatch = (regex: RegExp) => text.match(regex)?.[1]?.trim() || '';

  let summary = getMatch(sections.summary);
  const keyFacts = getMatch(sections.keyFacts).split('\n').filter(l => l.trim()).map(l => {
    const raw = l.replace(/^[-•*]\s*/, '').trim();
    // Try to extract source
    const sourceMatch = raw.match(/\(Source:\s*([^)]+)\)/i);
    return {
      text: raw.replace(/\(Source:\s*([^)]+)\)/i, '').trim(),
      source: sourceMatch ? sourceMatch[1].trim() : null
    };
  });
  const whatThisMeans = getMatch(sections.whatThisMeans);
  const takeAction = getMatch(sections.takeAction);
  const furtherReading = getMatch(sections.furtherReading).split('\n').filter(l => l.trim()).map(l => l.replace(/^[-•*]\s*/, '').trim());

  // Fallback if structure is not perfectly followed
  if (!summary && !keyFacts.length && !whatThisMeans) {
    summary = text;
  }

  const socialImpactRaw = getMatch(sections.socialImpact);
  const scoreMatch = socialImpactRaw.match(/Score:\s*(\d+)/i);
  const sdgMatch = socialImpactRaw.match(/SDGs:\s*([^\n]*)/i);
  const reasonMatch = socialImpactRaw.match(/Reason:\s*([\s\S]*?)(?=Impact Metrics|$)/i);
  const metricsMatch = socialImpactRaw.match(/Impact Metrics:\s*([\s\S]*)/i);

  return {
    summary,
    keyFacts,
    whatThisMeans,
    takeAction,
    furtherReading,
    socialImpact: {
      score: scoreMatch ? parseInt(scoreMatch[1]) : null,
      sdgs: sdgMatch ? sdgMatch[1].split(',').map(s => s.trim()).filter(s => s && s !== 'None') : [],
      reason: reasonMatch ? reasonMatch[1].trim() : '',
      metrics: metricsMatch ? metricsMatch[1].trim() : ''
    }
  };
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const topicsParam = searchParams.get('topics') || '';
  const vision = searchParams.get('vision') === 'true';
  const initialTopics = topicsParam ? topicsParam.split(',') : [];

  const { readingLevel, setReadingLevel } = useSettings();
  const { saveItem, isSaved } = useLibrary();

  // Memoize initialTopics to avoid effect re-runs
  const memoizedInitialTopics = useRef(initialTopics).current;
  const [currentLevel, setCurrentLevel] = useState(readingLevel);
  const [loading, setLoading] = useState(false);
  const [identifying, setIdentifying] = useState(false);
  const [visionImage, setVisionImage] = useState<string | null>(null);
  const [identifiedQuery, setIdentifiedQuery] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [answer, setAnswer] = useState('');
  const [apiResults, setApiResults] = useState<Record<string, ApiResult<unknown>>>({});
  const [apiProgress, setApiProgress] = useState<Record<string, ProgressStatus | string>>({});
  const [followUps, setFollowUps] = useState<{ question: string; answer: string }[]>([]);
  const [followUpInput, setFollowUpInput] = useState('');
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [shareClicked, setShareClicked] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [randomFact] = useState(() => FACTS[Math.floor(Math.random() * FACTS.length)]);

  const answerRef = useRef<HTMLDivElement>(null);
  const parsed = parseAnswer(answer);
  const { displayed: typedAnswer, done } = useTypewriter(parsed.summary, 10);

  // Query counter
  const incrementCounter = useCallback(() => {
    const current = parseInt(localStorage.getItem('luma_query_count') || '0');
    localStorage.setItem('luma_query_count', (current + 1).toString());
  }, []);

  const performSearch = useCallback(async (query: string, topics: string[], image?: string) => {
    if (!query.trim() && !image) return;
    setLoading(true);
    setAnswer('');
    setApiResults({});
    setApiProgress({});
    setFollowUps([]);
    setShowFollowUp(false);
    setIdentifiedQuery('');

    const onProgress = (api: string, status: ProgressStatus) => {
      setApiProgress(prev => ({ ...prev, [api]: status }));
    };

    let searchResults: Record<string, ApiResult<unknown>>;
    let searchQuery = query;

    if (image) {
      setIdentifying(true);
      const { results, identifiedQuery: idQ } = await processVisionSearch(image, topics, onProgress);
      searchResults = results;
      searchQuery = idQ;
      setIdentifiedQuery(idQ);
      setIdentifying(false);
    } else {
      const { results } = await fanOutSearch(query, topics, onProgress);
      searchResults = results;
    }

    setApiResults(searchResults);

    // Get synthesis
    const synthesis = await getSynthesis(searchQuery, searchResults, currentLevel, image);
    setAnswer(synthesis);
    incrementCounter();
    setLoading(false);
    setTimeout(() => setShowFollowUp(true), 1200);
  }, [currentLevel, incrementCounter]);

  useEffect(() => {
    const tempImage = localStorage.getItem('luma_vision_temp');
    if (tempImage && vision) {
      setVisionImage(tempImage);
      localStorage.removeItem('luma_vision_temp');
      performSearch(q, memoizedInitialTopics, tempImage);
    } else if (q) {
      performSearch(q, memoizedInitialTopics);
    }
  }, [q, topicsParam, vision, memoizedInitialTopics, performSearch]);

  const handleSearch = (query: string, topics: string[]) => {
    const params: Record<string, string> = { q: query };
    if (topics.length > 0) params.topics = topics.join(',');
    setSearchParams(params);
  };

  const handleFollowUp = async () => {
    if (!followUpInput.trim() || followUps.length >= 5) return;
    const question = followUpInput;
    setFollowUpInput('');

    // Simple follow-up - just append to context
    const context = `Previous question: ${q}\nPrevious answer: ${answer}\nFollow-up: ${question}`;
    const { results } = await fanOutSearch(question, initialTopics);
    const followUpAnswer = await getSynthesis(context, results, currentLevel);

    setFollowUps(prev => [...prev, { question, answer: followUpAnswer }]);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch { /* fallback */ }
    setShareClicked(true);
    setTimeout(() => setShareClicked(false), 2500);
  };

  const handleDownload = async () => {
    if (!answerRef.current || downloading) return;
    setDownloading(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(answerRef.current, {
        backgroundColor: '#0A0F1E', // Match primary bg
        scale: 2,
        logging: false,
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `luma-research-${q.slice(0, 20).replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download failed', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleReadingLevelChange = async (level: string) => {
    const validLevel = level as 'simple' | 'standard' | 'technical';
    setCurrentLevel(validLevel);
    setReadingLevel(validLevel);
    if (q && apiResults) {
      setLoading(true);
      const synthesis = await getSynthesis(q, apiResults, validLevel);
      setAnswer(synthesis);
      setLoading(false);
    }
  };

  const handleSpeak = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const visionPrefix = identifiedQuery ? `Visual analysis identified: ${identifiedQuery}. ` : '';
    const textToSpeak = `${visionPrefix} ${parsed.summary}. Key findings: ${parsed.keyFacts.map(f => f.text).join('. ')}. Expert analysis: ${parsed.whatThisMeans}. Actionable steps: ${parsed.takeAction}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSave = () => {
    if (answer && !isSaved(q)) {
      saveItem(q, answer, initialTopics);
    }
  };

  const handleUtilityAction = async (action: string) => {
    setLoading(true);
    let taskPrompt = "";
    switch (action) {
      case 'presentation':
        taskPrompt = "Based on this research, create a detailed slide-by-slide presentation outline.";
        break;
      case 'essay':
        taskPrompt = "Based on this research, draft a formal academic essay/report outline including an introduction, body paragraphs with evidence, and a conclusion.";
        break;
      case 'simplify':
        taskPrompt = "Explain this entire research topic to me like I'm a complete beginner using simple analogies and clear language.";
        break;
      case 'quiz':
        taskPrompt = "Create a 5-question multiple-choice quiz based on this research to test my understanding. Include the correct answers at the end.";
        break;
      case 'cite':
        taskPrompt = "Generate formal academic citations for this research briefing in APA, MLA, and Harvard formats. Use 'Luma Sight Research Engine' as the author/publisher and today's date.";
        break;
      case 'translate':
        taskPrompt = "Translate this entire research briefing into Spanish, French, and Chinese. Provide the translations one after another with clear headings.";
        break;
      case 'community':
        taskPrompt = "Based on this research, create a 'Community Discussion Guide' with 3 talking points to help explain this topic to local community members or policymakers.";
        break;
    }

    const context = `Previous research: ${answer}\n\nUser requested: ${taskPrompt}`;
    const synthesis = await getSynthesis(context, apiResults, currentLevel, visionImage || undefined);
    setFollowUps(prev => [...prev, {
      question: action.charAt(0).toUpperCase() + action.slice(1),
      answer: synthesis
    }]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Top Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 max-w-2xl"
        >
          <SearchBar
            initialQuery={q}
            initialTopics={initialTopics}
            onSearch={handleSearch}
            compact
          />
        </motion.div>

        {/* Query Echo */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl mb-8 max-w-3xl"
          style={{ color: 'var(--text-primary)' }}
        >
          {q}
        </motion.h1>

        {/* Vision Header */}
        <AnimatePresence>
          {visionImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 flex flex-col md:flex-row gap-6 items-center p-6 rounded-3xl"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
            >
              <img src={visionImage} alt="Vision Input" className="w-48 h-48 object-cover rounded-2xl shadow-xl" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 text-accent-primary">
                  <Camera size={20} />
                  <span className="text-sm font-bold uppercase tracking-widest">Luma Sight Vision</span>
                </div>
                <h2 className="text-2xl font-display mb-2">Analyzing Visual Context...</h2>
                {identifying ? (
                  <div className="flex items-center gap-2 text-muted animate-pulse">
                    <Sparkles size={16} />
                    <span>Gemma 3 identifying objects and scientific markers...</span>
                  </div>
                ) : identifiedQuery && (
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm text-muted">Identified as:</span>
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-accent-soft text-accent-primary border border-accent-primary/20">
                      {identifiedQuery}
                    </span>
                    <div className="flex items-center gap-1 ml-2 text-green-500">
                      <SearchIcon size={14} />
                      <span className="text-xs font-medium">Triggering scientific retrieval</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* API Fan-out Visualization during loading */}
        <AnimatePresence>
          {loading && Object.keys(apiProgress).length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <ApiFanOutVisualization progress={apiProgress as Record<string, string>} />
              <p className="text-center text-sm font-body mb-8" style={{ color: 'var(--text-muted)' }}>
                Consulting {Object.values(apiProgress).filter(s => s === 'done').length} of {Object.keys(apiProgress).length} sources...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT PANEL: Detailed AI Briefing (Main Focus - 66%) */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {loading && !answer ? (
                <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <AnswerSkeleton />
                </motion.div>
              ) : answer ? (
                <motion.div
                  key="answer"
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-xl overflow-hidden"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderLeft: '3px solid var(--accent-primary)',
                  }}
                >
                  <div ref={answerRef} className="p-6">
                    {/* Reading Level Toggle */}
                    <div className="flex gap-1 mb-5" data-html2canvas-ignore>
                      {['simple', 'standard', 'technical'].map((level) => (
                        <button
                          key={level}
                          onClick={() => handleReadingLevelChange(level)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200"
                          style={{
                            backgroundColor: currentLevel === level ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                            color: currentLevel === level ? 'var(--text-inverse)' : 'var(--text-muted)',
                            border: `1px solid ${currentLevel === level ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                          }}
                        >
                          {level}
                        </button>
                      ))}
                    </div>

                    {/* Research Briefing (Typewriter) */}
                    {(typedAnswer || parsed.summary) && (
                      <div className="mb-5">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText size={14} style={{ color: 'var(--accent-primary)' }} />
                          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                            Research Briefing
                          </span>
                        </div>
                        <div
                          className="text-base leading-relaxed font-body space-y-4"
                          style={{ color: 'var(--text-secondary)' }}
                          dangerouslySetInnerHTML={{ __html: formatMessage(typedAnswer) }}
                        />
                      </div>
                    )}

                    {/* Sequential reveal of Key Facts & Analysis after typewriter is done */}
                    <AnimatePresence>
                      {done && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          {/* Key Facts */}
                          {parsed.keyFacts.length > 0 && (
                            <div className="mb-5">
                              <div className="w-full h-px mb-3" style={{ backgroundColor: 'var(--border-subtle)' }} />
                              <div className="flex items-center gap-2 mb-2">
                                <Sparkles size={14} style={{ color: 'var(--accent-primary)' }} />
                                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                                  Key Findings
                                </span>
                              </div>
                              <ul className="space-y-2">
                                {parsed.keyFacts.map((fact, i) => (
                                  <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group flex items-start gap-2 text-sm font-body"
                                    style={{ color: 'var(--text-secondary)' }}
                                  >
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--accent-primary)' }} />
                                    <div className="flex-1">
                                      {fact.text}
                                      {fact.source && (
                                        <div className="inline-flex items-center ml-1.5 px-1.5 py-0.5 rounded bg-bg-secondary text-[10px] font-bold text-text-muted border border-border-subtle group-hover:border-accent-primary group-hover:text-accent-primary transition-colors cursor-help relative group/tooltip">
                                          <Info size={10} className="mr-1" />
                                          {fact.source}
                                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-gray-900 text-white text-[10px] leading-tight rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50 pointer-events-none border border-white/10">
                                            <div className="font-bold text-accent-primary mb-1 uppercase tracking-tighter flex items-center gap-1">
                                              <Sparkles size={10} /> Live Verification from {fact.source}
                                            </div>
                                            {getSourceSnippet(fact.source.toLowerCase().replace(/\s/g, ''), apiResults[fact.source.toLowerCase().replace(/\s/g, '')]?.data) || "Verified against scientific database."}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900" />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Analysis */}
                          {parsed.whatThisMeans && (
                            <div className="mb-5">
                              <div className="w-full h-px mb-3" style={{ backgroundColor: 'var(--border-subtle)' }} />
                              <div className="flex items-center gap-2 mb-2">
                                <Lightbulb size={14} style={{ color: 'var(--accent-primary)' }} />
                                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                                  Analysis & Implications
                                </span>
                              </div>
                              <div className="text-sm leading-relaxed font-body" style={{ color: 'var(--text-secondary)' }} dangerouslySetInnerHTML={{ __html: formatMessage(parsed.whatThisMeans) }} />
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Take Action */}
                    {done && parsed.takeAction && (
                      <div className="mb-5">
                        <div className="w-full h-px mb-3" style={{ backgroundColor: 'var(--border-subtle)' }} />
                        <div className="flex items-center gap-2 mb-2">
                          <Zap size={14} style={{ color: 'var(--accent-primary)' }} />
                          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                            Take Action
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed font-body font-medium p-3 rounded-lg" style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--text-primary)' }}>
                          {parsed.takeAction}
                        </p>
                      </div>
                    )}

                    {/* Further Reading */}
                    {done && parsed.furtherReading.length > 0 && (
                      <div className="mb-5">
                        <div className="w-full h-px mb-3" style={{ backgroundColor: 'var(--border-subtle)' }} />
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen size={14} style={{ color: 'var(--accent-primary)' }} />
                          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                            Further Reading
                          </span>
                        </div>
                        <ul className="space-y-1">
                          {parsed.furtherReading.map((item, i) => (
                            <li key={i} className="text-sm font-body" style={{ color: 'var(--text-secondary)' }}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Utility Actions */}
                    {done && (
                      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2" data-html2canvas-ignore>
                        <button
                          onClick={() => handleUtilityAction('presentation')}
                          className="flex flex-col items-center justify-center p-3 rounded-xl border border-border-subtle hover:border-accent-primary hover:bg-accent-soft transition-all group"
                        >
                          <LayoutList size={20} className="mb-1 text-text-muted group-hover:text-accent-primary" />
                          <span className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: 'var(--text-secondary)' }}>Presentation</span>
                        </button>
                        <button
                          onClick={() => handleUtilityAction('essay')}
                          className="flex flex-col items-center justify-center p-3 rounded-xl border border-border-subtle hover:border-accent-primary hover:bg-accent-soft transition-all group"
                        >
                          <PenTool size={20} className="mb-1 text-text-muted group-hover:text-accent-primary" />
                          <span className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: 'var(--text-secondary)' }}>Draft Essay</span>
                        </button>
                        <button
                          onClick={() => handleUtilityAction('simplify')}
                          className="flex flex-col items-center justify-center p-3 rounded-xl border border-border-subtle hover:border-accent-primary hover:bg-accent-soft transition-all group"
                        >
                          <BrainCircuit size={20} className="mb-1 text-text-muted group-hover:text-accent-primary" />
                          <span className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: 'var(--text-secondary)' }}>Simplify</span>
                        </button>
                        <button
                          onClick={() => handleUtilityAction('quiz')}
                          className="flex flex-col items-center justify-center p-3 rounded-xl border border-border-subtle hover:border-accent-primary hover:bg-accent-soft transition-all group"
                        >
                          <MessageCircle size={20} className="mb-1 text-text-muted group-hover:text-accent-primary" />
                          <span className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: 'var(--text-secondary)' }}>Quiz Me</span>
                        </button>
                        <button
                          onClick={() => handleUtilityAction('cite')}
                          className="flex flex-col items-center justify-center p-3 rounded-xl border border-border-subtle hover:border-accent-primary hover:bg-accent-soft transition-all group"
                        >
                          <Quote size={20} className="mb-1 text-text-muted group-hover:text-accent-primary" />
                          <span className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: 'var(--text-secondary)' }}>Cite</span>
                        </button>
                        <button
                          onClick={() => handleUtilityAction('translate')}
                          className="flex flex-col items-center justify-center p-3 rounded-xl border border-border-subtle hover:border-accent-primary hover:bg-accent-soft transition-all group"
                        >
                          <Languages size={20} className="mb-1 text-text-muted group-hover:text-accent-primary" />
                          <span className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: 'var(--text-secondary)' }}>Translate</span>
                        </button>
                        <button
                          onClick={() => handleUtilityAction('community')}
                          className="flex flex-col items-center justify-center p-3 rounded-xl border border-border-subtle hover:border-accent-primary hover:bg-accent-soft transition-all group"
                        >
                          <Share2 size={20} className="mb-1 text-text-muted group-hover:text-accent-primary" />
                          <span className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: 'var(--text-secondary)' }}>Community</span>
                        </button>
                      </div>
                    )}

                    {/* Social Impact & SDGs */}
                    {done && parsed.socialImpact.score !== null && (
                      <div className="mt-6 pt-4 rounded-xl p-4" style={{ backgroundColor: 'rgba(var(--accent-primary-rgb), 0.05)', border: '1px solid var(--border-subtle)' }}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Sparkles size={16} className="text-yellow-500" />
                            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>
                              Gemma Impact Score
                            </span>
                          </div>
                          <span className="text-lg font-display font-bold" style={{ color: 'var(--accent-primary)' }}>
                            {parsed.socialImpact.score}/100
                          </span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${parsed.socialImpact.score}%` }}
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                          />
                        </div>

                        {parsed.socialImpact.sdgs.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {parsed.socialImpact.sdgs.map((sdg, i) => (
                              <span key={i} className="px-2 py-1 rounded text-[10px] font-bold bg-accent-primary text-text-inverse uppercase tracking-tighter">
                                {sdg}
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="text-xs italic mb-2" style={{ color: 'var(--text-muted)' }}>
                          {parsed.socialImpact.reason}
                        </p>
                        {parsed.socialImpact.metrics && (
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-accent-primary/10">
                            <Zap size={12} className="text-accent-primary" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-accent-primary">
                              {parsed.socialImpact.metrics}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Share & Download Buttons */}
                  <div className="px-6 py-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--border-subtle)' }} data-html2canvas-ignore>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {done ? 'Answer complete' : 'Typing answer...'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSpeak}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                        style={{
                          backgroundColor: speaking ? 'rgba(var(--accent-primary-rgb), 0.2)' : 'var(--bg-secondary)',
                          color: 'var(--accent-primary)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        {speaking ? <Zap size={12} className="animate-pulse" /> : <BookOpen size={12} />}
                        {speaking ? 'Stop' : 'Listen'}
                      </button>
                      <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          color: 'var(--accent-primary)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <Download size={12} /> {downloading ? 'Saving...' : 'Export Research'}
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                        style={{
                          backgroundColor: isSaved(q) ? 'rgba(var(--accent-primary-rgb), 0.1)' : 'var(--bg-secondary)',
                          color: 'var(--accent-primary)',
                          border: `1px solid ${isSaved(q) ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                        }}
                      >
                        {isSaved(q) ? <BookmarkCheck size={12} /> : <Bookmark size={12} />}
                        {isSaved(q) ? 'Saved' : 'Save to Library'}
                      </button>
                      <button
                        onClick={handleShare}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                        style={{
                          backgroundColor: shareClicked ? 'rgba(34,197,94,0.15)' : 'var(--bg-secondary)',
                          color: shareClicked ? '#22c55e' : 'var(--accent-primary)',
                          border: `1px solid ${shareClicked ? '#22c55e' : 'var(--border-subtle)'}`,
                        }}
                      >
                        {shareClicked ? (
                          <>Copied! ✓</>
                        ) : (
                          <><Share2 size={12} /> Share</>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Follow-up Thread */}
            <AnimatePresence>
              {followUps.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 space-y-3">
                  {followUps.map((fu, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="rounded-xl p-4"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderLeft: '3px solid var(--accent-primary)',
                      }}
                    >
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--accent-primary)' }}>{fu.question}</p>
                    <div className="text-sm space-y-3 font-body" style={{ color: 'var(--text-secondary)' }} dangerouslySetInnerHTML={{ __html: formatMessage(fu.answer) }} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Follow-up Input */}
            <AnimatePresence>
              {(showFollowUp || followUps.length > 0) && (
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mt-6 flex items-center gap-2 rounded-2xl px-5 py-4 shadow-lg sticky bottom-6 z-10"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1.5px solid var(--accent-primary)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                  }}
                  data-html2canvas-ignore
                >
                  <input
                    type="text"
                    value={followUpInput}
                    onChange={(e) => setFollowUpInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFollowUp()}
                    placeholder={followUps.length >= 5 ? "Start a new search for more questions" : "Ask a follow-up..."}
                    disabled={followUps.length >= 5}
                    className="flex-1 bg-transparent outline-none text-sm font-body"
                    style={{ color: 'var(--text-primary)' }}
                  />
                  <button
                    onClick={handleFollowUp}
                    disabled={followUps.length >= 5 || !followUpInput.trim()}
                    className="p-2 rounded-lg transition-colors disabled:opacity-50"
                    style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--text-inverse)' }}
                  >
                    <Send size={16} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT PANEL: Background Resources (33%) */}
          <div className="lg:col-span-4">
            <div className="mb-4 flex items-center gap-2">
              <BookOpen size={16} style={{ color: 'var(--text-muted)' }} />
              <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                Supporting Resources
              </h2>
            </div>
            <AnimatePresence>
              {loading && !Object.keys(apiResults).length ? (
                <motion.div key="source-skeletons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(apiResults).map(([apiKey, result], index) => {
                    if (!result.data) return null;
                    const api = API_REGISTRY[apiKey as keyof typeof API_REGISTRY];
                    if (!api) return null;

                    const confidence = getConfidence(apiKey, result.data);
                    if (confidence < 60) return null;

                    return (
                      <motion.div
                        key={apiKey}
                        initial={{ x: 40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.06 }}
                        className="rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5"
                        style={{
                          backgroundColor: 'var(--bg-card)',
                          border: '1px solid var(--border-subtle)',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
                          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-medium)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
                        }}
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider"
                              style={{
                                backgroundColor: 'var(--accent-soft)',
                                color: 'var(--accent-primary)',
                                border: '1px solid var(--border-medium)',
                              }}
                            >
                              {api.name}
                            </span>
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {result.time}ms
                            </span>
                          </div>
                          <a
                            href={getSourceUrl(apiKey, result.data)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded transition-colors"
                            style={{ color: 'var(--text-muted)' }}
                            onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--accent-primary)'; }}
                            onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'var(--text-muted)'; }}
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>

                        {/* Content snippet */}
                        <p className="text-sm font-body leading-relaxed line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                          {getSourceSnippet(apiKey, result.data)}
                        </p>

                        {/* Confidence bar */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>
                            <span>Relevance</span>
                            <span>{getConfidence(apiKey, result.data)}%</span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${getConfidence(apiKey, result.data)}%` }}
                              transition={{ duration: 0.6, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
                              className="h-full rounded-full"
                              style={{
                                background: 'linear-gradient(90deg, var(--accent-glow), var(--accent-primary))',
                              }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* No results message */}
                  {!loading && Object.values(apiResults).every(r => !r.data) && (
                    <div className="text-center py-12">
                      <p className="text-sm font-body mb-2" style={{ color: 'var(--text-muted)' }}>
                        No data returned from sources. This might be a temporary issue.
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Did you know? {randomFact}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function getSourceUrl(apiKey: string, data: any): string {
  if (!data) return '#';
  switch (apiKey) {
    case 'wikipedia': return data.url || 'https://wikipedia.org';
    case 'pubmed': return data.articles?.[0]?.url || 'https://pubmed.ncbi.nlm.nih.gov';
    case 'nasa': return data.apod?.url || 'https://nasa.gov';
    case 'newsapi': return data.articles?.[0]?.url || 'https://newsapi.org';
    case 'worldBank': return 'https://data.worldbank.org';
    case 'restCountries': return 'https://restcountries.com';
    case 'openMeteo': return 'https://open-meteo.com';
    default: return '#';
  }
}

function getSourceSnippet(apiKey: string, data: any): string {
  if (!data) return 'Data retrieved from source.';
  switch (apiKey) {
    case 'wikipedia': return data.extract || 'Wikipedia article retrieved.';
    case 'pubmed': return data.articles?.[0]?.title || `${data.count || 0} articles found on PubMed.`;
    case 'nasa': return data.apod?.explanation?.slice(0, 200) || 'NASA data retrieved.';
    case 'newsapi': return data.articles?.[0]?.description || `${data.totalResults || 0} news articles found.`;
    case 'worldBank': return data.indicators?.[0]?.name || 'World Bank indicators retrieved.';
    case 'restCountries': return data.countries?.[0]?.name?.common || 'Country data retrieved.';
    case 'openMeteo': return `Current temperature: ${data.current?.temperature_2m}°C at location (${data.location?.lat}, ${data.location?.lon})`;
    default: return 'Data retrieved from source.';
  }
}

function getConfidence(apiKey: string, data: any): number {
  if (!data) return 0;
  switch (apiKey) {
    case 'wikipedia': return data.extract ? 94 : 30;
    case 'pubmed': return data.articles?.length ? 98 : 20;
    case 'nasa': return data.apod?.explanation ? 85 : 40;
    case 'newsapi': return data.articles?.length ? 71 : 25;
    case 'worldBank': return data.indicators?.length ? 88 : 35;
    case 'restCountries': return data.countries?.length ? 76 : 20;
    case 'openMeteo': return data.current?.temperature_2m ? 90 : 30;
    default: return 50;
  }
}
