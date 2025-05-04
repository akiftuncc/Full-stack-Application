import { z } from "zod";

export const createStudentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  surname: z.string().min(1, "Surname is required"),
  birthDate: z.string(),
  userName: z.string().min(6, "Username must be at least 6 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type CreateStudentFormValues = z.infer<typeof createStudentSchema>;

export const updateStudentSchema = z.object({
  name: z.string().min(1, "Name is required").optional().or(z.literal("")),
  surname: z
    .string()
    .min(1, "Surname is required")
    .optional()
    .or(z.literal("")),
  birthDate: z.string().optional().or(z.literal("")),
  userName: z
    .string()
    .min(6, "Username must be at least 6 characters")
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .or(z.literal("")),
});

export type UpdateStudentFormValues = z.infer<typeof updateStudentSchema>;
