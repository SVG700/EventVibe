'use client';

import * as React from 'react';
import Link from 'next/link';
import { Users } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function MainNav() {
  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Users className="h-6 w-6 text-primary" />
        <span className="hidden font-bold sm:inline-block font-headline">
          {siteConfig.name}
        </span>
      </Link>
    </div>
  );
}
