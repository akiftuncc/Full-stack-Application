import axios from "axios";
import { ApiResponse } from "@/types/api";
import { LessonsResponse, ServerStatusResponse } from "@/types/public";
import { API_URL } from "../constants/api";

export const publicApi = {
  getServerStatus: async (): Promise<ServerStatusResponse> => {
    try {
      const response = await axios.get<ApiResponse<ServerStatusResponse>>(
        `${API_URL}/public`
      );
      return {
        message: response.data.message,
        statusCode: response.data.statusCode,
      };
    } catch (error) {
      throw new Error("Failed to fetch server status");
    }
  },

  getLessons: async (): Promise<LessonsResponse> => {
    try {
      const response = await axios.get<ApiResponse<LessonsResponse>>(
        `${API_URL}/public-lessons`
      );
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to fetch lessons");
    }
  },
};
