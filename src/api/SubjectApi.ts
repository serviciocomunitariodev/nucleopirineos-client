import { z } from "zod";
import { apiClient } from "@/services/apiClient";
import { SubjectType, type Subject } from "@/types/subject";

const subjectTypeSchema = z.nativeEnum(SubjectType);

const subjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: subjectTypeSchema,
});

const subjectsSchema = z.array(subjectSchema);

type GetAllInput = {
  type?: SubjectType;
};

export type CreateSubjectPayload = {
  name: string;
  type: SubjectType;
};

export type UpdateSubjectPayload = CreateSubjectPayload;

export const SubjectApi = {
  async getAll(input: GetAllInput = {}): Promise<Subject[]> {
    const searchParams = new URLSearchParams();

    if (input.type) {
      searchParams.set("type", input.type);
    }

    const query = searchParams.toString();
    const endpoint = query ? `/subjects?${query}` : "/subjects";

    const response = await apiClient<unknown>(endpoint, {
      method: "GET",
    });

    return subjectsSchema.parse(response);
  },

  async getById(id: number): Promise<Subject> {
    const response = await apiClient<unknown>(`/subjects/${id}`, {
      method: "GET",
    });

    return subjectSchema.parse(response);
  },

  async create(payload: CreateSubjectPayload): Promise<Subject> {
    const response = await apiClient<unknown>("/subjects", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return subjectSchema.parse(response);
  },

  async update(id: number, payload: UpdateSubjectPayload): Promise<Subject> {
    const response = await apiClient<unknown>(`/subjects/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    return subjectSchema.parse(response);
  },

  async remove(id: number): Promise<void> {
    await apiClient<unknown>(`/subjects/${id}`, {
      method: "DELETE",
    });
  },
};
