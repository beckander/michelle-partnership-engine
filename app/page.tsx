'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

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

const tiktokVideos = [
  { video: '/videos/tiktok1.mov', thumbnail: '/videos/thumb1.jpg' },
  { video: '/videos/tiktok2.mov', thumbnail: '/videos/thumb2.jpg' },
  { video: '/videos/tiktok3.mov', thumbnail: '/videos/thumb3.jpg' },
  { video: '/videos/tiktok4.mov', thumbnail: '/videos/thumb4.jpg' },
  { video: '/videos/tiktok5.mov', thumbnail: '/videos/thumb5.jpg' },
];

function VideoCard({ 
  video, 
  thumbnail, 
  position, 
  isPlaying,
  onPlay,
  onPause,
  onSelect
}: { 
  video: string; 
  thumbnail: string; 
  position: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSelect: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isCenter = position === 0;

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying && isCenter) {
        videoRef.current.muted = false;
        videoRef.current.play();
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isPlaying, isCenter]);

  const handleClick = () => {
    if (isCenter) {
      if (isPlaying) {
        onPause();
      } else {
        onPlay();
      }
    } else {
      onSelect();
    }
  };

  return (
    <div
      className={`relative aspect-[9/16] overflow-hidden bg-[#E8E0D4] transition-all duration-500 cursor-pointer ${
        isCenter ? 'scale-110 shadow-2xl z-10' : 'scale-90 opacity-60 hover:opacity-80'
      }`}
      onClick={handleClick}
    >
      <img
        src={thumbnail}
        alt="Video thumbnail"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isPlaying && isCenter ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
      <video
        ref={videoRef}
        src={video}
        loop
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isPlaying && isCenter ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {(!isPlaying || !isCenter) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
            <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      )}

      {isPlaying && isCenter && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          </div>
        </div>
      )}

      <div className="absolute bottom-3 right-3">
        <svg className="w-5 h-5 text-white drop-shadow-lg opacity-70" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
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

  const nextVideo = () => {
    setIsPlaying(false);
    setActiveIndex((prev) => (prev + 1) % tiktokVideos.length);
  };

  const prevVideo = () => {
    setIsPlaying(false);
    setActiveIndex((prev) => (prev - 1 + tiktokVideos.length) % tiktokVideos.length);
  };

  const selectVideo = (index: number) => {
    setActiveIndex(index);
    setIsPlaying(true);
  };

  const getOrderedVideos = () => {
    const result = [];
    const total = tiktokVideos.length;
    
    for (let offset = -2; offset <= 2; offset++) {
      const index = (activeIndex + offset + total) % total;
      result.push({
        ...tiktokVideos[index],
        originalIndex: index,
        position: offset,
      });
    }
    return result;
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#FDFBF7]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <Link href="/" className="font-serif text-xl tracking-wide text-[#3D3225]">
            Michelle Choe
          </Link>
          <div className="flex gap-8 items-center">
            <a href="#work" className="text-[#6B5D4D] hover:text-[#3D3225] transition-colors text-xs tracking-[0.2em] uppercase">
              Work
            </a>
            <a href="#brand-kit" className="text-[#6B5D4D] hover:text-[#3D3225] transition-colors text-xs tracking-[0.2em] uppercase">
              Press
            </a>
            <a 
              href="#contact" 
              className="px-5 py-2 border border-[#3D3225] text-[#3D3225] text-xs tracking-[0.15em] uppercase hover:bg-[#3D3225] hover:text-[#FDFBF7] transition-all duration-300"
            >
              Collaborate
            </a>
          </div>
        </div>
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C9B99A] to-transparent opacity-40" />
      </nav>

      {/* Hero Section - Compact */}
      <section className="pt-28 pb-12 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-16">
            {/* Left side - Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="flex-1"
            >
              <p className="text-[#9A8B78] tracking-[0.3em] uppercase text-xs mb-4">
                Lifestyle & Beauty Creator
              </p>
              <h1 className="font-serif text-5xl lg:text-6xl text-[#3D3225] mb-6 leading-[1.1] font-light">
                Michelle
                <br />
                <span className="italic">Choe</span>
              </h1>
              <p className="text-[#6B5D4D] leading-relaxed mb-8 max-w-sm font-light">
                Crafting authentic narratives for brands seeking 
                to connect with audiences who appreciate the 
                art of elevated living.
              </p>
              
              {/* Stats - Inline */}
              <div className="flex gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.platform}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                  >
                    <p className="font-serif text-2xl text-[#3D3225] font-light">{stat.count}</p>
                    <p className="text-[#9A8B78] text-xs tracking-[0.1em] uppercase">{stat.platform}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right side - Circular Mirror Frame Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              className="relative flex-shrink-0 mr-8"
            >
              {/* Bronze/Gold mirror frame */}
              <div className="relative w-80 h-80">
                {/* Outer bronze ring */}
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(145deg, #D4A574 0%, #8B6914 25%, #C9A227 50%, #8B6914 75%, #D4A574 100%)',
                    padding: '6px',
                  }}
                >
                  <div className="w-full h-full rounded-full bg-[#FDFBF7]" />
                </div>
                
                {/* Inner bronze ring */}
                <div 
                  className="absolute inset-3 rounded-full"
                  style={{
                    background: 'linear-gradient(145deg, #C9A227 0%, #8B6914 30%, #D4A574 50%, #8B6914 70%, #C9A227 100%)',
                    padding: '4px',
                  }}
                >
                  <div className="w-full h-full rounded-full bg-[#FDFBF7]" />
                </div>
                
                {/* Photo container */}
                <div className="absolute inset-6 rounded-full overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.1)]">
                  <img 
                    src="/michelle-photo.jpg" 
                    alt="Michelle Choe"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  
                  {/* Subtle shine overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Partners - Compact */}
      <section className="py-8 relative overflow-hidden border-y border-[#E8E0D4]">
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#FDFBF7] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#FDFBF7] to-transparent z-10" />
          
          {/* Scrolling track */}
          <div className="flex overflow-hidden">
            <motion.div
              className="flex gap-16 items-center"
              animate={{ x: [0, -1000] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear",
                },
              }}
            >
              {[...brandPartners, ...brandPartners, ...brandPartners].map((brand, index) => (
                <div
                  key={`${brand.name}-${index}`}
                  className="flex-shrink-0 h-8 w-28 flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                >
                  <img 
                    src={brand.logo} 
                    alt={brand.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.parentElement!.innerHTML = `<span class="text-[#6B5D4D] text-xs tracking-wider font-light">${brand.name}</span>`;
                    }}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Work Section - Video Carousel */}
      <section id="work" className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-10"
          >
            <p className="text-[#9A8B78] tracking-[0.3em] uppercase text-xs mb-3">Portfolio</p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#3D3225] font-light">
              Featured <span className="italic">Work</span>
            </h2>
          </motion.div>

          {/* TikTok Carousel */}
          <div className="mb-16">
            <p className="text-[#9A8B78] tracking-[0.2em] uppercase text-xs mb-6">Short Form</p>
            
            <div className="relative">
              <button
                onClick={prevVideo}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 bg-[#FDFBF7] border border-[#E8E0D4] flex items-center justify-center hover:border-[#C9B99A] transition-colors"
              >
                <svg className="w-4 h-4 text-[#3D3225]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={nextVideo}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 bg-[#FDFBF7] border border-[#E8E0D4] flex items-center justify-center hover:border-[#C9B99A] transition-colors"
              >
                <svg className="w-4 h-4 text-[#3D3225]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="flex justify-center items-center gap-3 px-12 overflow-hidden">
                <AnimatePresence mode="popLayout">
                  {getOrderedVideos().map((item) => (
                    <motion.div
                      key={item.originalIndex}
                      className="w-40 flex-shrink-0"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      layout
                    >
                      <VideoCard
                        video={item.video}
                        thumbnail={item.thumbnail}
                        position={item.position}
                        isPlaying={isPlaying && item.position === 0}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onSelect={() => selectVideo(item.originalIndex)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex justify-center gap-2 mt-6">
                {tiktokVideos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsPlaying(false);
                      setActiveIndex(index);
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      index === activeIndex ? 'bg-[#3D3225] w-4' : 'bg-[#D4C8B8]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* YouTube Video */}
          <div>
            <p className="text-[#9A8B78] tracking-[0.2em] uppercase text-xs mb-6">Long Form</p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex gap-8 items-center"
            >
              <div className="relative flex-shrink-0">
                <div className="absolute -inset-2 border border-[#C9B99A]/20" />
                <div className="relative w-96 aspect-video bg-[#E8E0D4] overflow-hidden">
                  <iframe
                    src="https://www.youtube.com/embed/1L3WDH6_KSM"
                    title="YouTube video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>

              <div className="max-w-sm">
                <h3 className="font-serif text-xl text-[#3D3225] font-light mb-3">
                  Extreme Room Transformation
                </h3>
                <p className="text-[#6B5D4D] font-light leading-relaxed mb-4 text-sm">
                  A complete Pinterest-inspired room makeover featuring Love Shack Fancy bedding, 
                  organization tips, and aesthetic decor finds.
                </p>
                <a 
                  href="https://www.youtube.com/watch?v=1L3WDH6_KSM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#3D3225] text-xs tracking-[0.15em] uppercase border-b border-[#C9B99A] pb-1 hover:border-[#3D3225] transition-colors"
                >
                  Watch on YouTube
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Kit Section - Compact */}
      <section id="brand-kit" className="py-16 px-8 bg-[#F5F1EB]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <p className="text-[#9A8B78] tracking-[0.3em] uppercase text-xs mb-3">For Brands</p>
            <h2 className="font-serif text-3xl text-[#3D3225] font-light">
              Press <span className="italic">Kit</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
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
                className="group p-6 bg-[#FDFBF7] border border-[#E8E0D4] hover:border-[#C9B99A] transition-all duration-500"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-serif text-lg text-[#3D3225] mb-1 font-light">{item.title}</h3>
                    <p className="text-[#9A8B78] text-sm font-light">{item.desc}</p>
                  </div>
                  <span className="text-[#C9B99A] group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form - Compact */}
      <section id="contact" className="py-16 px-8">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <p className="text-[#9A8B78] tracking-[0.3em] uppercase text-xs mb-3">Get in Touch</p>
            <h2 className="font-serif text-3xl text-[#3D3225] font-light">
              Let's <span className="italic">Collaborate</span>
            </h2>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 border border-[#E8E0D4]"
            >
              <div className="w-12 h-12 mx-auto mb-4 border border-[#C9B99A] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#C9B99A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-[#3D3225] mb-1 font-light">Thank you</h3>
              <p className="text-[#6B5D4D] font-light text-sm">I'll be in touch within 48 hours.</p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#6B5D4D] text-xs tracking-[0.15em] uppercase mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-0 py-2 bg-transparent border-0 border-b border-[#D4C8B8] text-[#3D3225] placeholder:text-[#B8A888] focus:outline-none focus:border-[#C9B99A] transition-colors font-light text-sm"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-[#6B5D4D] text-xs tracking-[0.15em] uppercase mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-0 py-2 bg-transparent border-0 border-b border-[#D4C8B8] text-[#3D3225] placeholder:text-[#B8A888] focus:outline-none focus:border-[#C9B99A] transition-colors font-light text-sm"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#6B5D4D] text-xs tracking-[0.15em] uppercase mb-2">Company</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-0 py-2 bg-transparent border-0 border-b border-[#D4C8B8] text-[#3D3225] placeholder:text-[#B8A888] focus:outline-none focus:border-[#C9B99A] transition-colors font-light text-sm"
                  placeholder="Brand or company name"
                />
              </div>
              <div>
                <label className="block text-[#6B5D4D] text-xs tracking-[0.15em] uppercase mb-2">Message</label>
                <textarea
                  required
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-0 py-2 bg-transparent border-0 border-b border-[#D4C8B8] text-[#3D3225] placeholder:text-[#B8A888] resize-none focus:outline-none focus:border-[#C9B99A] transition-colors font-light text-sm"
                  placeholder="Tell me about your project..."
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#3D3225] text-[#FDFBF7] text-xs tracking-[0.2em] uppercase hover:bg-[#2A231A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </section>

      {/* Footer - Compact */}
      <footer className="py-8 px-8 border-t border-[#E8E0D4]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-serif text-lg text-[#3D3225] font-light tracking-wide">Michelle Choe</p>
            <div className="flex gap-8">
              <a 
                href="https://www.youtube.com/c/MichelleChoe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#6B5D4D] hover:text-[#3D3225] transition-colors text-xs tracking-[0.15em] uppercase"
              >
                YouTube
              </a>
              <a 
                href="https://www.instagram.com/_michellechoe/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#6B5D4D] hover:text-[#3D3225] transition-colors text-xs tracking-[0.15em] uppercase"
              >
                Instagram
              </a>
              <a 
                href="https://www.tiktok.com/@_michellechoe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#6B5D4D] hover:text-[#3D3225] transition-colors text-xs tracking-[0.15em] uppercase"
              >
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
        className="fixed bottom-4 right-4 w-8 h-8 flex items-center justify-center text-[#C9B99A] opacity-20 hover:opacity-60 transition-opacity"
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
