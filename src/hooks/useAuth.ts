import { useAppStore } from "@/store/useAppStore";

export function useAuth() {
  const { token, isAuthenticated, setToken } = useAppStore();

  return {
    isAuthenticated,
    token,
    setToken,
  };
}
