import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { AuthApi } from "@/api/AuthApi";
import { useAppStore } from "@/store/useAppStore";

const authGuardFallback = (
  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
    <CircularProgress />
  </Box>
);

export default function ProtectedRoute() {
  const token = useAppStore((state) => state.token);
  const setSession = useAppStore((state) => state.setSession);
  const setUser = useAppStore((state) => state.setUser);

  const meQuery = useQuery({
    queryKey: ["auth", "me", token],
    enabled: Boolean(token),
    retry: false,
    queryFn: async () => {
      if (!token) {
        throw new Error("Missing auth token");
      }

      return AuthApi.me(token);
    },
  });

  useEffect(() => {
    if (meQuery.data?.user) {
      setUser(meQuery.data.user);
    }
  }, [meQuery.data, setUser]);

  useEffect(() => {
    if (meQuery.isError) {
      setSession(null);
    }
  }, [meQuery.isError, setSession]);

  if (!token) {
    return <Navigate replace to="/auth/login" />;
  }

  if (meQuery.isPending) {
    return authGuardFallback;
  }

  if (meQuery.isError) {
    return <Navigate replace to="/auth/login" />;
  }

  return <Outlet />;
}
