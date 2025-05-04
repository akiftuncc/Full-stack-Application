"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BookOpen, User, Menu } from "lucide-react";
import { AuthButton } from "@/components/auth-button";
import { ModeToggle } from "@/components/mode-toggle";

interface MobileNavigationProps {
  isClient: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export function MobileNavigation({
  isClient,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: MobileNavigationProps) {
  return (
    <div className="md:hidden flex items-center">
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Online School</SheetTitle>
            <SheetDescription>Navigation menu</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col space-y-4 mt-6">
            <div className="flex justify-start pl-2">
              <ModeToggle />
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/lessons" onClick={() => setIsMobileMenuOpen(false)}>
                <BookOpen className="h-4 w-4 mr-2" />
                <span>Lessons</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                <User className="h-4 w-4 mr-2" />
                <span>Profile</span>
              </Link>
            </Button>

            {/* Conditional auth button for mobile */}
            {isClient && (
              <AuthButton
                onMobile={true}
                onClose={() => setIsMobileMenuOpen(false)}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
