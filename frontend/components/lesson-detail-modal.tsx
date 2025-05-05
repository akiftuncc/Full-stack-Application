"use client";

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
import { lessonsApi } from "@/lib/api/lessons-api";
import ProfileSkeleton from "@/components/skeletons/profile";
import { LessonLevel, LessonStatus } from "@/lib/constants/enums";
import { BookOpen } from "lucide-react";

interface LessonDetailModalProps {
  lessonId: string;
  isOpen: boolean;
  onClose: () => void;
  isRegistered: boolean;
  onRegister: (lessonId: string, isRegistered: boolean) => void;
}

export default function LessonDetailModal({
  lessonId,
  isOpen,
  onClose,
  isRegistered,
  onRegister,
}: LessonDetailModalProps) {
  const {
    data: lesson,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => lessonsApi.getLesson(lessonId),
    enabled: isOpen && !!lessonId,
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

  if (isError) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <div className="text-red-500">
            {error instanceof Error
              ? error.message
              : "Failed to load lesson information"}
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Lesson Information</DialogTitle>
        </DialogHeader>

        {lesson && (
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 flex items-center justify-center bg-primary/5 rounded-full">
              <BookOpen className="w-16 h-16 text-primary/70" />
            </div>

            <h2 className="text-xl font-semibold mb-4">{lesson.name}</h2>

            <div className="text-left space-y-3 mt-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Name:</span>
                <span>{lesson.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration:</span>
                <span>{lesson.duration} hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Level:</span>
                <span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      lesson.level === LessonLevel.BEGINNER
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        : lesson.level === LessonLevel.INTERMEDIATE
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                        : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                    }`}
                  >
                    {getLevelLabel(lesson.level)}
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      lesson.status === LessonStatus.ACTIVE
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    }`}
                  >
                    {getStatusLabel(lesson.status)}
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created:</span>
                <span>{format(new Date(lesson.createdAt), "PPP")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Updated:</span>
                <span>{format(new Date(lesson.updatedAt), "PPP")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Students Enrolled:</span>
                <span>{lesson._count?.users || 0}</span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between sm:justify-between gap-2">
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
