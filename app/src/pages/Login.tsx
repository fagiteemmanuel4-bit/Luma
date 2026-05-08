import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Mail, Lock, AlertTriangle, Ban, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type AuthStatus = 'active' | 'suspended' | 'banned';

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<AuthStatus>('active');
  const [suspensionInfo, setSuspensionInfo] = useState({ reason: '', until: '' });
  const [banReason, setBanReason] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // For demo purposes, we can trigger different states
      // In a real app, this would come from the backend
      // navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>Login — Screenix</title>
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
            <h1 className="font-display text-3xl mb-2" style={{ color: 'var(--text-primary)' }}>Welcome Back</h1>
            <p className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>
              Enter your details to access your account
            </p>
          </div>

          {status === 'suspended' && (
            <div className="mb-6 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 flex gap-3">
              <AlertTriangle className="text-yellow-500 shrink-0" size={20} />
              <div className="text-sm">
                <p className="font-semibold text-yellow-500">Account Suspended</p>
                <p style={{ color: 'var(--text-secondary)' }}>Reason: {suspensionInfo.reason}</p>
                <p style={{ color: 'var(--text-secondary)' }}>Until: {suspensionInfo.until}</p>
              </div>
            </div>
          )}

          {status === 'banned' && (
            <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex gap-3">
              <Ban className="text-red-500 shrink-0" size={20} />
              <div className="text-sm">
                <p className="font-semibold text-red-500">Account Permanently Banned</p>
                <p style={{ color: 'var(--text-secondary)' }}>Reason: {banReason}</p>
                <Link to="/appeal" className="text-red-500 hover:underline mt-1 inline-block font-medium">
                  Appeal this decision
                </Link>
              </div>
            </div>
          )}

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
                  className="pl-10 h-11"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" style={{ color: 'var(--text-secondary)' }}>Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium hover:underline"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  Forgot password?
                </Link>
              </div>
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

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                style={{ color: 'var(--text-secondary)' }}
              >
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading || status !== 'active'}
              className="w-full h-11 text-white font-semibold transition-all duration-200"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && <ArrowRight className="ml-2" size={18} />}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: 'var(--border-subtle)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold hover:underline" style={{ color: 'var(--accent-primary)' }}>
                Create account
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
