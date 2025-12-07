'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

const brandPartners = [
  { name: 'Pottery Barn', logo: '🏠' },
  { name: 'YSL Beauty', logo: '💄' },
  { name: 'Maybelline', logo: '✨' },
  { name: 'Target', logo: '🎯' },
  { name: 'Jo Malone', logo: '🕯️' },
  { name: 'Poppui', logo: '🌸' },
];

const stats = [
  { platform: 'YouTube', count: '36K', label: 'subscribers' },
  { platform: 'Instagram', count: '10K', label: 'followers' },
  { platform: 'TikTok', count: '15K', label: 'followers' },
];

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', company: '', message: '' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cream-50/80 backdrop-blur-md border-b border-cream-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-serif text-2xl text-taupe-700">
            Michelle Choe
          </Link>
          <div className="flex gap-8 items-center">
            <a href="#work" className="text-taupe-600 hover:text-taupe-700 transition-colors text-sm tracking-wide">
              Work
            </a>
            <a href="#brand-kit" className="text-taupe-600 hover:text-taupe-700 transition-colors text-sm tracking-wide">
              Brand Kit
            </a>
            <a href="#contact" className="btn btn-primary text-sm">
              Let's Collaborate
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center"
          >
            <p className="text-taupe-500 tracking-[0.3em] uppercase text-sm mb-6">
              UGC Creator & Lifestyle Storyteller
            </p>
            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-taupe-700 mb-8 leading-tight">
              Michelle Choe
            </h1>
            <p className="text-taupe-600 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
              Creating authentic, aesthetic content that connects brands 
              with engaged audiences who crave cozy, elevated living.
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-12 md:gap-16">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.platform}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-center"
                >
                  <p className="font-serif text-4xl text-taupe-700">{stat.count}</p>
                  <p className="text-taupe-500 text-sm tracking-wide">{stat.platform}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand Partners */}
      <section className="py-20 px-6 bg-cream-100">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-center text-taupe-500 tracking-[0.2em] uppercase text-sm mb-12">
              Trusted by brands like
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {brandPartners.map((brand, index) => (
                <motion.div
                  key={brand.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center justify-center p-6 bg-cream-50 rounded-2xl shadow-soft hover:shadow-soft-lg transition-shadow"
                >
                  <span className="text-4xl mb-3">{brand.logo}</span>
                  <span className="text-taupe-600 text-sm font-medium">{brand.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Work */}
      <section id="work" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-5xl text-taupe-700 text-center mb-4">
              Featured Work
            </h2>
            <p className="text-taupe-500 text-center mb-16 max-w-xl mx-auto">
              A selection of brand collaborations showcasing authentic, lifestyle-driven content.
            </p>
          </motion.div>

          {/* Work Grid - Placeholder for now */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: item * 0.1 }}
                className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-cream-200 to-blush-100 flex items-center justify-center shadow-soft hover:shadow-soft-lg transition-all cursor-pointer group overflow-hidden"
              >
                <div className="text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-cream-50/80 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-taupe-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-taupe-500 text-sm">Video {item}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Kit Section */}
      <section id="brand-kit" className="py-24 px-6 bg-cream-100">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-5xl text-taupe-700 text-center mb-4">
              Brand Kit
            </h2>
            <p className="text-taupe-500 text-center mb-16 max-w-xl mx-auto">
              Everything you need to know about working with me.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Media Kit', desc: 'Full overview, demographics & rates', icon: '📊' },
              { title: 'Analytics', desc: 'Platform performance & engagement', icon: '📈' },
              { title: 'Sample Work', desc: 'Content examples & deliverables', icon: '🎬' },
              { title: 'Aesthetic Guide', desc: 'Moodboards & visual style', icon: '🎨' },
            ].map((item, index) => (
              <motion.a
                key={item.title}
                href="#"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-6 p-6 bg-cream-50 rounded-2xl shadow-soft hover:shadow-soft-lg transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-cream-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-serif text-xl text-taupe-700 mb-1">{item.title}</h3>
                  <p className="text-taupe-500 text-sm">{item.desc}</p>
                </div>
                <svg className="w-5 h-5 text-taupe-400 ml-auto group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-5xl text-taupe-700 text-center mb-4">
              Let's Create Together
            </h2>
            <p className="text-taupe-500 text-center mb-12">
              Interested in a collaboration? I'd love to hear from you.
            </p>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-cream-100 rounded-2xl"
            >
              <div className="text-5xl mb-4">💌</div>
              <h3 className="font-serif text-2xl text-taupe-700 mb-2">Thank you!</h3>
              <p className="text-taupe-500">I'll get back to you within 48 hours.</p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-taupe-600 text-sm mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-cream-100 border border-cream-300 text-taupe-700 placeholder:text-taupe-400"
                    placeholder="Jane Smith"
                  />
                </div>
                <div>
                  <label className="block text-taupe-600 text-sm mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-cream-100 border border-cream-300 text-taupe-700 placeholder:text-taupe-400"
                    placeholder="jane@brand.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-taupe-600 text-sm mb-2">Company / Brand</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-cream-100 border border-cream-300 text-taupe-700 placeholder:text-taupe-400"
                  placeholder="Your Brand Name"
                />
              </div>
              <div>
                <label className="block text-taupe-600 text-sm mb-2">Tell me about your project</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-cream-100 border border-cream-300 text-taupe-700 placeholder:text-taupe-400 resize-none"
                  placeholder="I'd love to learn about your partnership goals, timeline, and budget..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn btn-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </motion.form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-cream-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-serif text-xl text-taupe-700">Michelle Choe</p>
          <div className="flex gap-6">
            <a href="#" className="text-taupe-500 hover:text-taupe-700 transition-colors">
              YouTube
            </a>
            <a href="#" className="text-taupe-500 hover:text-taupe-700 transition-colors">
              Instagram
            </a>
            <a href="#" className="text-taupe-500 hover:text-taupe-700 transition-colors">
              TikTok
            </a>
          </div>
          <p className="text-taupe-400 text-sm">© 2024 Michelle Choe</p>
        </div>
      </footer>

      {/* Admin Link - subtle */}
      <Link 
        href="/dashboard" 
        className="fixed bottom-4 right-4 w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center text-taupe-500 hover:bg-cream-300 transition-colors opacity-50 hover:opacity-100"
        title="Dashboard"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </Link>
    </main>
  );
}
