import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { Roles } from "@/lib/constants/enums";

export interface User {
  id: string;
  userName: string;
  role: Roles;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (token: string, user: User) => {
        Cookies.set("auth-token", token, {
          expires: 1,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        set({ token, user, isAuthenticated: true });
      },
      logout: () => {
        Cookies.remove("auth-token");
        set({ token: null, user: null, isAuthenticated: false });
      },
      checkAuth: () => {
        const cookieToken = Cookies.get("auth-token");
        const { token, isAuthenticated } = get();

        if (!cookieToken && isAuthenticated) {
          get().logout();
        } else if (cookieToken && cookieToken !== token) {
          try {
            const decodedToken = JSON.parse(atob(cookieToken.split(".")[1]));
            if (decodedToken && decodedToken.sub) {
              set({
                token: cookieToken,
                isAuthenticated: true,
                user: get().user || {
                  id: decodedToken.sub,
                  userName: "User",
                  role: decodedToken.role as Roles,
                },
              });
            }
          } catch (error) {
            get().logout();
          }
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
