'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Pipeline', icon: '📊' },
  { href: '/dashboard/find-leads', label: 'Find Leads', icon: '🔍' },
  { href: '/dashboard/import', label: 'Import Leads', icon: '📥' },
  { href: '/dashboard/emails', label: 'Emails', icon: '✉️' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Top Nav */}
      <header className="bg-cream-50 border-b border-cream-200 sticky top-0 z-50">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-serif text-xl text-taupe-700">
              Michelle Choe
            </Link>
            <span className="text-taupe-300">|</span>
            <span className="text-taupe-500 text-sm tracking-wide">Partnership Engine</span>
          </div>
          <Link 
            href="/" 
            className="text-taupe-500 hover:text-taupe-700 text-sm transition-colors"
          >
            ← Back to Site
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-cream-100 border-r border-cream-200 min-h-[calc(100vh-65px)] p-6">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-cream-50 shadow-soft text-taupe-700' 
                      : 'text-taupe-500 hover:bg-cream-50/50 hover:text-taupe-700'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Stats */}
          <div className="mt-12 p-4 bg-cream-50 rounded-xl">
            <h3 className="text-taupe-500 text-xs tracking-wide uppercase mb-4">Quick Stats</h3>
            <div className="space-y-3" id="quick-stats">
              <div className="flex justify-between">
                <span className="text-taupe-500 text-sm">Total Leads</span>
                <span className="text-taupe-700 font-medium">-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-taupe-500 text-sm">Active</span>
                <span className="text-taupe-700 font-medium">-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-taupe-500 text-sm">Won</span>
                <span className="text-green-600 font-medium">-</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
