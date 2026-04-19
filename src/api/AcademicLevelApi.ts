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

export const AcademicLevelApi = {
  async getAll(): Promise<AcademicLevel[]> {
    const response = await apiClient<unknown>("/academic-levels", {
      method: "GET",
    });

    return academicLevelsSchema.parse(response);
  },
};
