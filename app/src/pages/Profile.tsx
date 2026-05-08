import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { User, Mail, Globe, Calendar, CreditCard, ChevronRight, Bookmark, History, Settings, LogOut, Camera } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCurrency } from '@/context/CurrencyContext';

export default function Profile() {
  const { currency } = useCurrency();

  // Mock user data
  const user = {
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    country: 'Nigeria',
    joinedDate: 'October 2023',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100',
    plan: 'Free'
  };

  const quickLinks = [
    { icon: <Bookmark size={20} />, label: 'Watchlist', path: '/profile/watchlist', color: 'bg-blue-500/10 text-blue-500' },
    { icon: <History size={20} />, label: 'History', path: '/profile/history', color: 'bg-purple-500/10 text-purple-500' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings', color: 'bg-orange-500/10 text-orange-500' },
  ];

  const menuItems = [
    { label: 'Edit Profile', path: '/profile/edit' },
    { label: 'Change Email', path: '/profile/change-email' },
    { label: 'Change Password', path: '/profile/change-password' },
    { label: 'Manage Devices', path: '/profile/devices' },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>My Profile — Screenix</title>
      </Helmet>
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pt-28 pb-16">
        <div className="grid md:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 rounded-2xl border theme-transition"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative group mb-4">
                  <Avatar className="w-24 h-24 border-2" style={{ borderColor: 'var(--accent-primary)' }}>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-white border-2 border-card transition-transform hover:scale-110" style={{ backgroundColor: 'var(--accent-primary)' }}>
                    <Camera size={14} />
                  </button>
                </div>
                <h2 className="text-xl font-display font-semibold" style={{ color: 'var(--text-primary)' }}>{user.name}</h2>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>@{user.username}</p>

                <div className="mt-6 w-full pt-6 border-t space-y-3" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <Mail size={16} className="shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <Globe size={16} className="shrink-0" />
                    <span>{user.country}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <Calendar size={16} className="shrink-0" />
                    <span>Joined {user.joinedDate}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl border theme-transition"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>Account Status</h3>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} style={{ color: 'var(--accent-primary)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user.plan} Plan</span>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-primary)' }}>
                  {currency.symbol}0/mo
                </span>
              </div>
              <Button variant="outline" className="w-full text-xs h-9" asChild>
                <Link to="/pricing">Upgrade Plan</Link>
              </Button>
            </motion.div>
          </aside>

          {/* Main Content */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-4"
            >
              {quickLinks.map((link, i) => (
                <Link
                  key={i}
                  to={link.path}
                  className="p-4 rounded-2xl border theme-transition flex flex-col items-center gap-2 transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
                >
                  <div className={`p-2 rounded-xl ${link.color}`}>
                    {link.icon}
                  </div>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{link.label}</span>
                </Link>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border overflow-hidden theme-transition"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
            >
              <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <h3 className="font-display text-xl" style={{ color: 'var(--text-primary)' }}>Account Settings</h3>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                {menuItems.map((item, i) => (
                  <Link
                    key={i}
                    to={item.path}
                    className="flex items-center justify-between p-4 px-6 hover:bg-secondary transition-colors group"
                  >
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                    <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" style={{ color: 'var(--text-muted)' }} />
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center"
            >
              <Button
                variant="ghost"
                className="text-red-500 hover:text-red-600 hover:bg-red-500/5 gap-2"
              >
                <LogOut size={18} />
                Sign Out
              </Button>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
