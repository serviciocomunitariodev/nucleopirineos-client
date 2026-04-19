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
};
