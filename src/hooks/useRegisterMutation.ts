import { useMutation } from "@tanstack/react-query";
import { AuthApi, type RegisterPayload } from "@/api/AuthApi";

export default function useRegisterMutation() {
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => AuthApi.register(payload),
  });
}
