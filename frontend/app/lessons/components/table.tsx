"use client";

import React, { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Lesson } from "@/types/lesson";
import { LessonLevel, LessonStatus, Roles } from "@/lib/constants/enums";
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
import LessonDetailModal from "@/components/lesson-detail-modal";

interface LessonsTableProps {
  lessons: Lesson[];
  isLoading: boolean;
  isAdmin: boolean;
  handleRegisterLesson: (lessonId: string, isRegistered: boolean) => void;
}

export default function LessonsTable({
  lessons,
  isLoading,
  isAdmin,
  handleRegisterLesson,
}: LessonsTableProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const getStatusClass = (status: LessonStatus) => {
    return status === LessonStatus.ACTIVE
      ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
      : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300";
  };

  const handleViewLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLesson(null);
  };

  return (
    <>
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Duration (hour)</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Last Update</TableHead>
              {!isAdmin && <TableHead>Action</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <TableRowSkeleton key={index} />
                ))
              : lessons.map((lesson) => (
                  <TableRow
                    key={lesson.id}
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleViewLesson(lesson)}
                  >
                    <TableCell>
                      <Image
                        src="/each-book.png"
                        alt="Lesson"
                        width={32}
                        height={32}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {lesson.name}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {lesson.duration}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {getLevelLabel(lesson.level)}
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
                    <TableCell className="text-foreground">
                      {lesson._count?.users || 0}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {format(new Date(lesson.createdAt), "PPP")}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {format(new Date(lesson.updatedAt), "PPP")}
                    </TableCell>
                    {!isAdmin && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRegisterLesson(
                              lesson.id,
                              lesson.isRegistered || false
                            );
                          }}
                          variant={
                            lesson.isRegistered ? "destructive" : "default"
                          }
                          size="sm"
                          className="cursor-pointer"
                        >
                          {lesson.isRegistered ? "Unregister" : "Register"}
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {selectedLesson && (
        <LessonDetailModal
          lessonId={selectedLesson.id}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          isRegistered={selectedLesson.isRegistered || false}
          onRegister={handleRegisterLesson}
        />
      )}
    </>
  );
}
