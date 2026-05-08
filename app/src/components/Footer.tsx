import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Footer() {
  const links = [
    { label: 'Pricing', path: '/pricing' },
    { label: 'Privacy', path: '/privacy' },
    { label: 'Terms', path: '/terms' },
    { label: 'DMCA', path: '/dmca' },
    { label: 'Cookies', path: '/cookies' },
    { label: 'Contact', path: '/contact' },
    { label: 'Help', path: '/help' },
  ];

  return (
    <footer
      className="w-full py-12"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="font-display text-xl uppercase font-bold" style={{ color: 'var(--accent-primary)' }}>Screenix</span>
            <span className="text-xs font-body" style={{ color: 'var(--text-muted)' }}>— Premium Streaming Platform</span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-body transition-colors duration-200"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--accent-primary)'; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'var(--text-muted)'; }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Branding */}
          <div className="text-xs font-body" style={{ color: 'var(--text-muted)' }}>
            Built by <span style={{ color: 'var(--accent-primary)' }}>Mercury</span> · Nigeria 🇳🇬
          </div>
        </div>
      </div>
    </footer>
  );
}
