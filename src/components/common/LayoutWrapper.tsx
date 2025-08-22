'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import Footer from './Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Pages that should not have navigation and footer
  const excludedPaths = [
    '/auth/login',
    '/auth/signup',
    '/dashboard',
    '/agreements'
  ];
  
  const shouldShowLayout = !excludedPaths.some(path => pathname.startsWith(path));

  if (!shouldShowLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Navigation />
      <main>{children}</main>
      <Footer />
    </>
  );
}
