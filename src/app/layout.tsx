import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Quicksand, Nunito } from 'next/font/google';

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Phil Mok',
  description: "Phil Mok — software engineer. Conway's Game of Life, apps, and more.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${quicksand.variable} ${nunito.variable}`}>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
