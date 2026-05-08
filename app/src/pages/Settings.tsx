import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Bell, Play, Monitor, Languages, Globe, Trash2, ChevronRight, Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCurrency } from '@/context/CurrencyContext';

export default function Settings() {
  const { currency, setCurrency } = useCurrency();

  const [autoplay, setAutoplay] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const currencies = [
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
    { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi' },
    { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>Settings — Screenix</title>
      </Helmet>
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 pt-28 pb-16">
        <h1 className="text-4xl font-display font-semibold mb-8" style={{ color: 'var(--text-primary)' }}>Settings</h1>

        <div className="space-y-8">
          {/* App Preferences */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest px-1" style={{ color: 'var(--text-muted)' }}>App Preferences</h2>
            <div className="rounded-2xl border theme-transition overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center justify-between p-4 px-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                    <Play size={20} />
                  </div>
                  <div>
                    <Label className="text-base" style={{ color: 'var(--text-primary)' }}>Autoplay Next Episode</Label>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Automatically play the next episode in a series.</p>
                  </div>
                </div>
                <Switch checked={autoplay} onCheckedChange={setAutoplay} />
              </div>

              <Separator style={{ backgroundColor: 'var(--border-subtle)' }} />

              <div className="flex items-center justify-between p-4 px-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                    <Monitor size={20} />
                  </div>
                  <div>
                    <Label className="text-base" style={{ color: 'var(--text-primary)' }}>Streaming Quality</Label>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Set your default video playback quality.</p>
                  </div>
                </div>
                <Select defaultValue="auto">
                  <SelectTrigger className="w-32 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="1080p">1080p HD</SelectItem>
                    <SelectItem value="720p">720p HD</SelectItem>
                    <SelectItem value="480p">480p SD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator style={{ backgroundColor: 'var(--border-subtle)' }} />

              <div className="flex items-center justify-between p-4 px-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                    <Languages size={20} />
                  </div>
                  <div>
                    <Label className="text-base" style={{ color: 'var(--text-primary)' }}>Subtitle Language</Label>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Choose your preferred language for subtitles.</p>
                  </div>
                </div>
                <Select defaultValue="en">
                  <SelectTrigger className="w-32 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Regional Settings */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest px-1" style={{ color: 'var(--text-muted)' }}>Regional</h2>
            <div className="rounded-2xl border theme-transition overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center justify-between p-4 px-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-green-500/10 text-green-500">
                    <Globe size={20} />
                  </div>
                  <div>
                    <Label className="text-base" style={{ color: 'var(--text-primary)' }}>Currency Display</Label>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Override your automatically detected currency.</p>
                  </div>
                </div>
                <Select
                  value={currency.code}
                  onValueChange={(val) => {
                    const c = currencies.find(curr => curr.code === val);
                    if (c) setCurrency({ code: c.code, symbol: c.symbol });
                  }}
                >
                  <SelectTrigger className="w-40 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((c) => (
                      <SelectItem key={c.code} value={c.code}>{c.name} ({c.symbol})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Account Settings */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest px-1" style={{ color: 'var(--text-muted)' }}>Notifications & Support</h2>
            <div className="rounded-2xl border theme-transition overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center justify-between p-4 px-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
                    <Bell size={20} />
                  </div>
                  <div>
                    <Label className="text-base" style={{ color: 'var(--text-primary)' }}>Email Notifications</Label>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Receive updates about new releases and features.</p>
                  </div>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>

              <Separator style={{ backgroundColor: 'var(--border-subtle)' }} />

              <button className="w-full flex items-center justify-between p-4 px-6 hover:bg-secondary transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-yellow-500/10 text-yellow-500">
                    <Info size={20} />
                  </div>
                  <div className="text-left">
                    <span className="block text-base font-medium" style={{ color: 'var(--text-primary)' }}>Help & FAQ</span>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Find answers to common questions.</p>
                  </div>
                </div>
                <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="space-y-4 pt-4">
            <h2 className="text-sm font-bold uppercase tracking-widest px-1 text-red-500">Danger Zone</h2>
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center justify-between p-6 gap-6">
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-red-500 mb-1">Delete Account</h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="h-11 px-8 font-semibold">
                      <Trash2 className="mr-2" size={18} />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove all your data from our servers, including your watchlist and history.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-500 hover:bg-red-600">Delete Permanently</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
