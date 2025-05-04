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
import { Checkbox } from "@/components/ui/checkbox";
import { Roles, Routes } from "@/lib/constants/enums";
import { RegisterRequest } from "@/types/auth";
import { useRouter } from "next/navigation";
import { registerSchema, RegisterFormValues } from "@/lib/validations/auth";
import { isFutureDate } from "@/lib/utils";

export function RegisterForm() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      surname: "",
      userName: "",
      birthDate: "",
      password: "",
      role: Roles.USER,
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      const { access_token } = data;
      const decodedToken = authApi.decodeToken(access_token);
      setAuth(access_token, {
        id: decodedToken.sub,
        userName: registerForm.getValues("userName"),
        role: decodedToken.role as Roles,
      });
      if (decodedToken.role === Roles.ADMIN) {
        router.push(Routes.ADMIN);
      } else {
        router.push(Routes.PROFILE);
      }
    },
  });

  const onRegisterSubmit = registerForm.handleSubmit((data) => {
    const formattedData = {
      ...data,
      birthDate: new Date(data.birthDate).toISOString(),
    };
    isFutureDate(formattedData.birthDate);
    registerMutation.mutate(formattedData);
  });

  return (
    <Card className="w-full bg-card text-card-foreground border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Create an account</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your information to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onRegisterSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Name
              </Label>
              <Input
                id="name"
                {...registerForm.register("name")}
                placeholder="Name"
                className="bg-background text-foreground border-input"
              />
              {registerForm.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {registerForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="surname" className="text-foreground">
                Surname
              </Label>
              <Input
                id="surname"
                {...registerForm.register("surname")}
                placeholder="Surname"
                className="bg-background text-foreground border-input"
              />
              {registerForm.formState.errors.surname && (
                <p className="text-sm text-destructive">
                  {registerForm.formState.errors.surname.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userName" className="text-foreground">
              Username
            </Label>
            <Input
              id="userName"
              {...registerForm.register("userName")}
              placeholder="Username"
              className="bg-background text-foreground border-input"
            />
            {registerForm.formState.errors.userName && (
              <p className="text-sm text-destructive">
                {registerForm.formState.errors.userName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate" className="text-foreground">
              Birth Date
            </Label>
            <Input
              id="birthDate"
              type="date"
              {...registerForm.register("birthDate")}
              className="bg-background text-foreground border-input"
            />
            {registerForm.formState.errors.birthDate && (
              <p className="text-sm text-destructive">
                {registerForm.formState.errors.birthDate.message}
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
              {...registerForm.register("password")}
              placeholder="Password"
              className="bg-background text-foreground border-input"
            />
            {registerForm.formState.errors.password && (
              <p className="text-sm text-destructive">
                {registerForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="adminRole"
              onCheckedChange={(checked) => {
                registerForm.setValue(
                  "role",
                  checked ? Roles.ADMIN : Roles.USER
                );
              }}
              className="border-input"
            />
            <Label
              htmlFor="adminRole"
              className="text-sm font-medium text-foreground"
            >
              Register as admin
            </Label>
          </div>

          {registerMutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Registration failed. Please try again.
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? "Registering..." : "Register"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
