'use client';

import { MainNav } from '@/components/main-nav';
import { MobileNav } from '@/components/mobile-nav';
import { AuthButton } from '@/components/auth-button';
import { Button } from './ui/button';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function Header() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client
    if (typeof window !== 'undefined') {
      const role = sessionStorage.getItem('userRole');
      setUserRole(role);
    }
  }, [pathname]); // Re-check on route change

  // Filter nav items based on role
  const navItems = siteConfig.mainNav.filter(item => {
    if (!item.role) return true; // always show non-role-specific items
    if (!userRole) return item.role !== 'organizer' && item.role !== 'participant'; // Show public links if not logged in
    return item.role === userRole;
  });

  // Filter out Demo and Contact for logged-in users from main nav area for cleaner UI
  const mainNavItems = navItems.filter(item => item.href !== '/demo' && item.href !== '/contact');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden md:flex items-center space-x-1">
            {mainNavItems.map((item) => (
                <Button variant="ghost" asChild key={item.href}>
                    <Link href={item.href}>{item.title}</Link>
                </Button>
            ))}
          </nav>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
