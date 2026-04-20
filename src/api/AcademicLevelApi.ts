import { z } from "zod";
import { apiClient } from "@/services/apiClient";
import type { AcademicLevel } from "@/types/academicLevel";

const academicLevelSchema = z.object({
  id: z.number(),
  name: z.string(),
  minAge: z.number(),
  maxAge: z.number().nullable(),
});

const academicLevelsSchema = z.array(academicLevelSchema);

export type CreateAcademicLevelPayload = {
  name: string;
  minAge: number;
  maxAge: number | null;
};

export type UpdateAcademicLevelPayload = CreateAcademicLevelPayload;

export const AcademicLevelApi = {
  async getAll(): Promise<AcademicLevel[]> {
    const response = await apiClient<unknown>("/academic-levels", {
      method: "GET",
    });

    return academicLevelsSchema.parse(response);
  },

  async getById(id: number): Promise<AcademicLevel> {
    const response = await apiClient<unknown>(`/academic-levels/${id}`, {
      method: "GET",
    });

    return academicLevelSchema.parse(response);
  },

  async create(payload: CreateAcademicLevelPayload): Promise<AcademicLevel> {
    const response = await apiClient<unknown>("/academic-levels", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return academicLevelSchema.parse(response);
  },

  async update(id: number, payload: UpdateAcademicLevelPayload): Promise<AcademicLevel> {
    const response = await apiClient<unknown>(`/academic-levels/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    return academicLevelSchema.parse(response);
  },

  async remove(id: number): Promise<void> {
    await apiClient<unknown>(`/academic-levels/${id}`, {
      method: "DELETE",
    });
  },
};
