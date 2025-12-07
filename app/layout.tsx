import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Michelle Choe | UGC Creator & Lifestyle Storyteller',
  description: 'Lifestyle and UGC creator crafting aesthetic, authentic content for brands. Past partners include Pottery Barn, YSL, Maybelline, Target, and Jo Malone.',
  keywords: ['UGC creator', 'lifestyle content', 'brand partnerships', 'influencer', 'Michelle Choe'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
