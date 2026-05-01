import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Terms() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const [showShortVersion, setShowShortVersion] = useState(false);

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By using Luma, you agree to these Terms of Service. If you do not agree, please do not use Luma. These terms apply to all visitors and users of the service.',
    },
    {
      title: '2. What Luma Is (and Isn\'t)',
      content: 'Luma is a research and knowledge aggregation tool powered by AI. It is designed to help you explore topics, find information, and learn.\n\nLuma is NOT:\n— A licensed medical provider or medical advice service\n— A licensed legal advisor\n— A licensed financial advisor\n— A substitute for professional consultation\n— A guaranteed source of factual accuracy\n\nAlways verify critical information with qualified professionals and primary sources.',
    },
    {
      title: '3. Acceptable Use',
      content: 'You agree to use Luma only for lawful purposes. You must not:\n— Use Luma to generate harmful, illegal, or malicious content\n— Attempt to reverse-engineer or scrape Luma\'s systems or APIs\n— Use Luma to harass, defame, or harm any person\n— Introduce malware or disruptive code\n— Attempt to circumvent rate limits or access controls\n— Misrepresent Luma\'s AI-generated content as verified fact without independent verification',
    },
    {
      title: '4. Intellectual Property',
      content: 'The Luma name, logo, interface design, and original code are property of Mercury and protected by applicable intellectual property laws.\n\nContent returned by Luma is synthesized from public domain and open-access sources. Attribution is provided for all source material. Users are responsible for verifying copyright status before reproducing content from results.',
    },
    {
      title: '5. AI-Generated Content Disclaimer',
      content: 'Luma uses Google\'s Gemma 4 model to synthesize answers. AI-generated content may contain errors, hallucinations, or outdated information. Mercury makes no warranties about the accuracy, completeness, or reliability of AI-generated responses. Use all results critically and verify independently.',
    },
    {
      title: '6. Third-Party Services',
      content: 'Luma integrates with third-party APIs. Mercury is not responsible for the availability, accuracy, or content of these external services. Your use of results from these APIs is subject to each provider\'s own terms of service.',
    },
    {
      title: '7. Service Availability',
      content: 'We strive to keep Luma available at all times but make no guarantee of uptime. Luma may be unavailable during maintenance, updates, or due to circumstances beyond our control. Luma\'s PWA offline mode provides access to cached results when the service is unavailable.',
    },
    {
      title: '8. Limitation of Liability',
      content: 'To the fullest extent permitted by law, Mercury and its founders shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of Luma, including reliance on AI-generated content.',
    },
    {
      title: '9. Governing Law',
      content: 'These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall first be attempted to be resolved amicably. If unresolved, disputes shall be subject to the jurisdiction of Nigerian courts.',
    },
    {
      title: '10. Open Source Attribution',
      content: 'Luma is built on open-source software including React, Vite, Framer Motion, and Firebase. Full attribution to these projects and their licenses is maintained in our GitHub repository.',
    },
    {
      title: '11. Changes to Terms',
      content: 'Mercury reserves the right to update these Terms at any time. We will indicate the revision date at the top of this page. Continued use of Luma constitutes acceptance of the revised Terms.',
    },
    {
      title: '12. Contact',
      content: 'To report violations or ask questions about these Terms, contact: legal@mercury.dev',
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: 'var(--accent-soft)' }}
          >
            <FileText size={32} style={{ color: 'var(--accent-primary)' }} />
          </motion.div>
          <h1 className="font-display text-4xl sm:text-5xl mb-3" style={{ color: 'var(--text-primary)' }}>
            Terms of Service
          </h1>
          <p className="font-body text-base max-w-xl mx-auto mb-2" style={{ color: 'var(--text-secondary)' }}>
            Plain language. No legal traps. Just the rules of the road.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Last updated: {lastUpdated}
          </p>
        </motion.div>

        {/* Short Version Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl overflow-hidden mb-10"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <button
            onClick={() => setShowShortVersion(!showShortVersion)}
            className="w-full flex items-center justify-between px-6 py-4"
          >
            <span className="font-display text-lg" style={{ color: 'var(--text-primary)' }}>
              The Short Version
            </span>
            {showShortVersion ? <ChevronUp size={18} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />}
          </button>
          <AnimatePresence>
            {showShortVersion && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-4">
                  <ul className="space-y-2">
                    {[
                      "Don't use Luma to do harm",
                      "We're not your doctor, lawyer, or financial advisor",
                      "AI can be wrong — always double-check",
                      "Your data stays on your device",
                      "Mercury built this for good — treat it with respect",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm font-body" style={{ color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--accent-primary)' }}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, i) => (
            <motion.section
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.03 }}
            >
              <h2 className="font-display text-2xl mb-3" style={{ color: 'var(--text-primary)' }}>
                {section.title}
              </h2>
              <div className="font-body text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
                {section.content}
              </div>
            </motion.section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
