import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Admin Command',
  description: 'Strategic Minds operator hub for systems, workflows, automation, and controlled AI execution.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Admin Command',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: '#030303',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
