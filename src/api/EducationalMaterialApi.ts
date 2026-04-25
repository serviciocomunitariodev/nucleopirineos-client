import { z } from "zod";
import { apiClient } from "@/services/apiClient";
import type { EducationalMaterial, EducationalMaterialPayload } from "@/types/educationalMaterial";

const educationalMaterialSchema = z.object({
  id: z.number(),
  title: z.string(),
  fileUrl: z.string(),
  professorId: z.number(),
  subjectId: z.number(),
  uploadDate: z.string(),
  professor: z
    .object({
      id: z.number(),
      user: z.object({
        firstName: z.string(),
        lastName: z.string(),
      }),
    })
    .optional(),
  subject: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .optional(),
});

const educationalMaterialsSchema = z.array(educationalMaterialSchema);

const mapEducationalMaterial = (material: z.infer<typeof educationalMaterialSchema>): EducationalMaterial => ({
  id: material.id,
  title: material.title,
  fileUrl: material.fileUrl,
  professorId: material.professorId,
  subjectId: material.subjectId,
  uploadDate: material.uploadDate,
  professor: material.professor
    ? {
        id: material.professor.id,
        fullName: `${material.professor.user.firstName} ${material.professor.user.lastName}`,
      }
    : undefined,
  subject: material.subject
    ? {
        id: material.subject.id,
        name: material.subject.name,
      }
    : undefined,
});

export const EducationalMaterialApi = {
  async getAll(): Promise<EducationalMaterial[]> {
    const response = await apiClient<unknown>("/educational-materials", {
      method: "GET",
    });

    return educationalMaterialsSchema.parse(response).map(mapEducationalMaterial);
  },

  async getById(id: number): Promise<EducationalMaterial> {
    const response = await apiClient<unknown>(`/educational-materials/${id}`, {
      method: "GET",
    });

    return mapEducationalMaterial(educationalMaterialSchema.parse(response));
  },

  async create(payload: EducationalMaterialPayload): Promise<EducationalMaterial> {
    const response = await apiClient<unknown>("/educational-materials", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return mapEducationalMaterial(educationalMaterialSchema.parse(response));
  },

  async update(id: number, payload: EducationalMaterialPayload): Promise<EducationalMaterial> {
    const response = await apiClient<unknown>(`/educational-materials/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    return mapEducationalMaterial(educationalMaterialSchema.parse(response));
  },
};
