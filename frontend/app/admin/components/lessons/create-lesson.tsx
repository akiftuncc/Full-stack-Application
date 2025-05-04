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
  DialogTrigger,
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
import { AlertCircle, PlusIcon } from "lucide-react";
import { lessonsApi } from "@/lib/api/lessons-api";
import { CreateLessonRequest } from "@/types/lesson";
import { LessonLevel, LessonStatus } from "@/lib/constants/enums";

export default function CreateLesson() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const createLessonMutation = useMutation({
    mutationFn: lessonsApi.createLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      setIsCreateDialogOpen(false);
      createLessonForm.reset();
    },
  });

  const createLessonForm = useForm<CreateLessonRequest>({
    defaultValues: {
      name: "",
      duration: 1,
      level: LessonLevel.BEGINNER,
      status: LessonStatus.ACTIVE,
    },
  });

  const onCreateSubmit = createLessonForm.handleSubmit((data) => {
    createLessonMutation.mutate(data);
  });

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center gap-1 cursor-pointer">
          <PlusIcon size={16} />
          Add Lesson
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Lesson</DialogTitle>
        </DialogHeader>
        <form onSubmit={onCreateSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...createLessonForm.register("name", { required: true })}
              placeholder="Lesson Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (hours)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              {...createLessonForm.register("duration", {
                required: true,
                valueAsNumber: true,
                min: 1,
              })}
              placeholder="Duration"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Select
              defaultValue={LessonLevel.BEGINNER}
              onValueChange={(value) =>
                createLessonForm.setValue("level", value as LessonLevel)
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
              defaultValue={LessonStatus.ACTIVE}
              onValueChange={(value) =>
                createLessonForm.setValue("status", value as LessonStatus)
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

          {createLessonMutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to create lesson. Please try again.
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="submit"
              disabled={createLessonMutation.isPending}
              className="cursor-pointer"
            >
              {createLessonMutation.isPending ? "Creating..." : "Create Lesson"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
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
