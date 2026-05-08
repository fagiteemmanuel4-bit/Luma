import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Check, X, Star, Crown, Zap, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCurrency } from '@/context/CurrencyContext';

export default function Pricing() {
  const { currency, isLoading } = useCurrency();

  const features = [
    { label: 'Unlimited movies & TV shows', included: true },
    { label: 'HD streaming (1080p)', included: true },
    { label: 'Anime, K-Drama & Nollywood', included: true },
    { label: 'No credit card required', included: true },
    { label: 'Watch on any device', included: true },
    { label: 'Create watchlist & history', included: true },
    { label: 'Offline Downloads', included: false, comingSoon: true },
    { label: '4K Ultra HD', included: false, comingSoon: true },
    { label: 'Multiple profiles', included: false, comingSoon: true },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>Pricing — Screenix</title>
      </Helmet>
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pt-32 pb-24">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-primary)' }}
          >
            <Star size={14} fill="currentColor" />
            Simple Pricing
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-display font-semibold mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Stream everything for free.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg max-w-2xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            No hidden fees, no subscriptions. Screenix is built to be accessible to everyone, everywhere.
          </motion.p>
        </div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative w-full max-w-md"
          >
            {/* Glow background */}
            <div className="absolute -inset-1 rounded-[2.5rem] blur opacity-30" style={{ backgroundColor: 'var(--accent-primary)' }} />

            <div
              className="relative p-8 sm:p-10 rounded-[2rem] border-2 theme-transition"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--accent-primary)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-display font-bold uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>Screenix Free</h2>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Unlimited access, zero cost.</p>
                </div>
                <div className="p-3 rounded-2xl" style={{ backgroundColor: 'var(--accent-soft)' }}>
                  <ShieldCheck size={28} style={{ color: 'var(--accent-primary)' }} />
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                  {isLoading ? '...' : currency.symbol}0
                </span>
                <span className="text-lg font-medium" style={{ color: 'var(--text-muted)' }}>/ month</span>
              </div>

              <div className="space-y-4 mb-10">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-1 shrink-0 p-0.5 rounded-full ${feature.included ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500 opacity-40'}`}>
                      {feature.included ? <Check size={14} /> : <X size={14} />}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${!feature.included && 'opacity-40'}`} style={{ color: feature.included ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                        {feature.label}
                      </span>
                      {feature.comingSoon && (
                        <span className="text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-secondary" style={{ color: 'var(--text-muted)' }}>
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                asChild
                className="w-full h-14 text-lg font-bold transition-all duration-300 hover:scale-[1.02]"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                <Link to="/signup">Get Started Free</Link>
              </Button>

              <p className="text-center text-[10px] uppercase font-bold tracking-widest mt-6 opacity-60" style={{ color: 'var(--text-muted)' }}>
                *Screenix is currently free for all users.
              </p>
            </div>
          </motion.div>
        </div>

        {/* FAQ Preview */}
        <div className="mt-24 text-center">
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Have more questions?</p>
          <Link to="/help" className="inline-flex items-center gap-2 font-semibold hover:underline" style={{ color: 'var(--accent-primary)' }}>
            Visit our Help Center
            <X className="rotate-45" size={16} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
