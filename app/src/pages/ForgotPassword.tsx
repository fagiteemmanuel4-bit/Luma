import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>Forgot Password — Screenix</title>
      </Helmet>
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 rounded-2xl border theme-transition"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div className="mb-8">
            <Link to="/login" className="inline-flex items-center text-sm font-medium hover:underline mb-6" style={{ color: 'var(--text-secondary)' }}>
              <ArrowLeft className="mr-2" size={16} />
              Back to login
            </Link>
            <h1 className="font-display text-3xl mb-2" style={{ color: 'var(--text-primary)' }}>Reset Password</h1>
            <p className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>
              Enter your email and we'll send you a reset link
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" style={{ color: 'var(--text-secondary)' }}>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 text-white font-semibold transition-all duration-200"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                {isLoading ? 'Sending link...' : 'Send Reset Link'}
              </Button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-6 rounded-xl border border-green-500/20 bg-green-500/5"
            >
              <CheckCircle2 className="mx-auto mb-4 text-green-500" size={48} />
              <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Check your inbox</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                We've sent a password reset link to <span className="font-semibold">{email}</span>. Please check your email to continue.
              </p>
              <Button
                variant="outline"
                className="mt-6 w-full"
                onClick={() => setIsSubmitted(false)}
              >
                Try another email
              </Button>
            </motion.div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
