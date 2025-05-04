"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StudentsTable from "./students/table";
import CreateStudent from "./students/create-student";

export default function Students() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <Card className="bg-card text-card-foreground border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">Students</CardTitle>
        <CreateStudent />
      </CardHeader>
      <CardContent>
        <StudentsTable
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </CardContent>
    </Card>
  );
}
