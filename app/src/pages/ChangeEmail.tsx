import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ChangeEmail() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const currentEmail = "john@example.com";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>Change Email — Screenix</title>
      </Helmet>
      <Navbar />

      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate('/profile')} className="rounded-full">
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-3xl font-display font-semibold" style={{ color: 'var(--text-primary)' }}>Change Email</h1>
          </div>

          <div className="p-6 rounded-2xl border theme-transition" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label style={{ color: 'var(--text-muted)' }}>Current Email</Label>
                  <div className="p-3 rounded-lg border text-sm font-medium" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
                    {currentEmail}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-email" style={{ color: 'var(--text-secondary)' }}>New Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="new-email"
                      type="email"
                      placeholder="new@example.com"
                      required
                      className="pl-10 h-11"
                      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" style={{ color: 'var(--text-secondary)' }}>Confirm Password</Label>
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

                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-3">
                  <AlertCircle className="text-blue-500 shrink-0" size={18} />
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    We'll send a verification link to your new email address. Your email won't be updated until you verify it.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 text-white font-semibold"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                >
                  {isLoading ? 'Processing...' : 'Update Email Address'}
                </Button>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="text-green-500" size={32} />
                </div>
                <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Check your inbox</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  We've sent a verification link to your new email address. Please click the link to confirm the change.
                </p>
                <Button variant="outline" className="w-full" onClick={() => navigate('/profile')}>
                  Back to Profile
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
