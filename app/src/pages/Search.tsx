import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Send, ChevronDown, ChevronUp, ExternalLink, BookOpen, Lightbulb, FileText, Sparkles } from 'lucide-react';
import { fanOutSearch, getSynthesis, API_REGISTRY } from '@/api/fanOut';
import { useSettings } from '@/context/SettingsContext';
import SearchBar from '@/components/SearchBar';
import Navbar from '@/components/Navbar';

const FACTS = [
  "The ocean absorbs 93% of excess heat from global warming.",
  "Wikipedia has over 6.7 million articles in English.",
  "NASA's APOD has published an image every day since 1995.",
  "The human body has about 37 trillion cells.",
  "Light travels at exactly 299,792,458 meters per second.",
];

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

function parseAnswer(text: string) {
  const summary = text.match(/(?:##?\s*)?Summary\s*[:]?\s*\n?([\s\S]*?)(?=(?:##?\s*)?(?:Key Facts|What This Means|Further Reading|$))/i)?.[1]?.trim() || '';
  const keyFactsMatch = text.match(/(?:##?\s*)?Key Facts\s*[:]?\s*\n?([\s\S]*?)(?=(?:##?\s*)?(?:What This Means|Further Reading|$))/i);
  const keyFacts = keyFactsMatch ? keyFactsMatch[1].trim().split('\n').filter(l => l.trim()).map(l => l.replace(/^[-•*]\s*/, '').trim()) : [];
  const whatThisMeans = text.match(/(?:##?\s*)?What This Means\s*[:]?\s*\n?([\s\S]*?)(?=(?:##?\s*)?(?:Further Reading|$))/i)?.[1]?.trim() || '';
  const furtherReading = text.match(/(?:##?\s*)?Further Reading\s*[:]?\s*\n?([\s\S]*)/i)?.[1]?.trim().split('\n').filter(l => l.trim()).map(l => l.replace(/^[-•*]\s*/, '').trim()) || [];
  return { summary, keyFacts, whatThisMeans, furtherReading };
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const topicsParam = searchParams.get('topics') || '';
  const initialTopics = topicsParam ? topicsParam.split(',') : [];

  const { readingLevel, setReadingLevel } = useSettings();
  const [currentLevel, setCurrentLevel] = useState(readingLevel);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [apiResults, setApiResults] = useState<Record<string, any>>({});
  const [apiProgress, setApiProgress] = useState<Record<string, string>>({});
  const [followUps, setFollowUps] = useState<{ question: string; answer: string }[]>([]);
  const [followUpInput, setFollowUpInput] = useState('');
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [shareClicked, setShareClicked] = useState(false);
  const [randomFact] = useState(() => FACTS[Math.floor(Math.random() * FACTS.length)]);

  const { displayed: typedAnswer, done } = useTypewriter(answer, 12);

  // Query counter
  const incrementCounter = useCallback(() => {
    const current = parseInt(localStorage.getItem('luma_query_count') || '0');
    localStorage.setItem('luma_query_count', (current + 1).toString());
  }, []);

  const performSearch = useCallback(async (query: string, topics: string[]) => {
    if (!query.trim()) return;
    setLoading(true);
    setAnswer('');
    setApiResults({});
    setApiProgress({});
    setFollowUps([]);
    setShowFollowUp(false);

    const onProgress = (api: string, status: string) => {
      setApiProgress(prev => ({ ...prev, [api]: status }));
    };

    const { results } = await fanOutSearch(query, topics, onProgress);
    setApiResults(results);

    // Get synthesis
    const synthesis = await getSynthesis(query, results, currentLevel);
    setAnswer(synthesis);
    incrementCounter();
    setLoading(false);
    setTimeout(() => setShowFollowUp(true), 1200);
  }, [currentLevel, incrementCounter]);

  useEffect(() => {
    if (q) {
      performSearch(q, initialTopics);
    }
  }, [q]); // eslint-disable-line

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

  const handleReadingLevelChange = async (level: string) => {
    setCurrentLevel(level as any);
    setReadingLevel(level as any);
    if (q && apiResults) {
      setLoading(true);
      const synthesis = await getSynthesis(q, apiResults, level);
      setAnswer(synthesis);
      setLoading(false);
    }
  };

  const parsed = parseAnswer(answer);
  const displaySummary = parsed.summary || answer;

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

        {/* API Fan-out Visualization during loading */}
        <AnimatePresence>
          {loading && Object.keys(apiProgress).length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <ApiFanOutVisualization progress={apiProgress} />
              <p className="text-center text-sm font-body mb-8" style={{ color: 'var(--text-muted)' }}>
                Consulting {Object.values(apiProgress).filter(s => s === 'done').length} of {Object.keys(apiProgress).length} sources...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT PANEL: Answer Card (40%) */}
          <div className="lg:col-span-2">
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
                  <div className="p-6">
                    {/* Reading Level Toggle */}
                    <div className="flex gap-1 mb-5">
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

                    {/* Summary */}
                    {answer && (
                      <div className="mb-5">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText size={14} style={{ color: 'var(--accent-primary)' }} />
                          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                            Summary
                          </span>
                        </div>
                        <div
                          className="text-sm leading-relaxed font-body"
                          style={{ color: 'var(--text-secondary)' }}
                          dangerouslySetInnerHTML={{ __html: formatMessage(typedAnswer || displaySummary) }}
                        />
                      </div>
                    )}

                    {/* Key Facts */}
                    {parsed.keyFacts.length > 0 && (
                      <div className="mb-5">
                        <div className="w-full h-px mb-3" style={{ backgroundColor: 'var(--border-subtle)' }} />
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles size={14} style={{ color: 'var(--accent-primary)' }} />
                          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                            Key Facts
                          </span>
                        </div>
                        <ul className="space-y-2">
                          {parsed.keyFacts.map((fact, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 + i * 0.1 }}
                              className="flex items-start gap-2 text-sm font-body"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--accent-primary)' }} />
                              {fact}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* What This Means */}
                    {parsed.whatThisMeans && (
                      <div className="mb-5">
                        <div className="w-full h-px mb-3" style={{ backgroundColor: 'var(--border-subtle)' }} />
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb size={14} style={{ color: 'var(--accent-primary)' }} />
                          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                            What This Means
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed font-body" style={{ color: 'var(--text-secondary)' }}>
                          {parsed.whatThisMeans}
                        </p>
                      </div>
                    )}

                    {/* Further Reading */}
                    {parsed.furtherReading.length > 0 && (
                      <div>
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
                  </div>

                  {/* Share Button */}
                  <div className="px-6 py-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {done ? 'Answer complete' : 'Typing answer...'}
                    </span>
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
                      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--accent-primary)' }}>Follow-up:</p>
                      <p className="text-sm mb-2" style={{ color: 'var(--text-primary)' }}>{fu.question}</p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{fu.answer.slice(0, 500)}...</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Follow-up Input */}
            <AnimatePresence>
              {showFollowUp && (
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 flex items-center gap-2 rounded-xl px-4 py-3"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1.5px solid var(--border-medium)',
                  }}
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

          {/* RIGHT PANEL: Source Cards (60%) */}
          <div className="lg:col-span-3">
            <AnimatePresence>
              {loading && !Object.keys(apiResults).length ? (
                <motion.div key="source-skeletons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(apiResults).map(([apiKey, result]: [string, any], index) => {
                    if (!result.data) return null;
                    const api = API_REGISTRY[apiKey as keyof typeof API_REGISTRY];
                    if (!api) return null;

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
  switch (apiKey) {
    case 'wikipedia': return data.url || 'https://wikipedia.org';
    case 'pubmed': return data.articles?.[0]?.url || 'https://pubmed.ncbi.nlm.nih.gov';
    case 'nasa': return data.apod?.url || 'https://nasa.gov';
    case 'newsapi': return data.articles?.[0]?.url || 'https://newsapi.org';
    case 'openLibrary': return data.books?.[0]?.url || 'https://openlibrary.org';
    case 'worldBank': return 'https://data.worldbank.org';
    case 'restCountries': return 'https://restcountries.com';
    case 'openMeteo': return 'https://open-meteo.com';
    default: return '#';
  }
}

function getSourceSnippet(apiKey: string, data: any): string {
  switch (apiKey) {
    case 'wikipedia': return data.extract || 'Wikipedia article retrieved.';
    case 'pubmed': return data.articles?.[0]?.title || `${data.count} articles found on PubMed.`;
    case 'nasa': return data.apod?.explanation?.slice(0, 200) || 'NASA data retrieved.';
    case 'newsapi': return data.articles?.[0]?.description || `${data.totalResults} news articles found.`;
    case 'openLibrary': return data.books?.[0]?.title ? `"${data.books[0].title}" by ${data.books[0].author_name}` : `${data.numFound} books found.`;
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
    case 'openLibrary': return data.books?.length ? 82 : 30;
    case 'worldBank': return data.indicators?.length ? 88 : 35;
    case 'restCountries': return data.countries?.length ? 76 : 20;
    case 'openMeteo': return data.current?.temperature_2m ? 90 : 30;
    default: return 50;
  }
}
