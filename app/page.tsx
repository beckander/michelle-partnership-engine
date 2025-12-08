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
  { platform: 'YouTube', count: '37K' },
  { platform: 'Instagram', count: '9.7K' },
  { platform: 'TikTok', count: '15K' },
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
    <main className="min-h-screen bg-[#FDFBF7] relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.015] z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#FDFBF7]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <Link href="/" className="font-serif text-xl tracking-wide text-[#3D3225]">
            Michelle Choe
          </Link>
          <div className="flex gap-10 items-center">
            <a href="#work" className="text-[#6B5D4D] hover:text-[#3D3225] transition-colors text-xs tracking-[0.2em] uppercase">
              Work
            </a>
            <a href="#brand-kit" className="text-[#6B5D4D] hover:text-[#3D3225] transition-colors text-xs tracking-[0.2em] uppercase">
              Press
            </a>
            <a 
              href="#contact" 
              className="px-6 py-2.5 border border-[#3D3225] text-[#3D3225] text-xs tracking-[0.15em] uppercase hover:bg-[#3D3225] hover:text-[#FDFBF7] transition-all duration-300"
            >
              Collaborate
            </a>
          </div>
        </div>
      </nav>

      {/* Thin gold accent line */}
      <div className="fixed top-[72px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9B99A] to-transparent opacity-40 z-40" />

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <p className="text-[#9A8B78] tracking-[0.3em] uppercase text-xs mb-6">
                Lifestyle & Beauty Creator
              </p>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[#3D3225] mb-8 leading-[1.1] font-light">
                Michelle
                <br />
                <span className="italic">Choe</span>
              </h1>
              <p className="text-[#6B5D4D] text-lg leading-relaxed mb-10 max-w-md font-light">
                Crafting authentic narratives for brands seeking 
                to connect with audiences who appreciate the 
                art of elevated living.
              </p>
              
              {/* Stats */}
              <div className="flex gap-12">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.platform}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                  >
                    <p className="font-serif text-3xl text-[#3D3225] font-light">{stat.count}</p>
                    <p className="text-[#9A8B78] text-xs tracking-[0.15em] uppercase mt-1">{stat.platform}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right side - Photo */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              className="relative"
            >
              {/* Decorative frame */}
              <div className="absolute -inset-4 border border-[#C9B99A]/30" />
              <div className="absolute -inset-8 border border-[#C9B99A]/20" />
              
              {/* Photo container */}
              <div className="relative aspect-[4/5] bg-gradient-to-br from-[#E8E0D4] to-[#D4C8B8] overflow-hidden">
                <img 
                  src="/michelle-photo.jpg" 
                  alt="Michelle Choe"
                  className="w-full h-full object-cover mix-blend-normal"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {/* Subtle vignette */}
                <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(61,50,37,0.1)]" />
              </div>

              {/* Gold accent */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-[#C9B99A]/40" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Partners - Infinite Scroll Carousel */}
      <section className="py-20 bg-[#F5F1EB] relative overflow-hidden">
        {/* Top gold line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9B99A] to-transparent opacity-30" />
        
        <div className="mb-12">
          <p className="text-center text-[#9A8B78] tracking-[0.3em] uppercase text-xs">
            Trusted Partners
          </p>
        </div>

        {/* Infinite scroll container */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#F5F1EB] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#F5F1EB] to-transparent z-10" />
          
          {/* Scrolling track */}
          <div className="flex overflow-hidden">
            <motion.div
              className="flex gap-20 items-center"
              animate={{ x: [0, -1200] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 25,
                  ease: "linear",
                },
              }}
            >
              {/* Double the logos for seamless loop */}
              {[...brandPartners, ...brandPartners, ...brandPartners].map((brand, index) => (
                <div
                  key={`${brand.name}-${index}`}
                  className="flex-shrink-0 h-12 w-32 flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                >
                  <img 
                    src={brand.logo} 
                    alt={brand.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.parentElement!.innerHTML = `<span class="text-[#6B5D4D] text-sm tracking-wider font-light">${brand.name}</span>`;
                    }}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom gold line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9B99A] to-transparent opacity-30" />
      </section>

      {/* Featured Work */}
      <section id="work" className="py-28 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <p className="text-[#9A8B78] tracking-[0.3em] uppercase text-xs mb-4">Portfolio</p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#3D3225] font-light">
              Featured <span className="italic">Work</span>
            </h2>
          </motion.div>

          {/* Asymmetrical Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Large item */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="col-span-12 md:col-span-7 aspect-[4/3] bg-gradient-to-br from-[#E8E0D4] to-[#D4C8B8] relative group cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#3D3225]/0 group-hover:bg-[#3D3225]/20 transition-all duration-500" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <span className="text-[#FDFBF7] text-xs tracking-[0.2em] uppercase">Coming Soon</span>
              </div>
            </motion.div>

            {/* Small item */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="col-span-12 md:col-span-5 aspect-[4/3] bg-gradient-to-br from-[#D4C8B8] to-[#C9B99A] relative group cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#3D3225]/0 group-hover:bg-[#3D3225]/20 transition-all duration-500" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <span className="text-[#FDFBF7] text-xs tracking-[0.2em] uppercase">Coming Soon</span>
              </div>
            </motion.div>

            {/* Small item */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="col-span-12 md:col-span-5 aspect-[4/3] bg-gradient-to-br from-[#C9B99A] to-[#B8A888] relative group cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#3D3225]/0 group-hover:bg-[#3D3225]/20 transition-all duration-500" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <span className="text-[#FDFBF7] text-xs tracking-[0.2em] uppercase">Coming Soon</span>
              </div>
            </motion.div>

            {/* Large item */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="col-span-12 md:col-span-7 aspect-[4/3] bg-gradient-to-br from-[#E8E0D4] to-[#D4C8B8] relative group cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#3D3225]/0 group-hover:bg-[#3D3225]/20 transition-all duration-500" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <span className="text-[#FDFBF7] text-xs tracking-[0.2em] uppercase">Coming Soon</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Kit Section */}
      <section id="brand-kit" className="py-28 px-8 bg-[#F5F1EB]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-[#9A8B78] tracking-[0.3em] uppercase text-xs mb-4">For Brands</p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#3D3225] font-light">
              Press <span className="italic">Kit</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: 'Media Kit', desc: 'Rates, demographics & analytics' },
              { title: 'Previous Work', desc: 'Content examples & deliverables' },
            ].map((item, index) => (
              <motion.a
                key={item.title}
                href="#"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="group p-8 bg-[#FDFBF7] border border-[#E8E0D4] hover:border-[#C9B99A] transition-all duration-500"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-xl text-[#3D3225] mb-2 font-light">{item.title}</h3>
                    <p className="text-[#9A8B78] text-sm font-light">{item.desc}</p>
                  </div>
                  <span className="text-[#C9B99A] group-hover:translate-x-2 transition-transform duration-300">
                    →
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-28 px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-[#9A8B78] tracking-[0.3em] uppercase text-xs mb-4">Get in Touch</p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#3D3225] font-light">
              Let's <span className="italic">Collaborate</span>
            </h2>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 border border-[#E8E0D4]"
            >
              <div className="w-16 h-16 mx-auto mb-6 border border-[#C9B99A] flex items-center justify-center">
                <svg className="w-6 h-6 text-[#C9B99A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-[#3D3225] mb-2 font-light">Thank you</h3>
              <p className="text-[#6B5D4D] font-light">I'll be in touch within 48 hours.</p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[#6B5D4D] text-xs tracking-[0.15em] uppercase mb-3">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#D4C8B8] text-[#3D3225] placeholder:text-[#B8A888] focus:outline-none focus:border-[#C9B99A] transition-colors font-light"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-[#6B5D4D] text-xs tracking-[0.15em] uppercase mb-3">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#D4C8B8] text-[#3D3225] placeholder:text-[#B8A888] focus:outline-none focus:border-[#C9B99A] transition-colors font-light"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#6B5D4D] text-xs tracking-[0.15em] uppercase mb-3">Company</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#D4C8B8] text-[#3D3225] placeholder:text-[#B8A888] focus:outline-none focus:border-[#C9B99A] transition-colors font-light"
                  placeholder="Brand or company name"
                />
              </div>
              <div>
                <label className="block text-[#6B5D4D] text-xs tracking-[0.15em] uppercase mb-3">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#D4C8B8] text-[#3D3225] placeholder:text-[#B8A888] resize-none focus:outline-none focus:border-[#C9B99A] transition-colors font-light"
                  placeholder="Tell me about your project..."
                />
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#3D3225] text-[#FDFBF7] text-xs tracking-[0.2em] uppercase hover:bg-[#2A231A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 border-t border-[#E8E0D4]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="font-serif text-xl text-[#3D3225] font-light tracking-wide">Michelle Choe</p>
            <div className="flex gap-10">
              <a href="#" className="text-[#6B5D4D] hover:text-[#3D3225] transition-colors text-xs tracking-[0.15em] uppercase">
                YouTube
              </a>
              <a href="#" className="text-[#6B5D4D] hover:text-[#3D3225] transition-colors text-xs tracking-[0.15em] uppercase">
                Instagram
              </a>
              <a href="#" className="text-[#6B5D4D] hover:text-[#3D3225] transition-colors text-xs tracking-[0.15em] uppercase">
                TikTok
              </a>
            </div>
            <p className="text-[#9A8B78] text-xs tracking-wider">© 2024</p>
          </div>
        </div>
      </footer>

      {/* Hidden Admin Link */}
      <Link 
        href="/dashboard" 
        className="fixed bottom-6 right-6 w-10 h-10 flex items-center justify-center text-[#C9B99A] opacity-20 hover:opacity-60 transition-opacity"
        title="Dashboard"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </Link>
    </main>
  );
}
