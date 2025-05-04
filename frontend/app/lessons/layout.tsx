import React from "react";

export default function LessonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-screen-2xl mx-auto w-full">
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 p-4 md:p-6">
          <section className="bg-background shadow-sm rounded-lg">
            {children}
          </section>
        </div>
      </div>
    </div>
  );
}
