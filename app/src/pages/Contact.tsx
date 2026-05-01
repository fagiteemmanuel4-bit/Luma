import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Github, Linkedin, Twitter, CheckCircle, Mail, MapPin, Clock, Award } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', reason: 'General Feedback', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    
    const subject = `[${formData.reason}] Message from ${formData.name}`;
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\nReason: ${formData.reason}\n\nMessage:\n${formData.message}`;
    
    const mailtoUrl = `mailto:hello@mercury.dev?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    const win = window.open(mailtoUrl, '_blank');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      // mailto failed, copy email
      navigator.clipboard.writeText('hello@mercury.dev').catch(() => {});
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 3000);
    }
  };

  const reasons = [
    'General Feedback',
    'Bug Report',
    'Partnership / Collaboration',
    'Press Inquiry',
    'Hackathon Related',
    'Other',
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-5xl sm:text-6xl mb-4" style={{ color: 'var(--text-primary)' }}>
            Get in Touch
          </h1>
          <p className="font-body text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Whether it's a bug, a partnership, or just to say you loved it — we're listening.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {submitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-2xl p-8 text-center"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <CheckCircle size={48} className="mx-auto mb-4 text-emerald-500" />
                <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>
                  Message Sent!
                </h2>
                <p className="text-sm font-body" style={{ color: 'var(--text-secondary)' }}>
                  {copiedEmail 
                    ? "We copied our email to your clipboard — paste and send!" 
                    : "We opened your email client. If that didn't work, email us at hello@mercury.dev"}
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl p-6 sm:p-8"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all text-sm font-body"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--accent-primary)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--border-subtle)'; }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all text-sm font-body"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--accent-primary)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--border-subtle)'; }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                      Reason
                    </label>
                    <select
                      value={formData.reason}
                      onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all text-sm font-body appearance-none cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      {reasons.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all text-sm font-body resize-none"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--accent-primary)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--border-subtle)'; }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: 'var(--text-inverse)',
                    }}
                  >
                    Send Message <Send size={14} />
                  </button>
                </div>
              </form>
            )}
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Built by Mercury */}
            <div
              className="rounded-xl p-6"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-display text-lg"
                  style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-primary)' }}
                >
                  M
                </div>
                <div>
                  <h3 className="font-display text-lg" style={{ color: 'var(--text-primary)' }}>Built by Mercury</h3>
                </div>
              </div>
              <p className="text-sm font-body mb-3" style={{ color: 'var(--text-secondary)' }}>
                An AI/ML company building tools for communities that need them most.
              </p>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <MapPin size={12} /> Nigeria 🇳🇬 · Founded 2024
              </div>
            </div>

            {/* Hackathon Context */}
            <div
              className="rounded-xl p-6"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Award size={18} style={{ color: 'var(--accent-primary)' }} />
                <h3 className="font-display text-lg" style={{ color: 'var(--text-primary)' }}>Hackathon Context</h3>
              </div>
              <p className="text-sm font-body" style={{ color: 'var(--text-secondary)' }}>
                Luma was built for the Google Gemma 4 Impact Challenge — a global hackathon to build AI tools that create meaningful, positive change.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs px-2 py-1 rounded-md font-semibold" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                  Google
                </span>
                <span className="text-xs px-2 py-1 rounded-md font-semibold" style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-primary)' }}>
                  Gemma 4
                </span>
              </div>
            </div>

            {/* Response Time */}
            <div
              className="rounded-xl p-6"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Clock size={18} style={{ color: 'var(--accent-primary)' }} />
                <h3 className="font-display text-lg" style={{ color: 'var(--text-primary)' }}>Response Time</h3>
              </div>
              <p className="text-sm font-body mb-4" style={{ color: 'var(--text-secondary)' }}>
                We typically respond within 48 hours.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)' }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--accent-primary)'; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'var(--text-muted)'; }}
                >
                  <Github size={18} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)' }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--accent-primary)'; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'var(--text-muted)'; }}
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)' }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--accent-primary)'; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'var(--text-muted)'; }}
                >
                  <Twitter size={18} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
