'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ModeToggle } from '@/shared/ui/mode-toggle';
import { cn } from '@/lib/utils';

const navigationItems = [
  { href: '/', label: 'Dashboard', description: 'SSR' },
  { href: '/appointments', label: 'Appointments', description: 'SSG' },
  { href: '/patients', label: 'Patients', description: 'CSR' },
  { href: '/lab-results', label: 'Lab Results', description: 'ISR' },
];

interface NavigationProps {
  title: string;
  actionButton?: React.ReactNode;
}

export function Navigation({ title, actionButton }: NavigationProps) {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold">{title}</h1>
            <nav className="hidden md:flex items-center gap-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    <div className="flex flex-col items-center">
                      <span>{item.label}</span>
                      <span className="text-xs opacity-70">({item.description})</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            {actionButton}
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden border-t border-border">
          <nav className="flex overflow-x-auto p-2 gap-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label} ({item.description})
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}