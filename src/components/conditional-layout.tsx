
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginRoute = pathname === '/login';

  const showHeaderFooter = !isAdminRoute && !isLoginRoute;

  return (
    <div className="relative flex min-h-screen flex-col">
      {showHeaderFooter && <Header />}
      <main className="flex-1">{children}</main>
      {showHeaderFooter && <Footer />}
    </div>
  );
}
