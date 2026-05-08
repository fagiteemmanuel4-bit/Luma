import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Mail, Lock, User, Globe, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCurrency } from '@/context/CurrencyContext';

const countries = [
  { name: 'Nigeria', code: 'NG' },
  { name: 'Ghana', code: 'GH' },
  { name: 'Kenya', code: 'KE' },
  { name: 'South Africa', code: 'ZA' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'United States', code: 'US' },
  { name: 'Canada', code: 'CA' },
  { name: 'India', code: 'IN' },
  { name: 'Other', code: 'OTHER' },
];

export default function Signup() {
  const navigate = useNavigate();
  const { detectedCountry } = useCurrency();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/verify-email');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>Sign Up — Screenix</title>
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
            <h1 className="font-display text-3xl mb-2" style={{ color: 'var(--text-primary)' }}>Create Account</h1>
            <p className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>
              Join Screenix to start streaming for free
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" style={{ color: 'var(--text-secondary)' }}>Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="username"
                  placeholder="johndoe"
                  required
                  className="pl-10 h-11"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
                />
              </div>
            </div>

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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" style={{ color: 'var(--text-secondary)' }}>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="pl-10 h-11 text-xs"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" style={{ color: 'var(--text-secondary)' }}>Confirm</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="pl-10 h-11 text-xs"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" style={{ color: 'var(--text-secondary)' }}>Country</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" size={18} />
                <Select defaultValue={countries.find(c => c.name === detectedCountry)?.code || 'NG'}>
                  <SelectTrigger className="pl-10 h-11" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <Checkbox id="terms" required />
              <label
                htmlFor="terms"
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                style={{ color: 'var(--text-secondary)' }}
              >
                I agree to the <Link to="/terms" className="text-accent-primary hover:underline" style={{ color: 'var(--accent-primary)' }}>Terms of Service</Link> and <Link to="/privacy" className="text-accent-primary hover:underline" style={{ color: 'var(--accent-primary)' }}>Privacy Policy</Link>
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 text-white font-semibold transition-all duration-200 mt-4"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
              {!isLoading && <ArrowRight className="ml-2" size={18} />}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: 'var(--border-subtle)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold hover:underline" style={{ color: 'var(--accent-primary)' }}>
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
