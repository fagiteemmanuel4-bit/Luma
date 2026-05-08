import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, History as HistoryIcon, Trash2, Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function History() {
  const navigate = useNavigate();

  // Mock history data
  const [items, setItems] = useState([
    { id: 1, title: 'The Dark Knight', type: 'Movie', progress: 85, lastWatched: '2 hours ago', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=300&h=170' },
    { id: 2, title: 'Attack on Titan', type: 'Anime', progress: 40, lastWatched: 'Yesterday', image: 'https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=300&h=170' },
    { id: 3, title: 'Stranger Things', type: 'TV Show', progress: 10, lastWatched: '3 days ago', image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=300&h=170' },
  ]);

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear your entire watch history?')) {
      setItems([]);
    }
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>Watch History — Screenix</title>
      </Helmet>
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-28 pb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/profile')} className="rounded-full">
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-3xl font-display font-semibold" style={{ color: 'var(--text-primary)' }}>Watch History</h1>
          </div>
          {items.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearHistory} className="text-red-500 hover:text-red-600 hover:bg-red-500/5">
              <Trash2 size={16} className="mr-2" />
              Clear All History
            </Button>
          )}
        </div>

        {items.length > 0 ? (
          <div className="space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="group flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border theme-transition"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
                >
                  <div className="relative w-full sm:w-60 aspect-video rounded-lg overflow-hidden shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button size="icon" className="rounded-full w-10 h-10 bg-white text-black hover:bg-white/90">
                        <Play size={20} fill="currentColor" />
                      </Button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                      <div className="h-full bg-accent-primary" style={{ width: `${item.progress}%`, backgroundColor: 'var(--accent-primary)' }} />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent-primary)' }}>{item.type}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-500"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <Clock size={14} />
                        Last watched {item.lastWatched}
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-0">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                        <span>Progress: {item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className="h-1" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 px-4 rounded-3xl border border-dashed theme-transition"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-medium)' }}
          >
            <div className="w-20 h-20 rounded-full bg-card mx-auto flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--bg-card)' }}>
              <HistoryIcon size={32} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-display mb-2" style={{ color: 'var(--text-primary)' }}>No watch history</h2>
            <p className="text-sm max-w-xs mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
              You haven't watched anything yet. Start exploring our library to build your history!
            </p>
            <Button asChild style={{ backgroundColor: 'var(--accent-primary)' }}>
              <Link to="/">Start Watching</Link>
            </Button>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
