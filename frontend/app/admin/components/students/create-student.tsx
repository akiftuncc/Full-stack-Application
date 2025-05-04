"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, PlusIcon } from "lucide-react";
import { studentApi } from "@/lib/api/student";
import { isFutureDate } from "@/lib/utils";
import {
  createStudentSchema,
  CreateStudentFormValues,
} from "@/lib/validations/student";

export default function CreateStudent() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const createStudentMutation = useMutation({
    mutationFn: studentApi.createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setIsCreateDialogOpen(false);
      createStudentForm.reset();
      setError(null);
    },
  });

  const createStudentForm = useForm<CreateStudentFormValues>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      name: "",
      surname: "",
      userName: "",
      birthDate: "",
      password: "",
    },
  });

  const onCreateSubmit = createStudentForm.handleSubmit((data) => {
    const formattedData = {
      ...data,
      birthDate: new Date(data.birthDate).toISOString(),
    };

    isFutureDate(formattedData.birthDate);
    createStudentMutation.mutate(formattedData);
  });

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center gap-1 cursor-pointer">
          <PlusIcon size={16} />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={onCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...createStudentForm.register("name")}
                placeholder="Name"
              />
              {createStudentForm.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {createStudentForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="surname">Surname</Label>
              <Input
                id="surname"
                {...createStudentForm.register("surname")}
                placeholder="Surname"
              />
              {createStudentForm.formState.errors.surname && (
                <p className="text-sm text-destructive">
                  {createStudentForm.formState.errors.surname.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userName">Username</Label>
            <Input
              id="userName"
              {...createStudentForm.register("userName")}
              placeholder="Username"
            />
            {createStudentForm.formState.errors.userName && (
              <p className="text-sm text-destructive">
                {createStudentForm.formState.errors.userName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Birth Date</Label>
            <Input
              id="birthDate"
              type="date"
              {...createStudentForm.register("birthDate")}
            />
            {createStudentForm.formState.errors.birthDate && (
              <p className="text-sm text-destructive">
                {createStudentForm.formState.errors.birthDate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...createStudentForm.register("password")}
              placeholder="Password"
            />
            {createStudentForm.formState.errors.password && (
              <p className="text-sm text-destructive">
                {createStudentForm.formState.errors.password.message}
              </p>
            )}
          </div>

          {(createStudentMutation.isError || error) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error || "Failed to create student. Please try again."}
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="submit"
              disabled={createStudentMutation.isPending}
              className="cursor-pointer"
            >
              {createStudentMutation.isPending
                ? "Creating..."
                : "Create Student"}
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
