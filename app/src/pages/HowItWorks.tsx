import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, Brain, Network, ListFilter, FileText, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const FLOW_STEPS = [
  {
    icon: <Search size={20} />,
    label: 'User Query',
    desc: 'You type or speak your question in any language.',
    color: 'var(--accent-primary)',
  },
  {
    icon: <Brain size={20} />,
    label: 'Gemma 4 Intent Parse',
    desc: 'Gemma 4 analyzes your question to understand intent and domain.',
    color: 'var(--accent-glow)',
  },
  {
    icon: <Network size={20} />,
    label: 'Parallel API Fan-out',
    desc: 'Your query is sent simultaneously to up to 9 open knowledge APIs.',
    color: 'var(--accent-primary)',
  },
  {
    icon: <ListFilter size={20} />,
    label: 'Re-rank & Filter',
    desc: 'Results are scored by relevance and filtered for quality.',
    color: 'var(--accent-glow)',
  },
  {
    icon: <FileText size={20} />,
    label: 'Synthesis & Answer',
    desc: 'Gemma 4 synthesizes everything into a structured, cited response.',
    color: 'var(--accent-primary)',
  },
];

const TECH_STACK = [
  { name: 'Google Gemma 4', category: 'AI Model', desc: 'Open weights, 27B parameter model for synthesis' },
  { name: 'Firebase', category: 'Hosting & Data', desc: 'Hosting and anonymous query counters' },
  { name: 'Wikipedia API', category: 'Knowledge', desc: 'World\'s largest free encyclopedia' },
  { name: 'PubMed / NCBI', category: 'Science', desc: '30M+ biomedical literature records' },
  { name: 'NASA Open APIs', category: 'Space', desc: 'Space imagery, earth data, and more' },
  { name: 'NewsAPI', category: 'News', desc: 'Global news headlines and articles' },
  { name: 'World Bank', category: 'Economics', desc: 'Development indicators and statistics' },
  { name: 'Open Library', category: 'Books', desc: 'Millions of books and catalog data' },
  { name: 'REST Countries', category: 'Geography', desc: 'Country data and demographics' },
  { name: 'Open-Meteo', category: 'Climate', desc: 'Free weather and climate forecasts' },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-5xl sm:text-6xl mb-4" style={{ color: 'var(--text-primary)' }}>
            How It Works
          </h1>
          <p className="font-body text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            From your question to a synthesized answer in under 4 seconds. Here's what happens behind the scenes.
          </p>
        </motion.div>

        {/* Flow Diagram */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-20"
        >
          <div
            className="rounded-2xl p-8 sm:p-12"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <h2 className="font-display text-2xl mb-8 text-center" style={{ color: 'var(--text-primary)' }}>
              The Luma Pipeline
            </h2>

            {/* Flow Steps */}
            <div className="relative">
              {FLOW_STEPS.map((step, i) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.15 }}
                  className="flex items-start gap-4 mb-6 relative cursor-pointer"
                  onClick={() => setActiveStep(i)}
                >
                  {/* Connector line */}
                  {i < FLOW_STEPS.length - 1 && (
                    <div
                      className="absolute left-5 top-12 w-px h-8"
                      style={{ backgroundColor: 'var(--border-medium)' }}
                    />
                  )}

                  {/* Icon */}
                  <motion.div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      backgroundColor: activeStep === i ? step.color : 'var(--bg-secondary)',
                      color: activeStep === i ? 'var(--text-inverse)' : 'var(--text-muted)',
                      border: `2px solid ${activeStep === i ? step.color : 'var(--border-subtle)'}`,
                    }}
                    animate={{ scale: activeStep === i ? 1.1 : 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {step.icon}
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display text-lg" style={{ color: 'var(--text-primary)' }}>
                        {step.label}
                      </span>
                      {i < FLOW_STEPS.length - 1 && (
                        <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                      )}
                    </div>
                    <motion.p
                      className="text-sm font-body"
                      style={{ color: 'var(--text-secondary)' }}
                      animate={{ height: activeStep === i ? 'auto' : '1.5rem', overflow: 'hidden' }}
                    >
                      {step.desc}
                    </motion.p>
                    {activeStep === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 p-3 rounded-lg text-xs font-body"
                        style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
                      >
                        Step {i + 1} of {FLOW_STEPS.length} — {i === 0 ? 'No preprocessing needed.' : i === 1 ? 'Intent classification runs locally before API calls.' : i === 2 ? 'Promise.allSettled ensures one failure does not break the result.' : i === 3 ? 'Confidence scoring based on text overlap with query.' : 'Streaming response if supported by the API.'}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Tech Stack Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="font-display text-3xl mb-8 text-center" style={{ color: 'var(--text-primary)' }}>
            Our Stack
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TECH_STACK.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="rounded-xl p-5 transition-all duration-300"
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
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md mb-2 inline-block"
                  style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-primary)' }}
                >
                  {tech.category}
                </span>
                <h3 className="font-display text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
                  {tech.name}
                </h3>
                <p className="text-sm font-body" style={{ color: 'var(--text-secondary)' }}>
                  {tech.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Demo Answer Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="font-display text-3xl mb-8 text-center" style={{ color: 'var(--text-primary)' }}>
            Sample Result
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Answer Card */}
            <div className="lg:col-span-2">
              <div
                className="rounded-xl p-6"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderLeft: '3px solid var(--accent-primary)',
                }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-primary)' }}>📋 Summary</p>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  The immune system deploys a two-stage defense against viruses — an immediate innate response followed by a slower but precise adaptive response that creates long-term memory.
                </p>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-primary)' }}>● Key Facts</p>
                <ul className="space-y-1 mb-4">
                  <li className="text-xs" style={{ color: 'var(--text-secondary)' }}>· Innate immunity responds within minutes using macrophages and natural killer cells <span style={{ color: 'var(--accent-primary)' }}>[Wikipedia]</span></li>
                  <li className="text-xs" style={{ color: 'var(--text-secondary)' }}>· T-cells and B-cells form the adaptive response, taking 4-7 days to fully activate <span style={{ color: 'var(--accent-primary)' }}>[PubMed]</span></li>
                  <li className="text-xs" style={{ color: 'var(--text-secondary)' }}>· Memory B-cells can persist for decades, providing lasting protection <span style={{ color: 'var(--accent-primary)' }}>[PubMed]</span></li>
                  <li className="text-xs" style={{ color: 'var(--text-secondary)' }}>· Viruses that mutate rapidly (like influenza) can partially evade immune memory <span style={{ color: 'var(--accent-primary)' }}>[NewsAPI]</span></li>
                </ul>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-primary)' }}>💡 What This Means</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  This is why vaccines work — they train your immune memory safely, without the disease.
                </p>
                <div className="flex gap-2 mt-4">
                  {['Simple', 'Standard', 'Technical'].map((tab) => (
                    <span
                      key={tab}
                      className="px-2 py-1 rounded text-[10px] font-semibold"
                      style={{
                        backgroundColor: tab === 'Standard' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                        color: tab === 'Standard' ? 'var(--text-inverse)' : 'var(--text-muted)',
                      }}
                    >
                      {tab}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Source Cards */}
            <div className="lg:col-span-3 space-y-3">
              {[
                { name: 'Wikipedia', time: '142ms', confidence: 94 },
                { name: 'PubMed', time: '310ms', confidence: 98 },
                { name: 'NewsAPI', time: '205ms', confidence: 71 },
                { name: 'NASA', time: '445ms', confidence: 42 },
              ].map((source, i) => (
                <motion.div
                  key={source.name}
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="rounded-xl p-4"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider"
                      style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-primary)' }}
                    >
                      {source.name}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{source.time}</span>
                  </div>
                  <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                    {source.name === 'Wikipedia' && 'Comprehensive article on adaptive immune response mechanisms.'}
                    {source.name === 'PubMed' && 'Peer-reviewed research on T-cell activation timelines and memory B-cell persistence.'}
                    {source.name === 'NewsAPI' && 'Recent news coverage of influenza vaccine effectiveness studies.'}
                    {source.name === 'NASA' && 'Low relevance — no direct space-related data for this query.'}
                  </p>
                  <div>
                    <div className="flex justify-between text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>
                      <span>Relevance</span>
                      <span>{source.confidence}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${source.confidence}%` }}
                        transition={{ duration: 0.6, delay: 0.8 + i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, var(--accent-glow), var(--accent-primary))' }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
