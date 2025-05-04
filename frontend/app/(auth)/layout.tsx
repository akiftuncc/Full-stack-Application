"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-foreground">
            Welcome to Online School
          </h1>
          {children}
        </div>
      </div>
    </QueryClientProvider>
  );
}
