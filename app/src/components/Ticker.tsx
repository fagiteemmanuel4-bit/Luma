import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function useQueryCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    // Simulate live counter with localStorage
    const stored = parseInt(localStorage.getItem('luma_query_count') || '0');
    setCount(stored);
    const interval = setInterval(() => {
      const current = parseInt(localStorage.getItem('luma_query_count') || '0');
      setCount(current);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return count;
}

export default function Ticker() {
  const queryCount = useQueryCount();

  const items = [
    `9 Open APIs Connected`,
    `${queryCount.toLocaleString()} Questions Answered`,
    `0 Accounts Required`,
    `Built on Google Gemma 4`,
    `Knowledge For Everyone`,
    `Open Source`,
    `Made in Nigeria 🇳🇬`,
  ];

  const content = items.map((item, i) => (
    <span key={i} className="flex items-center gap-3 px-4">
      <span className="font-body text-sm font-medium" style={{ color: 'var(--text-inverse)' }}>
        {item}
      </span>
      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--accent-soft)' }} />
    </span>
  ));

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      className="w-full overflow-hidden"
      style={{ backgroundColor: 'var(--accent-primary)', height: 48 }}
    >
      <div className="ticker-content h-full items-center">
        {content}
        {content}
        {content}
        {content}
      </div>
    </motion.div>
  );
}
