import axios from "axios";
import { ApiResponse } from "@/types/api";
import {
  PaginatedLessonsResponse,
  GetLessonResponse,
  RegisterLessonRequest,
  CreateLessonRequest,
  UpdateLessonRequest,
  CreateLessonResponse,
  UpdateLessonResponse,
  PaginatedLessonUsersResponse,
} from "@/types/lesson";
import { API_URL } from "../constants/api";
import Cookies from "js-cookie";

export const lessonsApi = {
  // admin+user
  getPaginatedLessons: async (
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedLessonsResponse> => {
    try {
      const token = Cookies.get("auth-token");
      const response = await axios.get<ApiResponse<PaginatedLessonsResponse>>(
        `${API_URL}/lessons?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to fetch paginated lessons");
    }
  },

  // admin+user
  getLesson: async (id: string): Promise<GetLessonResponse> => {
    try {
      const token = Cookies.get("auth-token");
      const response = await axios.get<ApiResponse<GetLessonResponse>>(
        `${API_URL}/lessons/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to fetch lesson details");
    }
  },

  // admins can request but returns empty array
  getRegisteredLessons: async (
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedLessonsResponse> => {
    try {
      const token = Cookies.get("auth-token");
      const response = await axios.get<ApiResponse<PaginatedLessonsResponse>>(
        `${API_URL}/lessons/registered?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to fetch registered lessons");
    }
  },

  // user only
  registerLesson: async (data: RegisterLessonRequest): Promise<void> => {
    try {
      const token = Cookies.get("auth-token");
      await axios.post(`${API_URL}/lessons/register`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      throw new Error("Failed to register for the lesson");
    }
  },

  // user only
  unregisterLesson: async (lessonId: string): Promise<void> => {
    try {
      const token = Cookies.get("auth-token");
      await axios.delete(`${API_URL}/lessons/unregister/${lessonId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      throw new Error("Failed to unregister from the lesson");
    }
  },

  // admin only
  createLesson: async (
    data: CreateLessonRequest
  ): Promise<CreateLessonResponse> => {
    try {
      const token = Cookies.get("auth-token");
      const response = await axios.post<ApiResponse<CreateLessonResponse>>(
        `${API_URL}/lessons`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to create lesson");
    }
  },

  // admin only
  updateLesson: async (
    id: string,
    data: UpdateLessonRequest
  ): Promise<UpdateLessonResponse> => {
    try {
      const token = Cookies.get("auth-token");
      const response = await axios.patch<ApiResponse<UpdateLessonResponse>>(
        `${API_URL}/lessons/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to update lesson");
    }
  },

  // admin only
  deleteLesson: async (id: string): Promise<void> => {
    try {
      const token = Cookies.get("auth-token");
      await axios.delete(`${API_URL}/lessons/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      throw new Error("Failed to delete lesson");
    }
  },

  // admin only
  getLessonUsers: async (
    lessonId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedLessonUsersResponse> => {
    try {
      const token = Cookies.get("auth-token");
      const response = await axios.get<
        ApiResponse<PaginatedLessonUsersResponse>
      >(`${API_URL}/lessons/${lessonId}/users?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to fetch lesson users");
    }
  },
};
