import axios from "axios";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  DecodedToken,
} from "@/types/auth";
import { ApiResponse } from "@/types/api";
import { API_URL } from "../constants/api";

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await axios.post<ApiResponse<AuthResponse>>(
        `${API_URL}/auth/login`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw new Error("Login failed");
    }
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await axios.post<ApiResponse<AuthResponse>>(
        `${API_URL}/auth/register`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw new Error("Registration failed");
    }
  },

  decodeToken: (token: string): DecodedToken => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      throw new Error("Invalid token");
    }
  },
};
