import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HelpCircle, X } from 'lucide-react';
import { ThemeProvider } from '@/context/ThemeContext';
import { SettingsProvider } from '@/context/SettingsContext';
import Home from '@/pages/Home';
import SearchPage from '@/pages/Search';
import ChatPage from '@/pages/Chat';
import About from '@/pages/About';
import HowItWorks from '@/pages/HowItWorks';
import Sources from '@/pages/Sources';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';

function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setOpen(prev => !prev);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const shortcuts = [
    { keys: ['/ or Ctrl+K'], action: 'Focus search bar' },
    { keys: ['Esc'], action: 'Clear search / close' },
    { keys: ['Ctrl+Enter'], action: 'Submit search' },
    { keys: ['Ctrl+D'], action: 'Toggle dark/light mode' },
    { keys: ['Ctrl+Shift+S'], action: 'Open share card' },
    { keys: ['1 / 2 / 3'], action: 'Switch reading level' },
    { keys: ['?'], action: 'Show this help' },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-muted)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.color = 'var(--accent-primary)';
          (e.target as HTMLElement).style.borderColor = 'var(--accent-primary)';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.color = 'var(--text-muted)';
          (e.target as HTMLElement).style.borderColor = 'var(--border-subtle)';
        }}
      >
        <HelpCircle size={18} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[200]"
              style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-full max-w-md rounded-2xl p-6"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl" style={{ color: 'var(--text-primary)' }}>Keyboard Shortcuts</h2>
                <button onClick={() => setOpen(false)} style={{ color: 'var(--text-muted)' }}>
                  <X size={18} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {shortcuts.map((shortcut, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm font-body" style={{ color: 'var(--text-secondary)' }}>
                      {shortcut.action}
                    </span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, j) => (
                        <span
                          key={j}
                          className="px-2 py-1 rounded text-xs font-semibold font-mono"
                          style={{
                            backgroundColor: 'var(--accent-soft)',
                            color: 'var(--accent-primary)',
                          }}
                        >
                          {key}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function OfflineBanner() {
  const [offline, setOffline] = useState(false);
  const [showOnline, setShowOnline] = useState(false);

  useEffect(() => {
    const onOffline = () => setOffline(true);
    const onOnline = () => {
      setShowOnline(true);
      setTimeout(() => {
        setOffline(false);
        setShowOnline(false);
      }, 2000);
    };

    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);
    setOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('online', onOnline);
    };
  }, []);

  if (!offline && !showOnline) return null;

  return (
    <motion.div
      initial={{ y: -52 }}
      animate={{ y: 0 }}
      exit={{ y: -52 }}
      className="fixed top-0 left-0 right-0 z-[150] h-[52px] flex items-center justify-center gap-2 text-sm font-medium"
      style={{
        background: showOnline ? '#2D7A4F' : undefined,
      }}
    >
      {showOnline ? (
        <span style={{ color: 'var(--text-inverse)' }}>✓ You're back online!</span>
      ) : (
        <div className="offline-banner absolute inset-0 flex items-center justify-center">
          <span style={{ color: 'var(--text-inverse)' }}>
            ✈️ You're offline — Luma is showing cached results
          </span>
        </div>
      )}
      {!showOnline && (
        <button
          onClick={() => setOffline(false)}
          className="absolute right-4"
          style={{ color: 'var(--text-inverse)' }}
        >
          ×
        </button>
      )}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/sources" element={<Sources />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <BrowserRouter>
          <OfflineBanner />
          <AnimatedRoutes />
          <KeyboardShortcuts />
        </BrowserRouter>
      </SettingsProvider>
    </ThemeProvider>
  );
}
