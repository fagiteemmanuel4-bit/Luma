import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Bookmark, Trash2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Watchlist() {
  const navigate = useNavigate();

  // Mock watchlist data
  const [items, setItems] = useState([
    { id: 1, title: 'Inception', type: 'Movie', year: '2010', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=300&h=450' },
    { id: 2, title: 'Breaking Bad', type: 'TV Show', year: '2008', image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=300&h=450' },
    { id: 3, title: 'Spirited Away', type: 'Anime', year: '2001', image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=300&h=450' },
  ]);

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>My Watchlist — Screenix</title>
      </Helmet>
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-28 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/profile')} className="rounded-full">
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-3xl font-display font-semibold" style={{ color: 'var(--text-primary)' }}>My Watchlist</h1>
          </div>
          <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
            {items.length} Items
          </span>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative rounded-xl overflow-hidden border theme-transition"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
                >
                  <div className="aspect-[2/3] relative">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <Button size="icon" className="rounded-full w-10 h-10 bg-white text-black hover:bg-white/90">
                        <Play size={20} fill="currentColor" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="rounded-full w-10 h-10"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={20} />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--accent-primary)' }}>{item.type}</span>
                      <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{item.year}</span>
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
              <Bookmark size={32} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-display mb-2" style={{ color: 'var(--text-primary)' }}>Your watchlist is empty</h2>
            <p className="text-sm max-w-xs mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
              Nothing saved yet. Browse our collection and hit the heart icon to save titles for later.
            </p>
            <Button asChild style={{ backgroundColor: 'var(--accent-primary)' }}>
              <Link to="/">Explore Content</Link>
            </Button>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
