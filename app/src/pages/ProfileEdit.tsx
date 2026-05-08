import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Camera, User, Globe, FileText, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const countries = [
  { name: 'Nigeria', code: 'NG' },
  { name: 'Ghana', code: 'GH' },
  { name: 'Kenya', code: 'KE' },
  { name: 'South Africa', code: 'ZA' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'United States', code: 'US' },
  { name: 'Canada', code: 'CA' },
  { name: 'India', code: 'IN' },
];

export default function ProfileEdit() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Mock data
  const [profile, setProfile] = useState({
    name: 'John Doe',
    username: 'johndoe',
    bio: 'Movie enthusiast and occasional popcorn critic.',
    country: 'NG',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>Edit Profile — Screenix</title>
      </Helmet>
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate('/profile')} className="rounded-full">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-display font-semibold" style={{ color: 'var(--text-primary)' }}>Edit Profile</h1>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Update your personal information and how others see you.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avatar section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="w-28 h-28 border-4" style={{ borderColor: 'var(--bg-card)' }}>
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  className="absolute bottom-1 right-1 p-2 rounded-full text-white border-2 transition-transform hover:scale-110"
                  style={{ backgroundColor: 'var(--accent-primary)', borderColor: 'var(--bg-card)' }}
                >
                  <Camera size={18} />
                </button>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Recommended: Square JPG, PNG. Max 2MB.</p>
            </div>

            <div className="grid gap-6 p-6 rounded-2xl border theme-transition" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
              <div className="space-y-2">
                <Label htmlFor="name" style={{ color: 'var(--text-secondary)' }}>Display Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="pl-10 h-11"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" style={{ color: 'var(--text-secondary)' }}>Username</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">@</div>
                  <Input
                    id="username"
                    value={profile.username}
                    onChange={(e) => setProfile({...profile, username: e.target.value})}
                    className="pl-8 h-11"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" style={{ color: 'var(--text-secondary)' }}>Bio</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-muted-foreground" size={18} />
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    className="pl-10 min-h-[100px] resize-none"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" style={{ color: 'var(--text-secondary)' }}>Country</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" size={18} />
                  <Select value={profile.country} onValueChange={(val) => setProfile({...profile, country: val})}>
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
            </div>

            <div className="flex items-center gap-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-11 text-white font-semibold transition-all duration-200"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                {isLoading ? 'Saving Changes...' : (isSaved ? 'Changes Saved!' : 'Save Changes')}
                {isSaved && <CheckCircle2 className="ml-2" size={18} />}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 px-8"
                onClick={() => navigate('/profile')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
