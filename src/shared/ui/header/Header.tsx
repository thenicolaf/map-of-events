'use client';

import { Bell, MessageCircle, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ModeToggle } from '@/shared/ui/mode-toggle';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Sidebar } from '@/shared/ui/sidebar';
import { PatientSearch } from './PatientSearch';

export function Header() {
  return (
    <header className="bg-background border-b border-border">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar />
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold">MediCare</h1>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-4 lg:mx-8 hidden sm:block">
            <PatientSearch />
          </div>

          {/* Right side - Actions and Profile */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Mobile Search */}
            <div className="sm:hidden">
              <PatientSearch isMobile />
            </div>

            {/* Theme Toggle */}
            <ModeToggle />

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative hidden sm:flex">
              <Bell className="h-5 w-5" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                3
              </Badge>
            </Button>

            {/* Messages */}
            <Button variant="ghost" size="icon" className="relative hidden sm:flex">
              <MessageCircle className="h-5 w-5" />
              <Badge
                variant="secondary"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                2
              </Badge>
            </Button>

            {/* User Profile */}
            <div className="flex items-center gap-3 ml-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/dr-sarah-johnson.jpg" alt="Dr. Sarah Johnson" />
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
              <div className="hidden lg:block">
                <p className="text-sm font-medium">Dr. Sarah Johnson</p>
                <p className="text-xs text-muted-foreground">Cardiologist</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}