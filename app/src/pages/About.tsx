import { motion } from 'framer-motion';
import { Globe, Zap, Shield, Heart, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function KnowledgeGapMap() {
  // Use useState initializer to ensure this only runs once per component mount
  const [dots] = useState(() => Array.from({ length: 60 }).map((_, i) => ({
    id: i,
    x: 50 + Math.random() * 700,
    y: 50 + Math.random() * 300,
    hasGap: Math.random() > 0.6
  })));

  return (
    <svg viewBox="0 0 800 400" className="w-full h-auto">
      {/* World map dots - simplified */}
      {dots.map((dot) => (
        <motion.circle
          key={dot.id}
          cx={dot.x}
          cy={dot.y}
          r={dot.hasGap ? 4 : 3}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: dot.id * 0.02 }}
          fill={dot.hasGap ? 'var(--accent-primary)' : 'var(--text-muted)'}
          opacity={dot.hasGap ? 0.8 : 0.3}
        />
      ))}
      {/* Labels */}
      <text x="400" y="380" textAnchor="middle" fontSize="12" fill="var(--text-muted)" fontFamily="Geist, sans-serif">
        Luma Sight bridges knowledge gaps worldwide
      </text>
    </svg>
  );
}

export default function About() {
  const values = [
    {
      icon: <Globe size={24} />,
      title: 'Universal Access',
      desc: 'Knowledge should not be locked behind paywalls. Luma Sight connects to 9+ open APIs — all free, all public.',
    },
    {
      icon: <Zap size={24} />,
      title: 'Powered by Gemma 3',
      desc: "Google's most capable open model identifies visual context and synthesizes information from multiple sources into one coherent answer.",
    },
    {
      icon: <Shield size={24} />,
      title: 'Privacy First',
      desc: 'No accounts. No tracking. No cookies. Your curiosity is yours alone — we never store your queries.',
    },
    {
      icon: <Heart size={24} />,
      title: 'Gemma for Good',
      desc: 'Built for the Google Gemma 3 Impact Challenge to empower communities with life-critical data and SDG mapping.',
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
             <Sparkles className="text-accent-primary" size={24} />
             <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent-primary">Gemma for Good Impact Entry</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl mb-4" style={{ color: 'var(--text-primary)' }}>
            About Luma <span className="text-accent-primary">Sight</span>
          </h1>
          <p className="font-body text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            We believe every person on Earth deserves access to the world's knowledge — no subscriptions, no gatekeepers, no compromises.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div
            className="rounded-2xl p-8 sm:p-12"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <h2 className="font-display text-3xl mb-4" style={{ color: 'var(--text-primary)' }}>
              Our Mission
            </h2>
            <p className="font-body text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              Luma Sight was born from a simple frustration: the world's most valuable knowledge is scattered across dozens of platforms, each with its own interface, login wall, and search logic. Students in Lagos researching climate change should have the same access as researchers in London.
            </p>
            <p className="font-body text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              We built Luma Sight to solve this. One multimodal search bar. Nine open knowledge sources. One synthesized answer. No accounts. No tracking. Just answers.
            </p>
          </div>
        </motion.section>

        {/* Values Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="font-display text-3xl mb-8 text-center" style={{ color: 'var(--text-primary)' }}>
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="rounded-xl p-6 transition-all duration-300"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-primary)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <div className="mb-3" style={{ color: 'var(--accent-primary)' }}>
                  {value.icon}
                </div>
                <h3 className="font-display text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
                  {value.title}
                </h3>
                <p className="text-sm font-body leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="font-display text-3xl mb-8 text-center" style={{ color: 'var(--text-primary)' }}>
            Built by Mercury
          </h2>
          <div
            className="rounded-2xl p-8 sm:p-12 text-center"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-display"
              style={{
                backgroundColor: 'var(--accent-soft)',
                color: 'var(--accent-primary)',
              }}
            >
              M
            </div>
            <h3 className="font-display text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>
              Mercury
            </h3>
            <p className="text-sm font-body mb-1" style={{ color: 'var(--text-secondary)' }}>
              An AI/ML company building tools for communities that need them most.
            </p>
            <p className="text-xs font-body" style={{ color: 'var(--text-muted)' }}>
              Nigeria 🇳🇬 · Founded 2024
            </p>
          </div>
        </motion.section>

        {/* Knowledge Gap Visualization */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="font-display text-3xl mb-8 text-center" style={{ color: 'var(--text-primary)' }}>
            The Knowledge Gap
          </h2>
          <div
            className="rounded-2xl p-8 overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <KnowledgeGapMap />
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
