"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { studentApi } from "@/lib/api/student";
import ProfileSkeleton from "@/components/skeletons/profile";
import TableRowSkeleton from "@/components/skeletons/lessons";
import { LessonLevel, LessonStatus } from "@/lib/constants/enums";
import { User } from "lucide-react";

interface StudentProfileProps {
  studentId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentProfile({
  studentId,
  isOpen,
  onClose,
}: StudentProfileProps) {
  const [activeTab, setActiveTab] = useState("profile");

  const {
    data: student,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["student", studentId],
    queryFn: () => studentApi.getStudent(studentId),
    enabled: isOpen && !!studentId,
  });

  const getLevelLabel = (level: LessonLevel) => {
    const labels = {
      [LessonLevel.BEGINNER]: "Beginner",
      [LessonLevel.INTERMEDIATE]: "Intermediate",
      [LessonLevel.ADVANCED]: "Advanced",
    };
    return labels[level];
  };

  const getStatusLabel = (status: LessonStatus) => {
    const labels = {
      [LessonStatus.ACTIVE]: "Active",
      [LessonStatus.INACTIVE]: "Inactive",
    };
    return labels[status];
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
          </DialogHeader>
          <ProfileSkeleton />
        </DialogContent>
      </Dialog>
    );
  }

  if (isError || !student) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <div className="text-red-500">
            {error instanceof Error
              ? error.message
              : "Failed to load student profile"}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={onClose}
              className="cursor-pointer"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Student Profile</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="profile"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="cursor-pointer">
              Profile
            </TabsTrigger>
            <TabsTrigger value="lessons" className="cursor-pointer">
              Lessons
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="py-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 dark:bg-primary/5 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>

              <h2 className="text-xl font-semibold mb-1">
                {student.data.name} {student.data.surname}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                @{student.data.userName}
              </p>

              <div className="text-left space-y-3 mt-6">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Name:
                  </span>
                  <span>{student.data.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Surname:
                  </span>
                  <span>{student.data.surname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Username:
                  </span>
                  <span>{student.data.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Birth Date:
                  </span>
                  <span>{format(new Date(student.data.birthDate), "PPP")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Member Since:
                  </span>
                  <span>{format(new Date(student.data.createdAt), "PPP")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Last Updated:
                  </span>
                  <span>{format(new Date(student.data.updatedAt), "PPP")}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lessons" className="py-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.data.lessons.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6">
                        This student is not enrolled in any lessons
                      </TableCell>
                    </TableRow>
                  ) : (
                    student.data.lessons.map((lesson) => (
                      <TableRow key={lesson.id}>
                        <TableCell className="font-medium">
                          {lesson.name}
                        </TableCell>
                        <TableCell>{lesson.duration} hours</TableCell>
                        <TableCell>{getLevelLabel(lesson.level)}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              lesson.status === LessonStatus.ACTIVE
                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                            }`}
                          >
                            {getStatusLabel(lesson.status)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
