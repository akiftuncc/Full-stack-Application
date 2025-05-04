"use client";

import Link from "next/link";
import Image from "next/image";
import { Navigation } from "./components/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Routes } from "@/lib/constants/enums";

export function Navbar() {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  const hideNavigation =
    pathname === Routes.LOGIN || pathname === Routes.REGISTER;

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Site name */}
          <div
            className="flex-shrink-0 cursor-pointer flex items-center gap-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative w-8 h-8 overflow-hidden">
              <Image
                src="/logo.png"
                alt="Book logo"
                width={32}
                height={32}
                className={cn(
                  "transition-all duration-300",
                  isHovered ? "scale-110 rotate-6" : ""
                )}
              />
            </div>
            <Link href="/" className="text-xl font-bold text-primary">
              Online School
            </Link>
          </div>

          {!hideNavigation && <Navigation />}
        </div>
      </div>
    </nav>
  );
}
