"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AuthForm } from "@/components/auth/auth-form";
import { LessonSlider } from "@/components/lesson-slider";
import { Routes } from "@/lib/constants/enums";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth-store";
import { Divide } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const handleAuthModalOpen = (open: boolean) => {
    setIsModalOpen(open && !isAuthenticated);
  };

  const triggerLoginModal = () => {
    if (!isAuthenticated) {
      setIsModalOpen(!isModalOpen);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      setIsModalOpen(false);
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-transparent flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="md:w-1/2 mb-10 md:mb-0 relative">
          <Image
            src="/main-book.png"
            alt="Open Book"
            width={500}
            height={350}
            className="rounded-xl animate-float"
            priority
          />
        </div>

        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Expand Your Knowledge
          </h1>
          <p className="text-lg text-foreground max-w-md">
            Discover a world of learning with our extensive library of courses
            designed to help you master new skills and reach your goals.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            {!isAuthenticated && (
              <Dialog open={isModalOpen} onOpenChange={handleAuthModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={triggerLoginModal}
                    size="lg"
                    className="cursor-pointer"
                  >
                    Get Started
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-background">
                  <DialogTitle className="text-foreground">
                    Authentication
                  </DialogTitle>
                  <AuthForm
                    mode="login"
                    onAuthSuccess={() => setIsModalOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            )}

            <Button
              size="lg"
              variant="outline"
              className="cursor-pointer border-primary text-primary hover:bg-accent"
            >
              <Link href={Routes.LEARN_MORE}>Learn More</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Featured Lessons
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our carefully selected lessons to boost your learning journey
          </p>
        </div>

        <LessonSlider />

        <div className="mt-12 text-center">
          {isAuthenticated ? (
            <Button
              onClick={() => router.push(Routes.LESSONS)}
              size="lg"
              className="cursor-pointer"
            >
              Load More Lessons
            </Button>
          ) : (
            <Dialog open={isModalOpen} onOpenChange={handleAuthModalOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={triggerLoginModal}
                  size="lg"
                  className="cursor-pointer"
                >
                  Load More Lessons
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-background">
                <DialogTitle className="text-foreground">
                  Authentication
                </DialogTitle>
                <AuthForm
                  mode="login"
                  onAuthSuccess={() => setIsModalOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {!isAuthenticated && (
        <div className="bg-primary-foreground py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-primary mb-6">
              Ready to start your learning journey?
            </h2>
            <p className="text-primary/80 mb-8 max-w-2xl mx-auto">
              Join thousands of students already learning with our platform
            </p>

            <div className="mt-12 text-center">
              <Dialog open={isModalOpen} onOpenChange={handleAuthModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    onClick={triggerLoginModal}
                    variant="outline"
                    className="cursor-pointer bg-primary-foreground border-primary-foreground text-primary hover:bg-primary-foreground/90"
                  >
                    Sign Up Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-background">
                  <DialogTitle className="text-foreground">
                    Authentication
                  </DialogTitle>
                  <AuthForm
                    mode="register"
                    onAuthSuccess={() => setIsModalOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
