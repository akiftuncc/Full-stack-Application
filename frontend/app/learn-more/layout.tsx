import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn More | Online School",
  description: "Learn more about our platform and available routes",
};

export default function LearnMoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Learn More About Our Platform
      </h1>
      {children}
    </div>
  );
}
