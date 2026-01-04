'use client';

import { useFirebase } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, Users } from 'lucide-react';
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AuthButton } from '@/components/auth-button';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useFirebase();
  const router = useRouter();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = sessionStorage.getItem('userRole');
      setUserRole(role);
    }
  }, [pathname]);

  useEffect(() => {
    if (isUserLoading) {
      return; // Wait until user state is loaded
    }

    if (!user) {
      router.push('/login'); // Not logged in, redirect
      return;
    }

    if (!user.emailVerified) {
      // Logged in but email is not verified, redirect to verification page
      router.push(`/verify-email?email=${encodeURIComponent(user.email || '')}`);
      return;
    }

    // Role-based redirection
    if (userRole) {
      if(userRole === 'organizer' && !pathname.startsWith('/organizer')) {
          // If organizer is not on an organizer page, maybe redirect them? Or just control nav.
          // For now, let's assume nav control is enough.
      }
      if(userRole === 'participant' && pathname.startsWith('/organizer')) {
          router.push('/events'); // Participants can't access organizer routes
      }
    }

  }, [user, isUserLoading, router, userRole, pathname]);

  if (isUserLoading || !user || !user.emailVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  const navItems = siteConfig.mainNav.filter(item => {
    if (!item.role) return false; // Don't show public links in sidebar
    return item.role === userRole;
  });

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Users className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block font-headline">
              Event Vibe
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={userRole === 'organizer' ? '/organizer/dashboard' : '/events'}>Dashboard</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             {userRole === 'organizer' && (
               <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <Link href="/organizer/create-event">Create Event</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
             )}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/profile">Profile</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          {/* Logout is handled by AuthButton in the header */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 w-full border-b bg-background">
          <div className="container flex h-16 items-center">
            <SidebarTrigger className="md:hidden" />
            <div className="flex flex-1 items-center justify-end space-x-4">
              <AuthButton />
            </div>
          </div>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
