import { z } from "zod";
import { apiClient } from "@/services/apiClient";
import type { InformationItem, InformationPayload, InformationSection } from "@/types/information";

const informationSchema = z.object({
  id: z.number(),
  key: z.string(),
  title: z.string(),
  section: z.enum(["HERO", "MISSION_VISION"]),
  value: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const informationListSchema = z.array(informationSchema);

type InformationFilters = {
  section?: InformationSection;
};

export const InformationApi = {
  async getAll(filters: InformationFilters = {}): Promise<InformationItem[]> {
    const params = new URLSearchParams();

    if (filters.section) {
      params.set("section", filters.section);
    }

    const query = params.toString();
    const response = await apiClient<unknown>(`/information${query ? `?${query}` : ""}`, {
      method: "GET",
    });

    return informationListSchema.parse(response);
  },

  async getById(id: number): Promise<InformationItem> {
    const response = await apiClient<unknown>(`/information/${id}`, {
      method: "GET",
    });

    return informationSchema.parse(response);
  },

  async create(payload: InformationPayload): Promise<InformationItem> {
    const response = await apiClient<unknown>("/information", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return informationSchema.parse(response);
  },

  async update(id: number, payload: InformationPayload): Promise<InformationItem> {
    const response = await apiClient<unknown>(`/information/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    return informationSchema.parse(response);
  },

  async remove(id: number): Promise<void> {
    await apiClient<unknown>(`/information/${id}`, {
      method: "DELETE",
    });
  },
};
