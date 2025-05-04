"use client";

import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <LoginForm />
      <p className="text-center mt-4 text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Register here
        </Link>
      </p>
    </>
  );
}
