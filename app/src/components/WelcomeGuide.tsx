import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Plane, Share2, Keyboard, ArrowRight, Check } from 'lucide-react';

const STARTER_PROMPTS = [
  "Why do more children die from malaria in Africa?",
  "How does a vaccine train the immune system?",
  "What causes inflation and who does it hurt most?",
  "Why is clean water still scarce in 2024?",
  "How does deforestation affect local rainfall?",
  "What is quantum computing and why does it matter?",
  "How do solar panels work in cloudy weather?",
  "Why are antibiotics becoming less effective?",
];

const RANDOM_PROMPT = () => STARTER_PROMPTS[Math.floor(Math.random() * STARTER_PROMPTS.length)];

export default function WelcomeGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [showExplosion, setShowExplosion] = useState(false);
  const totalSteps = 5;

  // Typing effect for Step 2
  useEffect(() => {
    if (step === 1 && open) {
      const text = "Why is the ocean warming faster near the poles?";
      let i = 0;
      setTypedText('');
      const interval = setInterval(() => {
        if (i <= text.length) {
          setTypedText(text.slice(0, i));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 40);
      return () => clearInterval(interval);
    }
  }, [step, open]);

  // Orb explosion for Step 5
  useEffect(() => {
    if (step === 4 && open) {
      setShowExplosion(true);
      const timer = setTimeout(() => setShowExplosion(false), 800);
      return () => clearTimeout(timer);
    }
  }, [step, open]);

  const handleDismiss = () => {
    localStorage.setItem('luma_onboarded', 'true');
    onClose();
  };

  const handleStartExploring = () => {
    localStorage.setItem('luma_onboarded', 'true');
    onClose();
  };

  const handleRandomPrompt = () => {
    localStorage.setItem('luma_onboarded', 'true');
    const prompt = RANDOM_PROMPT();
    window.location.href = `/search?q=${encodeURIComponent(prompt)}`;
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style={{
          backgroundColor: 'rgba(10, 15, 30, 0.85)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-[520px] rounded-[20px] overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            boxShadow: 'var(--shadow-lg), 0 0 80px rgba(193, 125, 60, 0.15)',
          }}
        >
          {/* Progress Bar */}
          <div className="h-[3px] w-full" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <motion.div
              className="h-full"
              style={{ backgroundColor: 'var(--accent-primary)' }}
              animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-8 pt-6 pb-2">
            <button
              onClick={handleDismiss}
              className="text-xs font-medium transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              Skip tour →
            </button>
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              {step + 1} of {totalSteps}
            </span>
          </div>

          {/* Content */}
          <div className="px-8 pb-8 pt-4 min-h-[400px]">
            <AnimatePresence mode="wait">
              {/* STEP 1: Welcome */}
              {step === 0 && (
                <motion.div
                  key="step1"
                  initial={{ x: 0, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -40, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="text-center"
                >
                  <div className="mb-6">
                    <span className="font-display text-[52px] block mb-4" style={{ color: 'var(--accent-primary)' }}>
                      Luma
                    </span>
                    <div
                      className="w-20 h-20 rounded-full mx-auto"
                      style={{
                        background: `radial-gradient(circle, var(--orb-color-1) 0%, transparent 70%)`,
                        filter: 'blur(20px)',
                      }}
                    />
                  </div>
                  <h2 className="font-display text-[28px] mb-4" style={{ color: 'var(--text-primary)' }}>
                    Welcome to Luma.
                  </h2>
                  <p className="font-body text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
                    You just unlocked access to nine of the world's most powerful open knowledge sources — all synthesized by Google's Gemma 4 AI in seconds.
                    <br /><br />
                    No account. No tracking. No limits on curiosity.
                    <br /><br />
                    Let us show you around.
                  </p>
                  <button
                    onClick={() => setStep(1)}
                    className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02]"
                    style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--text-inverse)' }}
                  >
                    Show me →
                  </button>
                </motion.div>
              )}

              {/* STEP 2: Search */}
              {step === 1 && (
                <motion.div
                  key="step2"
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -40, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="text-center"
                >
                  <div className="mb-6">
                    {/* Mock search bar */}
                    <div
                      className="max-w-sm mx-auto rounded-2xl px-4 py-3 text-left text-sm font-body"
                      style={{ backgroundColor: 'var(--bg-secondary)', border: '1.5px solid var(--border-medium)' }}
                    >
                      <span style={{ color: 'var(--text-primary)' }}>{typedText}</span>
                      {typedText.length < "Why is the ocean warming faster near the poles?".length && (
                        <span className="cursor-blink" />
                      )}
                    </div>
                    {/* API chips fan out */}
                    <div className="flex justify-center gap-2 mt-3 flex-wrap">
                      {['Wikipedia', 'NASA', 'PubMed', 'NewsAPI', 'World Bank', 'Open Library', 'REST Countries', 'Open-Meteo'].map((api, i) => (
                        <motion.div
                          key={api}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 1.5 + i * 0.06 }}
                          className="px-2 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider"
                          style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-primary)' }}
                        >
                          {api}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <h2 className="font-display text-[28px] mb-4" style={{ color: 'var(--text-primary)' }}>
                    Ask anything. Really.
                  </h2>
                  <p className="font-body text-base leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Type or speak any question — in your language. Luma simultaneously consults Wikipedia, NASA, PubMed, the World Bank, NewsAPI, and more. Then Gemma 4 synthesizes everything into one clear, cited answer.
                  </p>
                  <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
                    Average response time: under 4 seconds.
                  </p>
                  <button
                    onClick={() => setStep(2)}
                    className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02]"
                    style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--text-inverse)' }}
                  >
                    Next →
                  </button>
                </motion.div>
              )}

              {/* STEP 3: Result */}
              {step === 2 && (
                <motion.div
                  key="step3"
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -40, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="text-center"
                >
                  {/* Mock Answer Card */}
                  <div
                    className="max-w-sm mx-auto rounded-xl p-4 mb-6 text-left"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderLeft: '3px solid var(--accent-primary)',
                    }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-primary)' }}>📋 Summary</p>
                    <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                      Ocean warming near the poles is driven by Atlantic circulation shifts and...
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-primary)' }}>● Key Facts</p>
                    <ul className="text-xs space-y-1 mb-3" style={{ color: 'var(--text-secondary)' }}>
                      <li>· Arctic temps rising 3x global avg <span style={{ color: 'var(--accent-primary)' }}>[NASA]</span></li>
                      <li>· Sea level projected +0.5m by 2100 <span style={{ color: 'var(--accent-primary)' }}>[World Bank]</span></li>
                      <li>· 93% of excess heat absorbed by ocean <span style={{ color: 'var(--accent-primary)' }}>[PubMed]</span></li>
                    </ul>
                    <div className="flex gap-2">
                      {['Simple', 'Standard', 'Technical'].map((tab, i) => (
                        <span
                          key={tab}
                          className="px-2 py-1 rounded text-[10px] font-semibold"
                          style={{
                            backgroundColor: i === 1 ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                            color: i === 1 ? 'var(--text-inverse)' : 'var(--text-muted)',
                          }}
                        >
                          {tab}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h2 className="font-display text-[28px] mb-4" style={{ color: 'var(--text-primary)' }}>
                    Answers that actually explain things.
                  </h2>
                  <p className="font-body text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
                    Every answer comes structured: a summary, key facts with sources, and what it actually means for you. Switch reading levels to go from simple to expert-grade in one click.
                  </p>
                  <button
                    onClick={() => setStep(3)}
                    className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02]"
                    style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--text-inverse)' }}
                  >
                    Next →
                  </button>
                </motion.div>
              )}

              {/* STEP 4: Superpowers */}
              {step === 3 && (
                <motion.div
                  key="step4"
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -40, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="text-center"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    {[
                      { icon: <Mic size={20} />, title: 'Voice Search', desc: 'Speak your question in any language' },
                      { icon: <Plane size={20} />, title: 'Works Offline', desc: 'Cached answers travel with you' },
                      { icon: <Share2 size={20} />, title: 'Share Answers', desc: 'Beautiful cards, one tap to share' },
                    ].map((card, i) => (
                      <motion.div
                        key={card.title}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 25 }}
                        className="p-4 rounded-xl text-center"
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <div className="mb-2 flex justify-center" style={{ color: 'var(--accent-primary)' }}>
                          {card.icon}
                        </div>
                        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{card.title}</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{card.desc}</p>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.25, type: 'spring' }}
                    className="p-4 rounded-xl text-center mb-6"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div className="mb-2 flex justify-center" style={{ color: 'var(--accent-primary)' }}>
                      <Keyboard size={20} />
                    </div>
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Power User?</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      Press / anywhere to search instantly. Press ? to see all keyboard shortcuts.
                    </p>
                  </motion.div>

                  <h2 className="font-display text-[28px] mb-4" style={{ color: 'var(--text-primary)' }}>
                    Built for how you actually use it.
                  </h2>
                  <p className="font-body text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
                    Speak, type, go offline, come back. Luma fits around your world — not the other way.
                  </p>
                  <button
                    onClick={() => setStep(4)}
                    className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02]"
                    style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--text-inverse)' }}
                  >
                    Almost there →
                  </button>
                </motion.div>
              )}

              {/* STEP 5: Send-off */}
              {step === 4 && (
                <motion.div
                  key="step5"
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -40, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="text-center relative"
                >
                  {/* Orb explosion */}
                  {showExplosion && (
                    <motion.div
                      initial={{ scale: 1, opacity: 1 }}
                      animate={{ scale: 8, opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full pointer-events-none"
                      style={{
                        background: `radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)`,
                        filter: 'blur(20px)',
                      }}
                    />
                  )}

                  {/* Checkmark */}
                  <div className="mb-6 flex justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{
                        border: '3px solid var(--accent-primary)',
                        backgroundColor: 'var(--bg-secondary)',
                      }}
                    >
                      <Check size={28} style={{ color: 'var(--accent-primary)' }} />
                    </motion.div>
                  </div>

                  <h2 className="font-display text-[32px] mb-4" style={{ color: 'var(--text-primary)' }}>
                    You're ready.
                  </h2>
                  <p className="font-body text-base leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                    The world's knowledge is now one question away.
                    <br /><br />
                    Luma is free. No sign-up. No limits.
                    <br />
                    Built by Mercury for the people who deserve access to information the most.
                  </p>
                  <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
                    Powered by Google Gemma 4 · Built for the Google Gemma 4 Impact Challenge
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={handleStartExploring}
                      className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02]"
                      style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--text-inverse)' }}
                    >
                      Start Exploring →
                    </button>
                    <button
                      onClick={handleRandomPrompt}
                      className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200"
                      style={{
                        backgroundColor: 'transparent',
                        color: 'var(--accent-primary)',
                        border: '1.5px solid var(--accent-primary)',
                      }}
                    >
                      What can I search for?
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
