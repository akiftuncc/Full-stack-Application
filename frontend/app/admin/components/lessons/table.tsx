"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import TableRowSkeleton from "@/components/skeletons/lessons";
import { lessonsApi } from "@/lib/api/lessons-api";
import { Lesson } from "@/types/lesson";
import UpdateLesson from "./update-lesson";
import LessonInfo from "./lesson-info";
import { LessonLevel, LessonStatus } from "@/lib/constants/enums";

interface LessonsTableProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export default function LessonsTable({
  currentPage,
  setCurrentPage,
}: LessonsTableProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const limit = 10;

  const {
    data: lessonsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["lessons", currentPage, limit],
    queryFn: () => lessonsApi.getPaginatedLessons(currentPage, limit),
  });

  const deleteLessonMutation = useMutation({
    mutationFn: lessonsApi.deleteLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });

  const lessons = lessonsData?.data || [];
  const totalPages = lessonsData?.meta?.totalPages || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsUpdateModalOpen(true);
  };

  const handleViewInfo = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsInfoModalOpen(true);
  };

  const handleDeleteLesson = (lessonId: string) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      deleteLessonMutation.mutate(lessonId);
    }
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedLesson(null);
  };

  const handleCloseInfoModal = () => {
    setIsInfoModalOpen(false);
    setSelectedLesson(null);
  };

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

  const getLevelClass = (level: LessonLevel) => {
    switch (level) {
      case LessonLevel.BEGINNER:
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
      case LessonLevel.INTERMEDIATE:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300";
      case LessonLevel.ADVANCED:
        return "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300";
      default:
        return "";
    }
  };

  const getStatusClass = (status: LessonStatus) => {
    return status === LessonStatus.ACTIVE
      ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
      : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300";
  };

  return (
    <div>
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: limit }).map((_, index) => (
                <TableRowSkeleton key={index} />
              ))
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-destructive"
                >
                  Error loading lessons: {(error as Error).message}
                </TableCell>
              </TableRow>
            ) : lessons.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground"
                >
                  No lessons found
                </TableCell>
              </TableRow>
            ) : (
              lessons.map((lesson: Lesson) => (
                <TableRow
                  key={lesson.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleViewInfo(lesson)}
                >
                  <TableCell className="text-foreground">{lesson.id}</TableCell>
                  <TableCell className="text-foreground">
                    {lesson.name}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {lesson.duration} hours
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getLevelClass(
                        lesson.level
                      )}`}
                    >
                      {getLevelLabel(lesson.level)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusClass(
                        lesson.status
                      )}`}
                    >
                      {getStatusLabel(lesson.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditLesson(lesson);
                        }}
                        className="cursor-pointer"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLesson(lesson.id);
                        }}
                        className="cursor-pointer"
                        disabled={deleteLessonMutation.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && !isError && totalPages > 0 && (
        <div className="flex justify-center mt-6 space-x-2">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            className="cursor-pointer"
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              onClick={() => handlePageChange(page)}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              className="cursor-pointer"
            >
              {page}
            </Button>
          ))}

          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            className="cursor-pointer"
          >
            Next
          </Button>
        </div>
      )}

      {selectedLesson && (
        <UpdateLesson
          lesson={selectedLesson}
          isOpen={isUpdateModalOpen}
          onClose={handleCloseUpdateModal}
        />
      )}

      {selectedLesson && (
        <LessonInfo
          lessonId={selectedLesson.id}
          isOpen={isInfoModalOpen}
          onClose={handleCloseInfoModal}
        />
      )}
    </div>
  );
}
