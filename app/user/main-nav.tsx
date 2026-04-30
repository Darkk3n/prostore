'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const links = [
    {
        title: 'Profile',
        href: '/user/profile',
    },
    {
        title: 'Orders',
        href: '/user/orders',
    },
];

const MainNav = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const pathName = usePathname();
    return (
        <nav
            className={cn('flex items-center space-x-4 lg:space-x-6', className)}
            {...props}
        >
            {links.map((l) => (
                <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                        'text-sm font-medium transition-colors hover:text-primary',
                        pathName.includes(l.href) ? '' : 'text-muted-foreground',
                    )}
                >
                    {l.title}
                </Link>
            ))}
        </nav>
    );
};

export default MainNav;
