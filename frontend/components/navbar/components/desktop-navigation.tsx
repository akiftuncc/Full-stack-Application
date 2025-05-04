"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, User } from "lucide-react";
import { AuthButton } from "@/components/auth-button";
import { ModeToggle } from "@/components/mode-toggle";

interface DesktopNavigationProps {
  isClient: boolean;
}

export function DesktopNavigation({ isClient }: DesktopNavigationProps) {
  return (
    <div className="hidden md:flex items-center space-x-1">
      <ModeToggle />
      <Button variant="ghost" size="sm" asChild>
        <Link href="/lessons">
          <BookOpen className="h-4 w-4 mr-2" />
          <span>Lessons</span>
        </Link>
      </Button>

      <Button variant="ghost" size="sm" asChild>
        <Link href="/profile">
          <User className="h-4 w-4 mr-2" />
          <span>Profile</span>
        </Link>
      </Button>

      {/* Conditional auth button for desktop */}
      {isClient && <AuthButton />}
    </div>
  );
}
