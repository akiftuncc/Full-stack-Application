import { z } from "zod";
import { LessonLevel, LessonStatus } from "../constants/enums";

export const createLessonSchema = z.object({
  name: z.string().min(1, "Name is required"),
  level: z.nativeEnum(LessonLevel),
  duration: z.number().int().min(1, "Duration must be at least 1"),
  status: z.nativeEnum(LessonStatus),
});

export type CreateLessonFormValues = z.infer<typeof createLessonSchema>;

export const updateLessonSchema = z.object({
  name: z.string().min(1, "Name is required").optional().or(z.literal("")),
  level: z.nativeEnum(LessonLevel).optional().or(z.literal("")),
  duration: z.number().optional().or(z.literal("")),
  status: z.nativeEnum(LessonStatus).optional().or(z.literal("")),
});

export type UpdateLessonFormValues = z.infer<typeof updateLessonSchema>;
