import type { StateCreator } from "zustand";
import { UserRole, type AppUser } from "@/types/user";
import type { AppStore } from "@/store/useAppStore";

export type UserSlice = {
  user: AppUser;
  setUser: (user: AppUser) => void;
  logout: () => void;
};

const defaultUser: AppUser = {
  id: 1,
  firstName: "Admin",
  lastName: "Nucleo",
  email: "admin@nucleopirineos.local",
  role: UserRole.ADMIN,
};

export const createUserSlice: StateCreator<AppStore, [], [], UserSlice> = (set) => ({
  user: defaultUser,
  setUser: (user) => set({ user }),
  logout: () =>
    set({
      token: null,
      isAuthenticated: false,
      user: defaultUser,
    }),
});
