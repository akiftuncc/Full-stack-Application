import axios from "axios";
import { ApiResponse } from "@/types/api";
import {
  GetProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "@/types/user";
import { API_URL } from "../constants/api";
import Cookies from "js-cookie";

export const userApi = {
  getProfile: async (): Promise<GetProfileResponse> => {
    try {
      const token = Cookies.get("auth-token");
      const response = await axios.get<ApiResponse<GetProfileResponse>>(
        `${API_URL}/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to fetch user profile");
    }
  },

  updateProfile: async (
    data: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> => {
    try {
      const token = Cookies.get("auth-token");
      const response = await axios.patch<ApiResponse<UpdateProfileResponse>>(
        `${API_URL}/users/profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to update user profile");
    }
  },
};
