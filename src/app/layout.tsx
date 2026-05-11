import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TAJ Assistant | Tax Administration Jamaica',
  description: 'AI-powered assistant for Tax Administration Jamaica services, driver licences, TRN, and more.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
        style={{ background: 'var(--taj-bg)', color: 'var(--taj-text)' }}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
