import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Lock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing token.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Simulate token expiration for demo
      if (token === 'expired') {
        setError('This link has expired. Please request a new one.');
      } else {
        setIsSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>Reset Password — Screenix</title>
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
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl mb-2" style={{ color: 'var(--text-primary)' }}>New Password</h1>
            <p className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>
              Create a strong new password for your account
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex gap-3 text-sm">
              <AlertCircle className="text-red-500 shrink-0" size={18} />
              <div>
                <p className="font-semibold text-red-500">Reset failed</p>
                <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
                {error.includes('expired') && (
                  <Button variant="link" className="p-0 h-auto text-red-500 mt-2" onClick={() => navigate('/forgot-password')}>
                    Request new link
                  </Button>
                )}
              </div>
            </div>
          )}

          {isSuccess ? (
            <div className="text-center p-6 rounded-xl border border-green-500/20 bg-green-500/5">
              <CheckCircle2 className="mx-auto mb-4 text-green-500" size={48} />
              <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Password updated!</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Your password has been changed successfully. Redirecting you to login...
              </p>
              <Button
                className="mt-6 w-full"
                onClick={() => navigate('/login')}
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                Go to login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="password" style={{ color: 'var(--text-secondary)' }}>New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="pl-10 h-11"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" style={{ color: 'var(--text-secondary)' }}>Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="pl-10 h-11"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !token}
                className="w-full h-11 text-white font-semibold transition-all duration-200"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                {isLoading ? 'Updating password...' : 'Update Password'}
                {!isLoading && <ArrowRight className="ml-2" size={18} />}
              </Button>
            </form>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
