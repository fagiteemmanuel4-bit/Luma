import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Lock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [password, setPassword] = useState('');

  const getPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length > 6) strength += 25;
    if (pass.length > 10) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 25;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) strength += 25;
    return strength;
  };

  const strength = getPasswordStrength(password);
  const strengthColor = strength <= 25 ? 'bg-red-500' : strength <= 50 ? 'bg-orange-500' : strength <= 75 ? 'bg-yellow-500' : 'bg-green-500';
  const strengthLabel = strength <= 25 ? 'Weak' : strength <= 50 ? 'Fair' : strength <= 75 ? 'Good' : 'Strong';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => navigate('/profile'), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>Change Password — Screenix</title>
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
            <h1 className="text-3xl font-display font-semibold" style={{ color: 'var(--text-primary)' }}>Security</h1>
          </div>

          <div className="p-6 rounded-2xl border theme-transition" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password" style={{ color: 'var(--text-secondary)' }}>Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="pl-10 h-11"
                      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password" style={{ color: 'var(--text-secondary)' }}>New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-11"
                      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
                    />
                  </div>
                  {password && (
                    <div className="pt-2 space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                        <span style={{ color: 'var(--text-muted)' }}>Strength: {strengthLabel}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{strength}%</span>
                      </div>
                      <Progress value={strength} className="h-1" indicatorClassName={strengthColor} />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" style={{ color: 'var(--text-secondary)' }}>Confirm New Password</Label>
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
                  disabled={isLoading}
                  className="w-full h-11 text-white font-semibold"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="text-green-500" size={32} />
                </div>
                <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Password Updated</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  Your password has been changed successfully. You can now use your new password to sign in.
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
