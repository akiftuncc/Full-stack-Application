"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { lessonsApi } from "@/lib/api/lessons-api";
import { LessonStatus, Roles } from "@/lib/constants/enums";
import { useAuthStore } from "@/lib/store/auth-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LessonsTable from "./components/table";

export default function LessonsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    lessonId: "",
  });
  const pageSize = 10;
  const { user } = useAuthStore();
  const isAdmin = user?.role === Roles.ADMIN;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["lessons", currentPage],
    queryFn: () => lessonsApi.getPaginatedLessons(currentPage, pageSize),
  });

  const lessons = data?.data || [];
  const totalPages = data ? Math.ceil(data.meta.total / data.meta.limit) : 1;

  const handleRegisterLesson = async (
    lessonId: string,
    isRegistered: boolean
  ) => {
    try {
      if (isRegistered) {
        await lessonsApi.unregisterLesson(lessonId);
        refetch();
      } else {
        const lesson = lessons.find((l) => l.id === lessonId);
        if (lesson && lesson.status === LessonStatus.INACTIVE) {
          setConfirmDialog({
            isOpen: true,
            lessonId,
          });
          return;
        }

        await lessonsApi.registerLesson({ id: lessonId });
        refetch();
      }
    } catch (err) {
      console.error("Failed to update registration", err);
    }
  };

  const confirmInactiveRegistration = async () => {
    try {
      await lessonsApi.registerLesson({ id: confirmDialog.lessonId });
      setConfirmDialog({ isOpen: false, lessonId: "" });
      refetch();
    } catch (err) {
      console.error("Failed to register for inactive lesson", err);
    }
  };

  const cancelInactiveRegistration = () => {
    setConfirmDialog({ isOpen: false, lessonId: "" });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isError) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-destructive/10 text-destructive border border-destructive/20 px-4 py-3 rounded">
          Error:{" "}
          {error instanceof Error ? error.message : "Failed to fetch lessons"}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-foreground text-center">
        Lessons
      </h1>

      <LessonsTable
        lessons={lessons}
        isLoading={isLoading}
        isAdmin={isAdmin}
        handleRegisterLesson={handleRegisterLesson}
      />

      <div className="flex justify-center mt-6 space-x-2">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
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
            disabled={isLoading}
            className="cursor-pointer"
          >
            {page}
          </Button>
        ))}

        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          variant="outline"
          size="sm"
          className="cursor-pointer"
        >
          Next
        </Button>
      </div>

      <Dialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) => !open && cancelInactiveRegistration()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inactive Lesson Registration</DialogTitle>
            <DialogDescription>
              This lesson is currently inactive. Would you still like to
              register for it? Once the lesson becomes active, we'll notify you
              by email.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={cancelInactiveRegistration}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmInactiveRegistration}
              className="cursor-pointer"
            >
              Register Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
