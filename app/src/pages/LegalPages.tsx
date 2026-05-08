import { motion } from 'framer-motion';
import { ShieldCheck, FileText, Scale, Cookie, AlertCircle, HelpCircle, Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';

interface LegalLayoutProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function LegalLayout({ title, icon, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>{title} — Screenix</title>
      </Helmet>
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-primary)' }}>
            {icon}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl mb-3" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </motion.div>
        <div className="prose prose-sm max-w-none font-body space-y-6" style={{ color: 'var(--text-secondary)' }}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function Terms() {
  return (
    <LegalLayout title="Terms of Service" icon={<Scale size={32} />}>
      <p>Welcome to Screenix. By accessing or using our service, you agree to be bound by these Terms of Service.</p>
      <h2 className="text-xl font-display text-primary pt-4" style={{ color: 'var(--text-primary)' }}>1. Use of Service</h2>
      <p>Screenix provides a streaming platform for personal, non-commercial use only. You must be at least 13 years old to use this service.</p>
      <h2 className="text-xl font-display text-primary pt-4" style={{ color: 'var(--text-primary)' }}>2. Content Ownership</h2>
      <p>All content available on Screenix is the property of its respective owners. We do not claim ownership of the movies, shows, or anime indexed on our platform.</p>
      <h2 className="text-xl font-display text-primary pt-4" style={{ color: 'var(--text-primary)' }}>3. User Accounts</h2>
      <p>You are responsible for maintaining the confidentiality of your account credentials. Any suspicious activity should be reported to us immediately.</p>
    </LegalLayout>
  );
}

export function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" icon={<ShieldCheck size={32} />}>
      <p>Your privacy is important to us. This policy explains how we collect, use, and protect your data.</p>
      <h2 className="text-xl font-display text-primary pt-4" style={{ color: 'var(--text-primary)' }}>1. Data Collection</h2>
      <p>We collect minimal data to provide our service, including your email, username, and IP-based geolocation for regional currency detection.</p>
      <h2 className="text-xl font-display text-primary pt-4" style={{ color: 'var(--text-primary)' }}>2. Cookies</h2>
      <p>We use essential cookies to keep you logged in and remember your preferences. See our Cookie Policy for more details.</p>
      <h2 className="text-xl font-display text-primary pt-4" style={{ color: 'var(--text-primary)' }}>3. Third Parties</h2>
      <p>We do not sell your personal data to third parties. We may use anonymous analytics to improve our service.</p>
    </LegalLayout>
  );
}

export function DMCA() {
  return (
    <LegalLayout title="DMCA Notice" icon={<FileText size={32} />}>
      <p>Screenix respects intellectual property rights and expects its users to do the same.</p>
      <p>In accordance with the Digital Millennium Copyright Act (DMCA), we will respond promptly to claims of copyright infringement.</p>
      <h2 className="text-xl font-display text-primary pt-4" style={{ color: 'var(--text-primary)' }}>Reporting Infringement</h2>
      <p>If you are a copyright owner and believe that content on our site infringes your rights, please send a notice to: dmca@screenix.com</p>
      <p>Your notice must include a physical or electronic signature, identification of the copyrighted work, and contact information.</p>
    </LegalLayout>
  );
}

export function Cookies() {
  return (
    <LegalLayout title="Cookie Policy" icon={<Cookie size={32} />}>
      <p>This policy describes how Screenix uses cookies and similar technologies.</p>
      <h2 className="text-xl font-display text-primary pt-4" style={{ color: 'var(--text-primary)' }}>What are cookies?</h2>
      <p>Cookies are small text files stored on your device that help us provide a better experience.</p>
      <h2 className="text-xl font-display text-primary pt-4" style={{ color: 'var(--text-primary)' }}>Types of cookies we use</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Essential:</strong> Required for login and security.</li>
        <li><strong>Preferences:</strong> Used to remember your theme and language settings.</li>
        <li><strong>Analytics:</strong> Help us understand how users interact with the site.</li>
      </ul>
    </LegalLayout>
  );
}
