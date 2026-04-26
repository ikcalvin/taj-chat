import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

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
    <html lang="en" className="dark">
      <body
        className={`${inter.className} antialiased bg-slate-950 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
