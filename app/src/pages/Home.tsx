import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import FloatingOrb from '@/components/FloatingOrb';
import SearchBar from '@/components/SearchBar';
import Ticker from '@/components/Ticker';
import Footer from '@/components/Footer';
import WelcomeGuide from '@/components/WelcomeGuide';

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasOnboarded = localStorage.getItem('luma_onboarded');
    if (!hasOnboarded) {
      const timer = setTimeout(() => setShowWelcome(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative grain-overlay" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <FloatingOrb />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative px-4 pt-32 pb-16" style={{ zIndex: 1 }}>
        {/* Wordmark */}
        <motion.h1
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-center mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Luma
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-body text-lg sm:text-xl md:text-2xl text-center mb-10 max-w-xl"
          style={{ color: 'var(--text-secondary)' }}
        >
          Every question deserves a real answer.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="w-full max-w-2xl"
        >
          <SearchBar autoFocus />
        </motion.div>

        {/* Discover for Good */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 w-full max-w-4xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-subtle)' }} />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
              Discover for Good
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-subtle)' }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: 'Climate Action', topic: 'climate', desc: 'Real-time carbon and weather data' },
              { title: 'Health Equity', topic: 'health', desc: 'Latest biomedical research' },
              { title: 'World Progress', topic: 'world', desc: 'Economic and social indicators' }
            ].map((item) => (
              <Link
                key={item.topic}
                to={`/search?q=${item.title}&topics=${item.topic}`}
                className="p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
              >
                <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Chat Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10"
        >
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'var(--text-inverse)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <MessageSquare size={18} />
            Try Chat Mode
          </Link>
        </motion.div>
      </main>

      {/* Ticker */}
      <Ticker />

      {/* Footer */}
      <Footer />

      {/* Welcome Guide */}
      <WelcomeGuide open={showWelcome} onClose={() => setShowWelcome(false)} />
    </div>
  );
}
