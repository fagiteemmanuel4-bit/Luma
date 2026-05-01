import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Home } from 'lucide-react';
import FloatingOrb from '@/components/FloatingOrb';

const FACTS = [
  "The observable universe contains approximately 2 trillion galaxies.",
  "A teaspoon of neutron star material weighs about 6 billion tons.",
  "Light takes 8 minutes and 20 seconds to travel from the Sun to Earth.",
  "Venus is the only planet that rotates clockwise.",
  "Jupiter's Great Red Spot is a storm that has lasted over 400 years.",
  "The Milky Way galaxy is about 100,000 light-years in diameter.",
  "There are more trees on Earth than stars in the Milky Way.",
  "Saturn's density is so low it could theoretically float in water.",
  "A day on Mercury lasts approximately 59 Earth days.",
  "The footprints on the Moon will last for millions of years.",
];

export default function NotFound() {
  const [fact, setFact] = useState(FACTS[0]);
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex(prev => {
        const next = (prev + 1) % FACTS.length;
        setFact(FACTS[next]);
        return next;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <FloatingOrb />

      <main className="flex-1 flex flex-col items-center justify-center relative px-4" style={{ zIndex: 1 }}>
        {/* Animated Broken Orb */}
        <div className="relative w-48 h-48 mb-8">
          {/* Main orb that fragments */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)`,
              filter: 'blur(40px)',
            }}
            animate={{
              scale: [1, 1.1, 0.9, 1],
              opacity: [0.6, 0.8, 0.4, 0.6],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Fragment pieces */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <motion.div
              key={angle}
              className="absolute w-8 h-8 rounded-sm"
              style={{
                backgroundColor: 'var(--accent-primary)',
                top: '50%',
                left: '50%',
                marginTop: -16,
                marginLeft: -16,
              }}
              animate={{
                x: [0, Math.cos((angle * Math.PI) / 180) * 60],
                y: [0, Math.sin((angle * Math.PI) / 180) * 60],
                opacity: [0.8, 0.3, 0.8],
                rotate: [0, 180, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-6xl sm:text-7xl mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          404
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-body text-lg mb-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          This page doesn't exist in our universe.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm mb-8"
          style={{ color: 'var(--text-muted)' }}
        >
          But the rest of the universe is just a question away.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link
            to="/"
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'var(--text-inverse)',
            }}
          >
            <Search size={16} /> Search Anything →
          </Link>
          <Link
            to="/"
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--accent-primary)',
              border: '1.5px solid var(--accent-primary)',
            }}
          >
            <Home size={16} /> Go Home
          </Link>
        </motion.div>

        {/* Random Fact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 max-w-md rounded-xl p-4"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1.5px solid var(--accent-primary)',
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--accent-primary)' }}>
            Did you know?
          </p>
          <motion.p
            key={factIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-sm font-body"
            style={{ color: 'var(--text-secondary)' }}
          >
            {fact}
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
}
