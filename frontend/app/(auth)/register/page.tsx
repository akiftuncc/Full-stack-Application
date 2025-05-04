"use client";

import { RegisterForm } from "@/components/auth/register-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <>
      <RegisterForm />
      <p className="text-center mt-4 text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Login here
        </Link>
      </p>
    </>
  );
}
