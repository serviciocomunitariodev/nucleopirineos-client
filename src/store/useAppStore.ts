import { create } from "zustand";
import { createAuthSlice, type AuthSlice } from "@/stores/slices/authSlice";
import { createUserSlice, type UserSlice } from "@/stores/slices/userSlice";

export type AppStore = AuthSlice & UserSlice;

export const useAppStore = create<AppStore>()((...args) => ({
  ...createAuthSlice(...args),
  ...createUserSlice(...args),
}));
