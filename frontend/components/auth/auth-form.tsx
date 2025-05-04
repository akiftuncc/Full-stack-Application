"use client";

import { useState, useEffect } from "react";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/lib/store/auth-store";

type FormMode = "login" | "register";

export function AuthForm(props: {
  mode: FormMode;
  onAuthSuccess?: () => void;
}) {
  const [mode, setMode] = useState<FormMode>(props.mode);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && props.onAuthSuccess) {
      props.onAuthSuccess();
    }
  }, [isAuthenticated, props.onAuthSuccess]);

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs
        defaultValue={props.mode}
        onValueChange={(value) => setMode(value as FormMode)}
        className="text-foreground"
      >
        <TabsList className="grid w-full grid-cols-2 bg-muted">
          <TabsTrigger
            value="login"
            className="data-[state=active]:bg-background"
          >
            Login
          </TabsTrigger>
          <TabsTrigger
            value="register"
            className="data-[state=active]:bg-background"
          >
            Register
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
