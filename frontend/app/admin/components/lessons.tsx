"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LessonsTable from "./lessons/table";
import CreateLesson from "./lessons/create-lesson";

export default function Lessons() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <Card className="bg-card text-card-foreground border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">Lessons</CardTitle>
        <CreateLesson />
      </CardHeader>
      <CardContent>
        <LessonsTable
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </CardContent>
    </Card>
  );
}
