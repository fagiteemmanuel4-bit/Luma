import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Search, X, Clock, Trash2 } from 'lucide-react';

const PLACEHOLDERS = [
  "Why is clean water still scarce in 2025?",
  "How does the human immune system fight viruses?",
  "What causes hyperinflation?",
  "How do vaccines create herd immunity?",
  "Why is the Arctic warming faster than anywhere?",
  "What is CRISPR and how does it edit DNA?",
  "How does solar energy work at night?",
  "Why do earthquakes cluster in certain regions?",
  "What are the long-term effects of deforestation?",
  "How does antibiotic resistance develop?",
];

const TOPICS = ['Health', 'Science', 'Education', 'Climate', 'Economics', 'World'];

function useQueryHistory() {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('luma_search_history') || '[]');
    } catch { return []; }
  });

  const addQuery = useCallback((query: string, topics: string[]) => {
    setHistory((prev: any[]) => {
      const filtered = prev.filter((h: any) => h.query !== query);
      const next = [{ query, topics, date: Date.now() }, ...filtered].slice(0, 8);
      localStorage.setItem('luma_search_history', JSON.stringify(next));
      return next;
    });
  }, []);

  const removeQuery = useCallback((query: string) => {
    setHistory((prev: any[]) => {
      const next = prev.filter((h: any) => h.query !== query);
      localStorage.setItem('luma_search_history', JSON.stringify(next));
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('luma_search_history');
  }, []);

  return { history, addQuery, removeQuery, clearAll };
}

export default function SearchBar({
  initialQuery = '',
  initialTopics = [],
  onSearch,
  compact = false,
  autoFocus = false,
}: {
  initialQuery?: string;
  initialTopics?: string[];
  onSearch?: (query: string, topics: string[]) => void;
  compact?: boolean;
  autoFocus?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(initialTopics);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { history, addQuery, removeQuery, clearAll } = useQueryHistory();

  // Placeholder rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % PLACEHOLDERS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Autofocus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [autoFocus]);

  const handleSubmit = useCallback(() => {
    if (!query.trim()) return;
    addQuery(query, selectedTopics);
    if (onSearch) {
      onSearch(query, selectedTopics);
    } else {
      const topicsParam = selectedTopics.length > 0 ? `&topics=${selectedTopics.join(',')}` : '';
      navigate(`/search?q=${encodeURIComponent(query)}${topicsParam}`);
    }
  }, [query, selectedTopics, onSearch, navigate, addQuery]);

  const toggleTopic = useCallback((topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  }, []);

  const startVoice = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setTimeout(() => handleSubmit(), 800);
    };

    recognition.start();
  }, [handleSubmit]);

  const hasSpeechRecognition = typeof window !== 'undefined' &&
    !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition;

  return (
    <div className={`w-full ${compact ? 'max-w-xl' : 'max-w-2xl'} mx-auto`}>
      {/* Search Bar */}
      <div
        className="relative flex items-center gap-2 rounded-2xl theme-transition"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: focused ? '1.5px solid var(--accent-primary)' : '1.5px solid var(--border-medium)',
          boxShadow: focused ? '0 0 0 4px rgba(193,125,60,0.12)' : 'none',
        }}
      >
        {/* Topic tags */}
        <AnimatePresence>
          {selectedTopics.map(topic => (
            <motion.span
              key={topic}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="ml-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'var(--text-inverse)',
              }}
            >
              {topic}
              <button
                onClick={(e) => { e.stopPropagation(); toggleTopic(topic); }}
                className="hover:opacity-70"
              >
                <X size={12} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { setFocused(true); setShowHistory(true); }}
          onBlur={() => setTimeout(() => { setFocused(false); setShowHistory(false); }, 200)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
            if (e.key === 'Escape') { setQuery(''); setSelectedTopics([]); }
          }}
          placeholder=""
          className="flex-1 py-3.5 px-3 bg-transparent outline-none font-body text-base"
          style={{ color: 'var(--text-primary)' }}
        />

        {/* Placeholder animation */}
        {!query && (
          <div className="absolute left-3 right-24 top-1/2 -translate-y-1/2 pointer-events-none overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={placeholderIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="font-body text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                {PLACEHOLDERS[placeholderIndex]}
                <span className="cursor-blink" />
              </motion.span>
            </AnimatePresence>
          </div>
        )}

        {/* Mic button */}
        {hasSpeechRecognition && (
          <button
            onClick={startVoice}
            className={`p-2 rounded-xl transition-all duration-200 mr-1 ${isListening ? 'mic-pulse' : ''}`}
            style={{
              color: isListening ? 'var(--accent-primary)' : 'var(--text-muted)',
              backgroundColor: isListening ? 'rgba(193,125,60,0.1)' : 'transparent',
            }}
          >
            {isListening ? (
              <div className="flex items-end gap-0.5 h-5">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 16, 4] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                    className="w-1 rounded-full"
                    style={{ backgroundColor: 'var(--accent-primary)' }}
                  />
                ))}
              </div>
            ) : (
              <Mic size={18} />
            )}
          </button>
        )}

        {/* Search button */}
        <button
          onClick={handleSubmit}
          className="mr-1.5 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: 'var(--accent-primary)',
            color: 'var(--text-inverse)',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.backgroundColor = 'var(--accent-glow)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.backgroundColor = 'var(--accent-primary)';
          }}
        >
          <Search size={18} />
        </button>
      </div>

      {/* History dropdown */}
      <AnimatePresence>
        {showHistory && !query && history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 rounded-xl overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-1"
              style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}
            >
              <Clock size={12} /> Recent Searches
            </div>
            {history.map((item: any) => (
              <div
                key={item.query}
                className="flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-secondary)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                onClick={() => {
                  setQuery(item.query);
                  setSelectedTopics(item.topics || []);
                  handleSubmit();
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm truncate font-body" style={{ color: 'var(--text-primary)' }}>{item.query}</span>
                  {item.topics?.map((t: string) => (
                    <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider"
                      style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-primary)' }}>
                      {t}
                    </span>
                  ))}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeQuery(item.query); }}
                  className="p-1 rounded flex-shrink-0"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            <button
              onClick={clearAll}
              className="w-full px-3 py-2 text-xs text-center font-medium transition-colors"
              style={{ color: 'var(--accent-primary)' }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.backgroundColor = 'var(--bg-secondary)'; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.backgroundColor = 'transparent'; }}
            >
              Clear all
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Topic Chips */}
      {!compact && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mt-5"
        >
          {TOPICS.map((topic, i) => {
            const isActive = selectedTopics.includes(topic);
            return (
              <motion.button
                key={topic}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.06 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleTopic(topic)}
                className="px-4 py-2 rounded-full text-sm font-medium font-body transition-all duration-200"
                style={{
                  backgroundColor: isActive ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: isActive ? 'var(--text-inverse)' : 'var(--text-secondary)',
                  border: `1px solid ${isActive ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.target as HTMLElement).style.backgroundColor = 'var(--accent-soft)';
                    (e.target as HTMLElement).style.borderColor = 'var(--accent-primary)';
                    (e.target as HTMLElement).style.color = 'var(--accent-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.target as HTMLElement).style.backgroundColor = 'var(--bg-secondary)';
                    (e.target as HTMLElement).style.borderColor = 'var(--border-subtle)';
                    (e.target as HTMLElement).style.color = 'var(--text-secondary)';
                  }
                }}
              >
                {topic}
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
