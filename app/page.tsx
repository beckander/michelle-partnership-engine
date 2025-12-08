'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

const brandPartners = [
  { name: 'Pottery Barn', logo: '/logos/potterybarn.png' },
  { name: 'Armani Beauty', logo: '/logos/armani.png' },
  { name: 'Notion', logo: '/logos/notion.png' },
  { name: 'Target', logo: '/logos/target.png' },
  { name: 'Princess Polly', logo: '/logos/princesspolly.png' },
  { name: 'Poppui', logo: '/logos/poppui.png' },
];

const stats = [
  { platform: 'YouTube', count: '37K', label: 'subscribers' },
  { platform: 'Instagram', count: '9.7K', label: 'followers' },
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
    <main className="min-h-screen bg-gradient-to-b from-[#FAF7F2] to-[#F5EFE6]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8DFD0]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-serif text-2xl text-[#5C4D3C]">
            Michelle Choe
          </Link>
          <div className="flex gap-8 items-center">
            <a href="#work" className="text-[#7D6D5A] hover:text-[#5C4D3C] transition-colors text-sm tracking-wide">
              Work
            </a>
            <a href="#brand-kit" className="text-[#7D6D5A] hover:text-[#5C4D3C] transition-colors text-sm tracking-wide">
              Brand Kit
            </a>
            <a href="#contact" className="px-6 py-2.5 bg-[#5C4D3C] text-[#FAF7F2] rounded-lg text-sm hover:bg-[#4A3D2F] transition-colors">
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
            {/* Photo placeholder - replace src with actual photo */}
            <div className="w-32 h-32 mx-auto mb-8 rounded-full overflow-hidden border-4 border-[#D4C4A8] shadow-lg">
              <img 
                src="/michelle-photo.jpg" 
                alt="Michelle Choe"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            
            <p className="text-[#9A8B78] tracking-[0.3em] uppercase text-sm mb-4">
              Lifestyle & Beauty Creator
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[#5C4D3C] mb-8 leading-tight">
              Michelle Choe
            </h1>
            <p className="text-[#7D6D5A] text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
              Creating authentic, aesthetic content that connects brands 
              with engaged audiences who crave elevated, beautiful living.
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
                  <p className="font-serif text-4xl text-[#5C4D3C]">{stat.count}</p>
                  <p className="text-[#9A8B78] text-sm tracking-wide">{stat.platform}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand Partners */}
      <section className="py-20 px-6 bg-[#F0E9DD]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-center text-[#9A8B78] tracking-[0.2em] uppercase text-sm mb-12">
              Trusted by brands like
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {brandPartners.map((brand, index) => (
                <motion.div
                  key={brand.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-center p-6 bg-[#FAF7F2] rounded-xl shadow-sm hover:shadow-md transition-shadow h-24"
                >
                  <img 
                    src={brand.logo} 
                    alt={brand.name}
                    className="max-h-12 max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `<span class="text-[#7D6D5A] text-sm font-medium">${brand.name}</span>`;
                    }}
                  />
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
            <h2 className="font-serif text-4xl text-[#5C4D3C] text-center mb-4">
              Featured Work
            </h2>
            <p className="text-[#9A8B78] text-center mb-16 max-w-xl mx-auto">
              A selection of brand collaborations showcasing authentic, lifestyle-driven content.
            </p>
          </motion.div>

          {/* Work Grid - Placeholder for videos/images */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: item * 0.1 }}
                className="aspect-[4/5] rounded-xl bg-gradient-to-br from-[#E8DFD0] to-[#D4C4A8] flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer group overflow-hidden"
              >
                <div className="text-center p-6">
                  <div className="w-14 h-14 rounded-full bg-[#FAF7F2]/80 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-[#7D6D5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-[#7D6D5A] text-sm">Coming Soon</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Kit Section */}
      <section id="brand-kit" className="py-24 px-6 bg-[#F0E9DD]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl text-[#5C4D3C] text-center mb-4">
              Brand Kit
            </h2>
            <p className="text-[#9A8B78] text-center mb-16 max-w-xl mx-auto">
              Everything you need to know about working with me.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Media Kit', desc: 'Rates, demographics & analytics', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { title: 'Previous Work', desc: 'Content examples & deliverables', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
            ].map((item, index) => (
              <motion.a
                key={item.title}
                href="#"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-5 p-6 bg-[#FAF7F2] rounded-xl shadow-sm hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-[#E8DFD0] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-[#7D6D5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-[#5C4D3C] mb-0.5">{item.title}</h3>
                  <p className="text-[#9A8B78] text-sm">{item.desc}</p>
                </div>
                <svg className="w-5 h-5 text-[#9A8B78] group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <h2 className="font-serif text-4xl text-[#5C4D3C] text-center mb-4">
              Let's Create Together
            </h2>
            <p className="text-[#9A8B78] text-center mb-12">
              Interested in a collaboration? I'd love to hear from you.
            </p>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-[#F0E9DD] rounded-xl"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#D4C4A8] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#5C4D3C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-[#5C4D3C] mb-2">Thank you!</h3>
              <p className="text-[#7D6D5A]">I'll get back to you within 48 hours.</p>
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
                  <label className="block text-[#5C4D3C] text-sm mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-[#F0E9DD] border border-[#E8DFD0] text-[#5C4D3C] placeholder:text-[#9A8B78] focus:outline-none focus:border-[#D4C4A8]"
                    placeholder="Jane Smith"
                  />
                </div>
                <div>
                  <label className="block text-[#5C4D3C] text-sm mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-[#F0E9DD] border border-[#E8DFD0] text-[#5C4D3C] placeholder:text-[#9A8B78] focus:outline-none focus:border-[#D4C4A8]"
                    placeholder="jane@brand.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#5C4D3C] text-sm mb-2">Company / Brand</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#F0E9DD] border border-[#E8DFD0] text-[#5C4D3C] placeholder:text-[#9A8B78] focus:outline-none focus:border-[#D4C4A8]"
                  placeholder="Your Brand Name"
                />
              </div>
              <div>
                <label className="block text-[#5C4D3C] text-sm mb-2">Tell me about your project</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#F0E9DD] border border-[#E8DFD0] text-[#5C4D3C] placeholder:text-[#9A8B78] resize-none focus:outline-none focus:border-[#D4C4A8]"
                  placeholder="I'd love to learn about your partnership goals, timeline, and budget..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#5C4D3C] text-[#FAF7F2] rounded-lg text-base hover:bg-[#4A3D2F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </motion.form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#E8DFD0]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-serif text-xl text-[#5C4D3C]">Michelle Choe</p>
          <div className="flex gap-6">
            <a href="#" className="text-[#7D6D5A] hover:text-[#5C4D3C] transition-colors">
              YouTube
            </a>
            <a href="#" className="text-[#7D6D5A] hover:text-[#5C4D3C] transition-colors">
              Instagram
            </a>
            <a href="#" className="text-[#7D6D5A] hover:text-[#5C4D3C] transition-colors">
              TikTok
            </a>
          </div>
          <p className="text-[#9A8B78] text-sm">© 2024 Michelle Choe</p>
        </div>
      </footer>

      {/* Hidden Admin Link */}
      <Link 
        href="/dashboard" 
        className="fixed bottom-4 right-4 w-10 h-10 rounded-full bg-[#E8DFD0] flex items-center justify-center text-[#7D6D5A] hover:bg-[#D4C4A8] transition-colors opacity-30 hover:opacity-100"
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
