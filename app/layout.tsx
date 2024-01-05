import type { Metadata } from 'next';
import './globals.css';
import React from 'react';
import { feixenMono, inter, jetBrains, spaceGrotesk } from '@/app/fonts';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'DevFlow',
  description:
    'A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, algorithms, data structures, and more.',
  icons: {
    icon: '/assets/images/site-logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: 'primary-gradient',
          footerActionLink: 'primary-text-gradient hover:text-primary-500',
        },
      }}
    >
      <html lang='en'>
        <body
          className={`${inter.variable} ${jetBrains.variable} ${feixenMono.variable} ${spaceGrotesk}`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
