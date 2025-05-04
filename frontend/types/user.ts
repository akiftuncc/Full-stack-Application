import { Roles } from "@/lib/constants/enums";

export interface User {
  id: string;
  name: string;
  surname: string;
  userName: string;
  birthDate: string;
  role: Roles;
  createdAt: string;
  updatedAt: string;
}

export interface GetProfileResponse extends User {}

export interface UpdateProfileRequest {
  name?: string;
  surname?: string;
  birthDate?: string;
  password?: string;
  userName?: string;
}

export interface UpdateProfileResponse extends User {}
