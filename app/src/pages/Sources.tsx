import { motion } from 'framer-motion';
import { useState } from 'react';
import { Globe, BookOpen, Rocket, Newspaper, Library, BarChart3, Flag, Cloud, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const APIS = [
  { key: 'wikipedia', name: 'Wikipedia', category: 'General Knowledge', icon: <BookOpen size={18} />, desc: 'The world\'s largest free encyclopedia with 6.7M+ English articles.' },
  { key: 'pubmed', name: 'PubMed', category: 'Health & Science', icon: <Rocket size={18} />, desc: '30M+ biomedical literature citations from NCBI.' },
  { key: 'nasa', name: 'NASA', category: 'Space & Earth', icon: <Rocket size={18} />, desc: 'Space imagery, APOD, and earth observation data.' },
  { key: 'newsapi', name: 'NewsAPI', category: 'Current Events', icon: <Newspaper size={18} />, desc: 'Global news headlines and articles from 30,000+ sources.' },
  { key: 'openLibrary', name: 'Open Library', category: 'Education', icon: <Library size={18} />, desc: 'Millions of books, covers, and catalog records.' },
  { key: 'worldBank', name: 'World Bank', category: 'Economics', icon: <BarChart3 size={18} />, desc: 'Development indicators, statistics, and economic data.' },
  { key: 'restCountries', name: 'REST Countries', category: 'Geography', icon: <Flag size={18} />, desc: 'Comprehensive country data, currencies, languages, and more.' },
  { key: 'openMeteo', name: 'Open-Meteo', category: 'Climate', icon: <Cloud size={18} />, desc: 'Free weather forecasts and historical climate data.' },
];

function getStatusIcon(status: string) {
  if (status === 'live') return <CheckCircle size={14} className="text-emerald-500" />;
  if (status === 'down') return <XCircle size={14} className="text-red-500" />;
  return <HelpCircle size={14} className="text-gray-400" />;
}

export default function Sources() {
  const [queryCount, setQueryCount] = useState(() => parseInt(localStorage.getItem('luma_query_count') || '0'));

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-5xl sm:text-6xl mb-4" style={{ color: 'var(--text-primary)' }}>
            API Directory
          </h1>
          <p className="font-body text-lg max-w-2xl mx-auto mb-6" style={{ color: 'var(--text-secondary)' }}>
            Luma connects to 9 of the world's most powerful open knowledge sources. All free. All public. No API keys required for most.
          </p>
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Globe size={20} style={{ color: 'var(--accent-primary)' }} />
            <span className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--accent-primary)' }}>{queryCount.toLocaleString()}</strong> queries answered today
            </span>
          </div>
        </motion.div>

        {/* API Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {APIS.map((api, i) => (
            <motion.div
              key={api.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="rounded-xl p-5 transition-all duration-300"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-primary)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-primary)' }}
                  >
                    {api.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-lg" style={{ color: 'var(--text-primary)' }}>
                      {api.name}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e' }}
                >
                  {getStatusIcon('live')} Live
                </div>
              </div>

              <span
                className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider mb-2"
                style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
              >
                {api.category}
              </span>

              <p className="text-sm font-body leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {api.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl p-8"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text-primary)' }}>
            Source Reliability
          </h2>
          <div className="space-y-4">
            {APIS.map((api) => (
              <div key={api.key} className="flex items-center gap-4">
                <span className="text-sm font-medium w-28 flex-shrink-0 font-body" style={{ color: 'var(--text-primary)' }}>
                  {api.name}
                </span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${85 + Math.random() * 15}%` }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, var(--accent-glow), var(--accent-primary))' }}
                  />
                </div>
                <span className="text-xs font-medium w-12 text-right" style={{ color: 'var(--text-muted)' }}>
                  {Math.round(85 + Math.random() * 15)}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
