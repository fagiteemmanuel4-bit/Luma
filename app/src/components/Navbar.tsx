import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Settings, Search, Menu, X, MessageSquare } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import SettingsPanel from './SettingsPanel';

export default function Navbar() {
  const { isDark, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'About', path: '/about' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Sources', path: '/sources' },
    { label: 'Contact', path: '/contact' },
  ];

  const isHome = location.pathname === '/';

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 theme-transition"
        style={{
          backgroundColor: scrolled ? 'var(--bg-glass)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
          boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <span
                className="font-display text-2xl tracking-tight"
                style={{ color: 'var(--accent-primary)' }}
              >
                Luma
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-3 py-1.5 rounded-lg text-sm font-body font-medium transition-all duration-200"
                  style={{
                    color: location.pathname === link.path ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.color = 'var(--accent-primary)';
                    (e.target as HTMLElement).style.backgroundColor = 'var(--bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.color = location.pathname === link.path ? 'var(--accent-primary)' : 'var(--text-secondary)';
                    (e.target as HTMLElement).style.backgroundColor = 'transparent';
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {!isHome && (
                <>
                  <Link
                    to="/chat"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = 'var(--accent-primary)';
                      (e.target as HTMLElement).style.backgroundColor = 'var(--bg-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = 'var(--text-secondary)';
                      (e.target as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                  >
                    <MessageSquare size={16} />
                    Chat
                  </Link>
                  <Link
                    to="/"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = 'var(--accent-primary)';
                      (e.target as HTMLElement).style.backgroundColor = 'var(--bg-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = 'var(--text-secondary)';
                      (e.target as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                  >
                    <Search size={16} />
                    Search
                  </Link>
                </>
              )}

              {/* Theme Toggle */}
              <button
                onClick={toggle}
                className="p-2 rounded-lg transition-all duration-300"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = 'var(--bg-secondary)';
                  (e.target as HTMLElement).style.color = 'var(--accent-primary)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = 'transparent';
                  (e.target as HTMLElement).style.color = 'var(--text-secondary)';
                }}
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={isDark ? 'dark' : 'light'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                  </motion.div>
                </AnimatePresence>
              </button>

              {/* Settings */}
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg transition-all duration-200"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = 'var(--bg-secondary)';
                  (e.target as HTMLElement).style.color = 'var(--accent-primary)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = 'transparent';
                  (e.target as HTMLElement).style.color = 'var(--text-secondary)';
                }}
                aria-label="Settings"
              >
                <Settings size={18} />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg"
                style={{ color: 'var(--text-secondary)' }}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
              style={{ backgroundColor: 'var(--bg-glass)', backdropFilter: 'blur(20px)' }}
            >
              <div className="px-4 py-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium"
                    style={{
                      color: location.pathname === link.path ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      backgroundColor: location.pathname === link.path ? 'var(--bg-secondary)' : 'transparent',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
                {!isHome && (
                  <Link
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    Search
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <SettingsPanel open={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}
