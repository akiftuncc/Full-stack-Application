"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { AuthForm } from "@/components/auth/auth-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LogOut, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

interface AuthButtonProps {
  onMobile?: boolean;
  onClose?: () => void;
}

export function AuthButton({ onMobile = false, onClose }: AuthButtonProps) {
  const { isAuthenticated, logout, checkAuth } = useAuthStore();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const router = useRouter();

  const handleLoginClick = () => {
    setIsAuthDialogOpen(true);
    router.push("/");
  };

  const handleLogout = () => {
    logout();
    setIsAuthDialogOpen(false);
    router.push("/");
    if (onClose) {
      onClose();
    }
  };

  const handleMobileLoginClick = () => {
    if (onClose) {
      onClose();
    }
    handleLoginClick();
    setIsAuthDialogOpen(false);
    router.push("/");
  };

  return (
    <>
      {isAuthenticated ? (
        <Button
          className="cursor-pointer"
          variant="ghost"
          size="sm"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span>Logout</span>
        </Button>
      ) : (
        <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="cursor-pointer"
              variant="default"
              size="sm"
              onClick={onMobile ? handleMobileLoginClick : handleLoginClick}
            >
              <LogIn className="h-4 w-4 mr-2" />
              <span>Login</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-background text-foreground">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Authentication
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Login or create a new account
              </DialogDescription>
            </DialogHeader>
            <AuthForm mode="login" />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
