"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, PencilIcon } from "lucide-react";
import { studentApi } from "@/lib/api/student";
import { Student, UpdateStudentRequest } from "@/types/student";
import { createForm, isFutureDate } from "@/lib/utils";
import {
  updateStudentSchema,
  UpdateStudentFormValues,
} from "@/lib/validations/student";

interface UpdateStudentProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
}

export default function UpdateStudent({
  student,
  isOpen,
  onClose,
}: UpdateStudentProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const updateStudentMutation = useMutation({
    mutationFn: (data: UpdateStudentRequest) =>
      studentApi.updateStudent(student.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      onClose();
      updateStudentForm.reset();
      setError(null);
    },
  });

  const updateStudentForm = useForm<UpdateStudentFormValues>({
    resolver: zodResolver(updateStudentSchema),
    defaultValues: {
      name: "",
      surname: "",
      userName: "",
      birthDate: "",
      password: "",
    },
  });

  useEffect(() => {
    if (student && isOpen) {
      updateStudentForm.reset({
        name: "",
        surname: "",
        userName: "",
        birthDate: "",
        password: "",
      });
    }
  }, [student, isOpen, updateStudentForm]);

  const onUpdateSubmit = updateStudentForm.handleSubmit((data) => {
    const changedFields = createForm(data);

    if (Object.keys(changedFields).length > 0) {
      if (changedFields.birthDate) {
        isFutureDate(changedFields.birthDate);
      }
      updateStudentMutation.mutate(changedFields);
    } else {
      alert("No changes to update");
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={onUpdateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...updateStudentForm.register("name")}
                placeholder={student.name}
              />
              {updateStudentForm.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {updateStudentForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="surname">Surname</Label>
              <Input
                id="surname"
                {...updateStudentForm.register("surname")}
                placeholder={student.surname}
              />
              {updateStudentForm.formState.errors.surname && (
                <p className="text-sm text-destructive">
                  {updateStudentForm.formState.errors.surname.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userName">Username</Label>
            <Input
              id="userName"
              {...updateStudentForm.register("userName")}
              placeholder={student.userName}
            />
            {updateStudentForm.formState.errors.userName && (
              <p className="text-sm text-destructive">
                {updateStudentForm.formState.errors.userName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Birth Date</Label>
            <Input
              id="birthDate"
              type="date"
              {...updateStudentForm.register("birthDate")}
              placeholder={format(new Date(student.birthDate), "yyyy-MM-dd")}
            />
            {updateStudentForm.formState.errors.birthDate && (
              <p className="text-sm text-destructive">
                {updateStudentForm.formState.errors.birthDate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              {...updateStudentForm.register("password")}
              placeholder="New Password"
            />
            {updateStudentForm.formState.errors.password && (
              <p className="text-sm text-destructive">
                {updateStudentForm.formState.errors.password.message}
              </p>
            )}
          </div>

          {(updateStudentMutation.isError || error) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error || "Failed to update student. Please try again."}
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="submit"
              disabled={updateStudentMutation.isPending}
              className="cursor-pointer"
            >
              {updateStudentMutation.isPending
                ? "Updating..."
                : "Update Student"}
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
