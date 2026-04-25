import { z } from "zod";
import { apiClient } from "@/services/apiClient";
import { UserRole, type AppUser } from "@/types/user";

const backendRoleSchema = z.enum(["ADMIN", "PROFESSOR", "STUDENT"]);

const authUserSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  role: backendRoleSchema,
  isActive: z.boolean(),
});

const loginResponseSchema = z.object({
  token: z.string(),
  user: authUserSchema,
});

const registerResponseSchema = z.object({
  user: authUserSchema,
});

const meResponseSchema = z.object({
  user: authUserSchema,
});

const mapRoleToClient = (role: z.infer<typeof backendRoleSchema>): UserRole => {
  if (role === "ADMIN") {
    return UserRole.ADMIN;
  }

  if (role === "PROFESSOR") {
    return UserRole.PROFESSOR;
  }

  return UserRole.STUDENT;
};

const mapUserToClient = (user: z.infer<typeof authUserSchema>): AppUser => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: mapRoleToClient(user.role),
    isActive: user.isActive,
  };
};

export type AuthRole = z.infer<typeof backendRoleSchema>;

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
} &
  (
    | {
        role: "STUDENT";
        age: number;
        principalSubjectId?: number;
      }
    | {
        role: "PROFESSOR";
        academicLevelIds?: number[];
        subjectIds?: number[];
      }
  );

export const AuthApi = {
  async login(payload: LoginPayload): Promise<{ token: string; user: AppUser }> {
    const response = await apiClient<unknown>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const parsed = loginResponseSchema.parse(response);

    return {
      token: parsed.token,
      user: mapUserToClient(parsed.user),
    };
  },

  async register(payload: RegisterPayload): Promise<{ user: AppUser }> {
    const response = await apiClient<unknown>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const parsed = registerResponseSchema.parse(response);

    return {
      user: mapUserToClient(parsed.user),
    };
  },

  async me(token: string): Promise<{ user: AppUser }> {
    const response = await apiClient<unknown>("/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const parsed = meResponseSchema.parse(response);

    return {
      user: mapUserToClient(parsed.user),
    };
  },
};
