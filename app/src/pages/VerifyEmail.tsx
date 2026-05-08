import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Mail, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Dummy email for display
  const userEmail = "johndoe@example.com";

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setIsResending(true);

    // Simulate API call
    setTimeout(() => {
      setIsResending(false);
      setResendCooldown(60);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>Verify Email — Screenix</title>
      </Helmet>
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 rounded-2xl border theme-transition text-center"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--accent-soft)' }}>
            <Mail className="text-accent-primary" size={32} style={{ color: 'var(--accent-primary)' }} />
          </div>

          <h1 className="font-display text-3xl mb-4" style={{ color: 'var(--text-primary)' }}>Check your email</h1>
          <p className="font-body text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            We've sent a verification link to <span className="font-semibold text-primary" style={{ color: 'var(--text-primary)' }}>{userEmail}</span>.
            Click the link in the email to activate your account and start streaming.
          </p>

          <div className="space-y-4">
            <Button
              className="w-full h-11 text-white font-semibold"
              style={{ backgroundColor: 'var(--accent-primary)' }}
              onClick={() => navigate('/')}
            >
              Take me Home
              <ArrowRight className="ml-2" size={18} />
            </Button>

            <div className="pt-4">
              <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Didn't receive an email?</p>
              <Button
                variant="outline"
                disabled={resendCooldown > 0 || isResending}
                onClick={handleResend}
                className="w-full h-11"
              >
                {isResending ? (
                  <RefreshCw className="mr-2 animate-spin" size={16} />
                ) : (
                  <RefreshCw className="mr-2" size={16} />
                )}
                {resendCooldown > 0 ? `Resend link in ${resendCooldown}s` : 'Resend verification link'}
              </Button>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="mt-8 text-xs font-medium hover:underline opacity-60"
            style={{ color: 'var(--text-secondary)' }}
          >
            Skip for now (some features will be limited)
          </button>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
