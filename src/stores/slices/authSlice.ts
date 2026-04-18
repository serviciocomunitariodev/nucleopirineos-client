import type { StateCreator } from "zustand";
import type { AppStore } from "@/store/useAppStore";

export type AuthSlice = {
  token: string | null;
  isAuthenticated: boolean;
  setSession: (token: string | null) => void;
};

const AUTH_TOKEN_STORAGE_KEY = "auth-token";

const getInitialToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
};

export const createAuthSlice: StateCreator<AppStore, [], [], AuthSlice> = (set) => {
  const initialToken = getInitialToken();

  return {
    token: initialToken,
    isAuthenticated: Boolean(initialToken),
    setSession: (token) => {
      if (typeof window !== "undefined") {
        if (token) {
          window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
        } else {
          window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
        }
      }

      set({
        token,
        isAuthenticated: Boolean(token),
      });
    },
  };
};
