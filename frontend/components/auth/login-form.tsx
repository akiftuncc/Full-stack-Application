"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth-api";
import { useAuthStore } from "@/lib/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Roles, Routes } from "@/lib/constants/enums";
import { LoginRequest } from "@/types/auth";
import { useRouter } from "next/navigation";
import { loginSchema, LoginFormValues } from "@/lib/validations/auth";

export function LoginForm() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      const { access_token } = data;
      const decodedToken = authApi.decodeToken(access_token);
      setAuth(access_token, {
        id: decodedToken.sub,
        userName: loginForm.getValues("userName"),
        role: decodedToken.role as Roles,
      });
      router.push(Routes.HOME);
    },
  });

  const onLoginSubmit = loginForm.handleSubmit((data) => {
    loginMutation.mutate(data);
  });

  return (
    <Card className="w-full bg-card text-card-foreground border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Login</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your credentials to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onLoginSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userName" className="text-foreground">
              Username
            </Label>
            <Input
              id="userName"
              {...loginForm.register("userName")}
              placeholder="Username"
              className="bg-background text-foreground border-input"
            />
            {loginForm.formState.errors.userName && (
              <p className="text-sm text-destructive">
                {loginForm.formState.errors.userName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              {...loginForm.register("password")}
              placeholder="Password"
              className="bg-background text-foreground border-input"
            />
            {loginForm.formState.errors.password && (
              <p className="text-sm text-destructive">
                {loginForm.formState.errors.password.message}
              </p>
            )}
          </div>

          {loginMutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Login failed. Please check your credentials.
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
