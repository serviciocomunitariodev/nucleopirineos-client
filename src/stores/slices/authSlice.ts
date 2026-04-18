import type { StateCreator } from "zustand";
import type { AppStore } from "@/store/useAppStore";

export type AuthSlice = {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
};

export const createAuthSlice: StateCreator<AppStore, [], [], AuthSlice> = (set) => ({
  token: "mock-auth-token",
  isAuthenticated: true,
  setToken: (token) =>
    set({
      token,
      isAuthenticated: Boolean(token),
    }),
});
