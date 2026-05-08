import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, BookOpen, Clock, Tag, ChevronRight, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLibrary } from '@/hooks/useLibrary';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Library() {
  const { items, removeItem } = useLibrary();

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <header className="mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-primary)' }}>
              <Bookmark size={24} />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Research Library
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="font-body text-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            Your saved knowledge, accessible anytime — even offline.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {items.length > 0 ? (
              items.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative rounded-2xl p-6 transition-all duration-300"
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
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                          <Clock size={12} />
                          {formatDate(item.timestamp)}
                        </div>
                        {item.topics && item.topics.length > 0 && (
                          <div className="flex gap-1">
                            {item.topics.map(topic => (
                              <span key={topic} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                                style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-primary)' }}>
                                <Tag size={8} />
                                {topic}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl mb-2 line-clamp-1 group-hover:text-accent-primary transition-colors" style={{ color: 'var(--text-primary)' }}>
                        {item.query}
                      </h3>
                      <p className="font-body text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                        {item.synthesis.replace(/##.*\n/g, '').slice(0, 180)}...
                      </p>
                    </div>

                    <div className="flex items-center gap-2 sm:self-center">
                      <Link
                        to={`/search?q=${encodeURIComponent(item.query)}${item.topics?.length ? `&topics=${item.topics.join(',')}` : ''}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                        style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--text-inverse)' }}
                      >
                        View Research
                        <ChevronRight size={16} />
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2.5 rounded-xl transition-all hover:bg-red-500/10 hover:text-red-500"
                        style={{ color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}
                        title="Remove from library"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 rounded-3xl"
                style={{ backgroundColor: 'var(--bg-card)', border: '2px dashed var(--border-subtle)' }}
              >
                <div className="flex justify-center mb-4" style={{ color: 'var(--text-muted)' }}>
                  <BookOpen size={48} opacity={0.3} />
                </div>
                <h3 className="font-display text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>
                  Your library is empty.
                </h3>
                <p className="font-body text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
                  Save research results to access them anytime.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--text-inverse)' }}
                >
                  Start Searching
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
