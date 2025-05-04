import axios from "axios";
import { ApiResponse } from "@/types/api";
import {
  PaginatedStudentsResponse,
  GetStudentResponse,
  CreateStudentRequest,
  CreateStudentResponse,
  UpdateStudentRequest,
  UpdateStudentResponse,
} from "@/types/student";
import { API_URL } from "../constants/api";
import Cookies from "js-cookie";

export const studentApi = {
  getStudents: async (
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedStudentsResponse> => {
    try {
      const token = Cookies.get("auth-token");
      const response = await axios.get<ApiResponse<PaginatedStudentsResponse>>(
        `${API_URL}/students?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to fetch students");
    }
  },

  getStudent: async (id: string): Promise<GetStudentResponse> => {
    try {
      const token = Cookies.get("auth-token");
      const response = await axios.get<ApiResponse<GetStudentResponse>>(
        `${API_URL}/students/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to fetch student details");
    }
  },

  createStudent: async (
    data: CreateStudentRequest
  ): Promise<CreateStudentResponse> => {
    try {
      const token = Cookies.get("auth-token");
      const response = await axios.post<ApiResponse<CreateStudentResponse>>(
        `${API_URL}/students`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to create student");
    }
  },

  updateStudent: async (
    id: string,
    data: UpdateStudentRequest
  ): Promise<UpdateStudentResponse> => {
    try {
      const token = Cookies.get("auth-token");
      const response = await axios.patch<ApiResponse<UpdateStudentResponse>>(
        `${API_URL}/students/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to update student");
    }
  },

  deleteStudent: async (id: string): Promise<void> => {
    try {
      const token = Cookies.get("auth-token");
      await axios.delete(`${API_URL}/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      throw new Error("Failed to delete student");
    }
  },
};
