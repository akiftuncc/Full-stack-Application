import { LessonLevel, LessonStatus } from "@/lib/constants/enums";

export interface Lesson {
  id: string;
  name: string;
  level: LessonLevel;
  duration: number;
  status: LessonStatus;
}

export interface LessonsResponse {
  data: Lesson[];
}

export interface ServerStatusResponse {
  message: string;
  statusCode: number;
}
