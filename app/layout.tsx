import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | MADE Showcase',
    default: 'MADE Showcase',
  },
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
      <body className={GeistSans.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
      <Analytics />
    </html>
  );
}
