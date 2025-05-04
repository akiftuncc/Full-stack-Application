"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { lessonsApi } from "@/lib/api/lessons-api";
import { Lesson, UpdateLessonRequest } from "@/types/lesson";
import { LessonLevel, LessonStatus } from "@/lib/constants/enums";

interface UpdateLessonProps {
  lesson: Lesson;
  isOpen: boolean;
  onClose: () => void;
}

export default function UpdateLesson({
  lesson,
  isOpen,
  onClose,
}: UpdateLessonProps) {
  const queryClient = useQueryClient();

  const updateLessonMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLessonRequest }) =>
      lessonsApi.updateLesson(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      onClose();
    },
  });

  const updateLessonForm = useForm<UpdateLessonRequest>({
    defaultValues: {
      name: lesson.name,
      duration: lesson.duration,
      level: lesson.level,
      status: lesson.status,
    },
  });

  const onUpdateSubmit = updateLessonForm.handleSubmit((data) => {
    updateLessonMutation.mutate({ id: lesson.id, data });
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Lesson</DialogTitle>
        </DialogHeader>
        <form onSubmit={onUpdateSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...updateLessonForm.register("name", { required: true })}
              defaultValue=""
              placeholder={lesson.name}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (hours)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              {...updateLessonForm.register("duration", {
                required: true,
                valueAsNumber: true,
                min: 1,
              })}
              defaultValue=""
              placeholder={lesson.duration.toString()}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Select
              defaultValue={lesson.level}
              onValueChange={(value) =>
                updateLessonForm.setValue("level", value as LessonLevel)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={LessonLevel.BEGINNER}>Beginner</SelectItem>
                  <SelectItem value={LessonLevel.INTERMEDIATE}>
                    Intermediate
                  </SelectItem>
                  <SelectItem value={LessonLevel.ADVANCED}>Advanced</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              defaultValue={lesson.status}
              onValueChange={(value) =>
                updateLessonForm.setValue("status", value as LessonStatus)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={LessonStatus.ACTIVE}>Active</SelectItem>
                  <SelectItem value={LessonStatus.INACTIVE}>
                    Inactive
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {updateLessonMutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to update lesson. Please try again.
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="submit"
              disabled={updateLessonMutation.isPending}
              className="cursor-pointer"
            >
              {updateLessonMutation.isPending ? "Updating..." : "Update Lesson"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="cursor-pointer"
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
