import { motion } from 'framer-motion';
import { Shield, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Privacy() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const sections = [
    {
      title: '1. Our Core Promise',
      content: `Luma is built on a simple principle: your curiosity is yours alone. We do not collect your name, email, device ID, or any information that could identify you as an individual. You are not our product.`,
    },
    {
      title: '2. What We Collect',
      content: `We collect only the following, in aggregate:\n— Total number of queries submitted (a running counter)\n— Which knowledge sources were consulted per session\n— General topic category selected (e.g., Health, Science)\n\nWe do NOT collect:\n— Your search queries or question text\n— Your IP address\n— Your location\n— Cookies for tracking\n— Any biometric or behavioral data`,
    },
    {
      title: '3. How Your Queries Are Processed',
      content: `When you submit a question, it is sent directly to Google's Gemma 4 model via the Gemini API. This means your query is subject to Google's data processing terms. We encourage you to review Google's Privacy Policy at policies.google.com. We do not store your query text on our servers at any point.\n\nAdditionally, your query is sent in parallel to up to nine open public APIs (Wikipedia, NASA, PubMed, etc.). These are public services with their own privacy policies. No personally identifying information is included in these requests.`,
    },
    {
      title: '4. Local Storage & Caching',
      content: `Luma uses your browser's localStorage to:\n— Save your theme preference (light/dark)\n— Save your reading level preference\n— Cache your last 8 search queries for convenience\n— Cache search results for offline access (24hrs)\n\nThis data never leaves your device. You can clear it at any time via your browser settings or our Settings panel.`,
    },
    {
      title: '5. Firebase & Analytics',
      content: `We use Firebase Hosting to serve this application and Firebase Firestore to maintain anonymous aggregate counters (total queries answered, API usage counts). No user-level data is stored in Firestore. Firebase is a Google product and subject to Google's terms.`,
    },
    {
      title: '6. Third-Party APIs',
      content: `Luma connects to the following third-party APIs. Each has its own privacy policy:\n— Google Gemma / Gemini API → policies.google.com\n— NASA Open APIs → api.nasa.gov\n— NewsAPI → newsapi.org/privacy\n— Wikipedia REST API → wikimediafoundation.org/privacy\n— PubMed/NCBI → nlm.nih.gov/privacy\n— Open Library → openlibrary.org/about/privacy\n— World Bank → worldbank.org/en/about/legal/privacy\n— Open-Meteo → open-meteo.com/privacy\n— REST Countries → restcountries.com`,
    },
    {
      title: "7. Children's Privacy",
      content: `Luma is not directed at children under 13. We do not knowingly collect any information from users under 13. If you are a parent or guardian and believe your child has submitted information through Luma, please contact us immediately.`,
    },
    {
      title: '8. Your Rights',
      content: `Since we do not collect personal data, there is nothing to request, correct, or delete on our end. Your query history lives only on your device — you are always in full control. Clear your browser localStorage to erase it completely.`,
    },
    {
      title: '9. Changes to This Policy',
      content: `We may update this policy as Luma evolves. The date at the top of this page reflects when it was last revised. Continued use of Luma after changes constitutes acceptance of the updated policy.`,
    },
    {
      title: '10. Contact',
      content: `Questions? Reach us at: hello@mercury.dev\nBuilt by Mercury — Nigeria.`,
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
            <Shield size={32} style={{ color: 'var(--accent-primary)' }} />
          </motion.div>
          <h1 className="font-display text-4xl sm:text-5xl mb-3" style={{ color: 'var(--text-primary)' }}>
            Privacy Policy
          </h1>
          <p className="font-body text-base max-w-xl mx-auto mb-2" style={{ color: 'var(--text-secondary)' }}>
            We built Luma so you never have to share anything personal to get answers.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Last updated: {lastUpdated}
          </p>
        </motion.div>

        {/* Privacy Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl p-6 mb-10"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1.5px solid var(--accent-primary)',
          }}
        >
          <h2 className="font-display text-xl mb-4 text-center" style={{ color: 'var(--text-primary)' }}>
            Privacy Score Card
          </h2>
          <div className="space-y-3">
            {[
              'No account required',
              'No personal data stored',
              'No tracking cookies',
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
                <span className="text-sm font-body" style={{ color: 'var(--text-secondary)' }}>{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, i) => (
            <motion.section
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
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
