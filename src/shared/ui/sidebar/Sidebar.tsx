'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, LayoutDashboard, Calendar, Users, FileText, FlaskConical, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const navigationItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, count: null },
  { href: '/appointments', label: 'My Appointments', icon: Calendar, count: 5 },
  { href: '/patients', label: 'Patients', icon: Users, count: 12 },
  { href: '/prescriptions', label: 'Prescriptions', icon: FileText, count: null },
  { href: '/lab-results', label: 'Lab Results', icon: FlaskConical, count: 3 },
  { href: '/settings', label: 'Settings', icon: Settings, count: null },
];

const summaryItems = [
  { label: 'Appointments', count: 8 },
  { label: 'Pending Results', count: 3 },
  { label: 'New Messages', count: 2 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r border-border h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <Button variant="ghost" size="sm" className="w-full justify-start p-0">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="text-sm text-muted-foreground">Medical Suite</span>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                {item.count && (
                  <Badge
                    variant={isActive ? "secondary" : "outline"}
                    className="h-5 px-2 text-xs"
                  >
                    {item.count}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Today's Summary */}
      <div className="p-4 border-t border-border">
        <div className="bg-primary rounded-lg p-4 text-primary-foreground">
          <h3 className="font-medium mb-3">Today&apos;s Summary</h3>
          <div className="space-y-2">
            {summaryItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm opacity-90">{item.label}</span>
                <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground h-5 px-2 text-xs">
                  {item.count}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}