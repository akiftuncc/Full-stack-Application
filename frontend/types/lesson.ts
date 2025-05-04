import { LessonLevel, LessonStatus } from "@/lib/constants/enums";
import { PaginationMeta } from "./api";

export interface Lesson {
  id: string;
  name: string;
  status: LessonStatus;
  level: LessonLevel;
  duration: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    users: number;
  };
  isRegistered?: boolean;
}

export interface PaginatedLessonsResponse {
  data: Lesson[];
  meta: PaginationMeta;
}

export interface GetLessonResponse {
  id: string;
  name: string;
  status: LessonStatus;
  level: LessonLevel;
  duration: number;
  createdAt: string;
  updatedAt: string;
  _count: {
    users: number;
  };
  isRegistered?: boolean;
}

export interface RegisterLessonRequest {
  id: string;
}

export interface CreateLessonRequest {
  name: string;
  duration: number;
  level: LessonLevel;
  status: LessonStatus;
}

export interface UpdateLessonRequest {
  name?: string;
  duration?: number;
  level?: LessonLevel;
  status?: LessonStatus;
}

export interface CreateLessonResponse extends Lesson {
  students: any[];
}

export interface UpdateLessonResponse extends Lesson {
  students: any[];
}

export interface LessonUser {
  assignedAt: string;
  user: {
    id: string;
    name: string;
    surname: string;
    userName: string;
  };
}

export interface PaginatedLessonUsersResponse {
  data: LessonUser[];
  meta: PaginationMeta;
}
