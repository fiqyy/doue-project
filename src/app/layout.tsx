import type { Metadata, Viewport } from 'next';
// @ts-ignore Next.js handles global CSS imports at build time.
import '@/styles/globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#070709',
};

export const metadata: Metadata = {
  title: 'DOUÈ PROJECT',
  description: 'Aesthetic elegance in obsidian black and slate grey. Handcrafted luxury garments, double-faced virgin cashmere, deconstructed tailoring, and 3D architectural silhouettes.',
  keywords: ['luxury clothing brand', 'monochrome fashion', 'black and grey aesthetic', 'haute couture', 'cashmere overcoat', 'architectural tailoring'],
  openGraph: {
    title: 'DOUÈ PROJECT',
    description: 'Aesthetic elegance in obsidian black and slate grey. Explore Volume IV.',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
