import { PaginationMeta } from "./api";
import { Lesson } from "./lesson";

export interface Student {
  id: string;
  name: string;
  surname: string;
  birthDate: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
  lessons: Lesson[];
}

export interface PaginatedStudentsResponse {
  data: Student[];
  meta: PaginationMeta;
}

export interface GetStudentResponse {
  data: Student;
}

export interface CreateStudentRequest {
  name: string;
  surname: string;
  userName: string;
  birthDate: string;
  password: string;
}

export interface CreateStudentResponse {
  data: Student;
}

export interface UpdateStudentRequest {
  name?: string;
  surname?: string;
  userName?: string;
  birthDate?: string;
  password?: string;
  role?: string;
}

export interface UpdateStudentResponse {
  data: Student;
}
