import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { GeistSans } from 'geist/font/sans';

export const metadata: Metadata = {
  title: 'MADE Showcase',
  description: 'A showcase of MADE projects across all semesters.',
  icons: {
    icon: '/favicon.svg',
  },
  verification: {
    google: 'RWFe5NMAc3ZhhVCWATwJ8avTIMXrwI1h3ZqlgEuYn78',
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>{children}</body>
      <Analytics />
    </html>
  );
}
