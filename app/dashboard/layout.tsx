'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Pipeline' },
  { href: '/dashboard/find-leads', label: 'Find Leads' },
  { href: '/dashboard/import', label: 'Import' },
  { href: '/dashboard/emails', label: 'Emails' },
];

// Simple password - change this to whatever you want
const DASHBOARD_PASSWORD = 'michelle2024';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = sessionStorage.getItem('dashboard_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DASHBOARD_PASSWORD) {
      sessionStorage.setItem('dashboard_auth', 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('dashboard_auth');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-[#9A8B78] text-sm tracking-wider">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 relative">
        {/* Subtle texture - NO z-index so it doesn't block inputs */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        
        <div className="relative max-w-md w-full z-10">
          {/* Decorative frame */}
          <div className="absolute -inset-4 border border-[#C9B99A]/20" />
          
          <div className="bg-[#FDFBF7] p-12 border border-[#E8E0D4]">
            <div className="text-center mb-10">
              <p className="text-[#9A8B78] tracking-[0.3em] uppercase text-xs mb-3">Private Access</p>
              <h1 className="font-serif text-2xl text-[#3D3225] font-light">Partnership Engine</h1>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 bg-[#F5F1EB] border border-[#E8E0D4] text-[#3D3225] placeholder:text-[#B8A888] focus:outline-none focus:border-[#C9B99A] transition-colors text-center tracking-wider"
                  autoFocus
                />
              </div>
              
              {error && (
                <p className="text-red-400 text-xs text-center tracking-wider">{error}</p>
              )}
              
              <button
                type="submit"
                className="w-full py-3 bg-[#3D3225] text-[#FDFBF7] text-xs tracking-[0.2em] uppercase hover:bg-[#2A231A] transition-colors"
              >
                Enter
              </button>
            </form>
            
            <div className="mt-10 text-center">
              <Link href="/" className="text-[#9A8B78] text-xs tracking-[0.15em] uppercase hover:text-[#3D3225] transition-colors">
                ← Return to site
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] relative">
      {/* Subtle texture - NO z-index so it doesn't block inputs */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Top Nav */}
      <header className="bg-[#FDFBF7] border-b border-[#E8E0D4] sticky top-0 z-40">
        <div className="px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-serif text-lg text-[#3D3225] tracking-wide">
              Michelle Choe
            </Link>
            <div className="w-[1px] h-4 bg-[#C9B99A]/40" />
            <span className="text-[#9A8B78] text-xs tracking-[0.15em] uppercase">Partnership Engine</span>
          </div>
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className="text-[#9A8B78] hover:text-[#3D3225] text-xs tracking-[0.1em] uppercase transition-colors"
            >
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="text-[#9A8B78] hover:text-[#3D3225] text-xs tracking-[0.1em] uppercase transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
        {/* Gold accent line */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C9B99A] to-transparent opacity-30" />
      </header>

      <div className="flex relative z-10">
        {/* Sidebar */}
        <aside className="w-52 bg-[#F5F1EB] border-r border-[#E8E0D4] min-h-[calc(100vh-73px)] p-6">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 text-xs tracking-[0.1em] uppercase transition-all ${
                    isActive 
                      ? 'bg-[#FDFBF7] text-[#3D3225] border-l-2 border-[#C9B99A]' 
                      : 'text-[#6B5D4D] hover:text-[#3D3225] hover:bg-[#FDFBF7]/50 border-l-2 border-transparent'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
