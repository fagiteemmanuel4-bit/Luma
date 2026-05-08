import { AlertCircle, Send, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function Contact() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>Contact Us — Screenix</title>
      </Helmet>
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl mb-4" style={{ color: 'var(--text-primary)' }}>Get in Touch</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Have a question or feedback? We'd love to hear from you.</p>
        </div>

        <form className="space-y-6 p-8 rounded-2xl border theme-transition" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="What is this about?" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Your message..." className="min-h-[150px]" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }} />
          </div>
          <Button className="w-full h-12 text-white font-bold" style={{ backgroundColor: 'var(--accent-primary)' }}>
            <Send className="mr-2" size={18} />
            Send Message
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export function Help() {
  const faqs = [
    { q: "Is Screenix really free?", a: "Yes, Screenix is currently free for all users. We don't require a credit card to sign up." },
    { q: "What content is available?", a: "We offer a wide range of movies, TV shows, anime, K-Dramas, and Nollywood titles." },
    { q: "How do I add to watchlist?", a: "Simply click the heart or bookmark icon on any movie or show detail page." },
    { q: "Can I watch offline?", a: "Offline downloads are coming soon to our mobile and desktop apps." }
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>Help Center — Screenix</title>
      </Helmet>
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl mb-4" style={{ color: 'var(--text-primary)' }}>Help Center</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Find answers to frequently asked questions.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="p-6 rounded-2xl border theme-transition" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
              <h3 className="font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <MessageSquare className="text-accent-primary" size={18} style={{ color: 'var(--accent-primary)' }} />
                {faq.q}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-2xl text-center bg-accent-soft border border-accent-primary/20" style={{ backgroundColor: 'var(--accent-soft)' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Still need help?</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Our support team is available 24/7 to assist you.</p>
          <Button asChild style={{ backgroundColor: 'var(--accent-primary)' }}>
            <a href="mailto:support@screenix.com">Contact Support</a>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function Appeal() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Helmet>
        <title>Appeal Ban — Screenix</title>
      </Helmet>
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-red-500/10 text-red-500">
            <AlertCircle size={32} />
          </div>
          <h1 className="font-display text-4xl mb-4" style={{ color: 'var(--text-primary)' }}>Appeal a Ban</h1>
          <p style={{ color: 'var(--text-secondary)' }}>If you believe your account was banned in error, please fill out the form below.</p>
        </div>

        <form className="space-y-6 p-8 rounded-2xl border border-red-500/20 theme-transition" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
          <div className="space-y-2">
            <Label htmlFor="email">Account Email</Label>
            <Input id="email" type="email" placeholder="your@email.com" required style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Appeal</Label>
            <Textarea id="reason" placeholder="Explain why you believe the ban should be overturned..." className="min-h-[200px]" required style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }} />
          </div>
          <Button className="w-full h-12 text-white font-bold bg-red-500 hover:bg-red-600 border-none">
            Submit Appeal
          </Button>
          <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
            Appeals are reviewed within 5–7 business days.
          </p>
        </form>
      </main>
      <Footer />
    </div>
  );
}
