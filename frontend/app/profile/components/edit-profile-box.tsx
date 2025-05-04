"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userApi } from "@/lib/api/user";
import {
  updateProfileSchema,
  UpdateProfileFormValues,
} from "@/lib/validations/auth";
import { createForm } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { User } from "lucide-react";

interface EditProfileBoxProps {
  profile: {
    id: string;
    name: string;
    surname: string;
    userName: string;
    birthDate: string;
  };
  setIsEdit: (isEdit: boolean) => void;
}

export default function EditProfileBox({
  profile,
  setIsEdit,
}: EditProfileBoxProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      surname: "",
      userName: "",
      birthDate: "",
      password: "",
    },
  });

  const onSubmit = async (data: UpdateProfileFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const filteredData = createForm(data);

      if (Object.keys(filteredData).length === 0) {
        setError("No changes to save");
        setIsLoading(false);
        return;
      }

      await userApi.updateProfile(filteredData);

      setIsEdit(false);

      window.location.reload();
    } catch (error) {
      console.log("error");
      console.log(error);
      setError(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-primary/10 dark:bg-primary/5 rounded-full mx-auto mb-4 flex items-center justify-center">
        <User className="w-10 h-10 text-primary" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} placeholder={profile.name} />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="surname">Surname</Label>
          <Input
            id="surname"
            {...register("surname")}
            placeholder={profile.surname}
          />
          {errors.surname && (
            <p className="text-sm text-destructive">{errors.surname.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="userName">Username</Label>
          <Input
            id="userName"
            {...register("userName")}
            placeholder={profile.userName}
          />
          {errors.userName && (
            <p className="text-sm text-destructive">
              {errors.userName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate">Birth Date</Label>
          <Input
            id="birthDate"
            type="date"
            {...register("birthDate")}
            placeholder={profile.birthDate.split("T")[0]}
          />
          {errors.birthDate && (
            <p className="text-sm text-destructive">
              {errors.birthDate.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            placeholder="Password"
          />
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="flex pt-2">
          <Button type="submit" className="w-5/11" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
          <div className="w-1/11"></div>
          <Button
            type="button"
            variant="outline"
            className="w-5/11"
            onClick={() => setIsEdit(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
