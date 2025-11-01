import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: {
    default: 'RR Realty Hub - Find Your Dream Property',
    template: '%s | RR Realty Hub',
  },
  description: 'Find your dream property with RR Realty Hub. Advanced search for homes, apartments, and land for sale or rent.',
  openGraph: {
    title: 'RR Realty Hub',
    description: 'Find your dream property with RR Realty Hub. Advanced search for homes, apartments, and land for sale or rent.',
    type: 'website',
    url: 'https://rerealty.example.com', // Replace with actual domain
    siteName: 'RR Realty Hub',
  },
  twitter: {
    card: 'summary_large_image',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased", "min-h-screen bg-background font-sans")}>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
