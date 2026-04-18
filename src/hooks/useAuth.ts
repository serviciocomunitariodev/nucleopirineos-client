import { useAppStore } from "@/store/useAppStore";

export function useAuth() {
  const { token, isAuthenticated, setSession } = useAppStore();

  return {
    isAuthenticated,
    token,
    setSession,
  };
}
