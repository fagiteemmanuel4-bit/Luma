import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Type, Mic, History, Trash2, RotateCcw, ExternalLink, Github, Bug } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useSettings } from '@/context/SettingsContext';

export default function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { isDark, toggle } = useTheme();
  const {
    readingLevel, setReadingLevel,
    voiceEnabled, setVoiceEnabled,
    autoSubmitVoice, setAutoSubmitVoice,
    searchHistoryEnabled, setSearchHistoryEnabled,
    fontSize, setFontSize,
    clearHistory, clearCache,
  } = useSettings();

  const [showHistoryConfirm, setShowHistoryConfirm] = useState(false);

  const readingLevels = ['simple', 'standard', 'technical'];
  const fontSizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100]"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          />
          {/* Panel */}
          <motion.div
            initial={{ x: 360 }}
            animate={{ x: 0 }}
            exit={{ x: 360 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[101] w-full sm:w-[360px] overflow-y-auto"
            style={{
              backgroundColor: 'var(--bg-card)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl" style={{ color: 'var(--text-primary)' }}>Settings</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Appearance */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                  Appearance
                </h3>
                <div className="space-y-3">
                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="flex items-center gap-2">
                      {isDark ? <Moon size={16} style={{ color: 'var(--accent-primary)' }} /> : <Sun size={16} style={{ color: 'var(--accent-primary)' }} />}
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Theme</span>
                    </div>
                    <button
                      onClick={toggle}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--text-inverse)' }}
                    >
                      {isDark ? 'Dark' : 'Light'}
                    </button>
                  </div>
                  {/* Font Size */}
                  <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="flex items-center gap-2">
                      <Type size={16} style={{ color: 'var(--accent-primary)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Font Size</span>
                    </div>
                    <div className="flex gap-1">
                      {fontSizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setFontSize(size)}
                          className="px-2 py-1 rounded text-xs font-semibold capitalize transition-colors"
                          style={{
                            backgroundColor: fontSize === size ? 'var(--accent-primary)' : 'transparent',
                            color: fontSize === size ? 'var(--text-inverse)' : 'var(--text-muted)',
                            border: `1px solid ${fontSize === size ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                          }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Behavior */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                  Search Behavior
                </h3>
                <div className="space-y-3">
                  {/* Reading Level */}
                  <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <span className="text-sm font-medium block mb-2" style={{ color: 'var(--text-primary)' }}>Default Reading Level</span>
                    <div className="flex gap-1">
                      {readingLevels.map(level => (
                        <button
                          key={level}
                          onClick={() => setReadingLevel(level as any)}
                          className="flex-1 px-2 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors"
                          style={{
                            backgroundColor: readingLevel === level ? 'var(--accent-primary)' : 'transparent',
                            color: readingLevel === level ? 'var(--text-inverse)' : 'var(--text-muted)',
                            border: `1px solid ${readingLevel === level ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                          }}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Voice Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="flex items-center gap-2">
                      <Mic size={16} style={{ color: 'var(--accent-primary)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Voice Input</span>
                    </div>
                    <button
                      onClick={() => setVoiceEnabled(!voiceEnabled)}
                      className="w-10 h-5 rounded-full relative transition-colors"
                      style={{ backgroundColor: voiceEnabled ? 'var(--accent-primary)' : 'var(--border-medium)' }}
                    >
                      <div
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                        style={{ transform: voiceEnabled ? 'translateX(20px)' : 'translateX(2px)' }}
                      />
                    </button>
                  </div>
                  {/* Auto Submit */}
                  <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Auto-submit after voice</span>
                    <button
                      onClick={() => setAutoSubmitVoice(!autoSubmitVoice)}
                      className="w-10 h-5 rounded-full relative transition-colors"
                      style={{ backgroundColor: autoSubmitVoice ? 'var(--accent-primary)' : 'var(--border-medium)' }}
                    >
                      <div
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                        style={{ transform: autoSubmitVoice ? 'translateX(20px)' : 'translateX(2px)' }}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Privacy & Data */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                  Privacy & Data
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="flex items-center gap-2">
                      <History size={16} style={{ color: 'var(--accent-primary)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Search History</span>
                    </div>
                    <button
                      onClick={() => setSearchHistoryEnabled(!searchHistoryEnabled)}
                      className="w-10 h-5 rounded-full relative transition-colors"
                      style={{ backgroundColor: searchHistoryEnabled ? 'var(--accent-primary)' : 'var(--border-medium)' }}
                    >
                      <div
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                        style={{ transform: searchHistoryEnabled ? 'translateX(20px)' : 'translateX(2px)' }}
                      />
                    </button>
                  </div>

                  {showHistoryConfirm ? (
                    <div className="p-3 rounded-xl flex items-center justify-between" style={{ backgroundColor: 'rgba(193,125,60,0.1)', border: '1px solid var(--accent-primary)' }}>
                      <span className="text-sm" style={{ color: 'var(--accent-primary)' }}>Are you sure?</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowHistoryConfirm(false)}
                          className="px-2 py-1 rounded text-xs"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => { clearHistory(); setShowHistoryConfirm(false); }}
                          className="px-2 py-1 rounded text-xs font-semibold"
                          style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--text-inverse)' }}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowHistoryConfirm(true)}
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium transition-colors"
                      style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--accent-primary)' }}
                    >
                      <Trash2 size={14} /> Clear Search History
                    </button>
                  )}

                  <button
                    onClick={clearCache}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium transition-colors"
                    style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--accent-primary)' }}
                  >
                    <Trash2 size={14} /> Clear Cached Results
                  </button>
                </div>
              </div>

              {/* About */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                  About Luma
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span>Version</span>
                    <span>1.0.0 (Gemma 4 Impact Challenge)</span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span>Built by</span>
                    <span>Mercury</span>
                  </div>
                  <button
                    onClick={() => { localStorage.removeItem('luma_onboarded'); window.location.reload(); }}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium transition-colors mt-2"
                    style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--accent-primary)' }}
                  >
                    <RotateCcw size={14} /> Replay Welcome Tour
                  </button>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium transition-colors"
                    style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                  >
                    <Github size={14} /> View on GitHub <ExternalLink size={12} />
                  </a>
                  <a
                    href="/contact?reason=bug"
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium transition-colors"
                    style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                  >
                    <Bug size={14} /> Report a Bug <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
