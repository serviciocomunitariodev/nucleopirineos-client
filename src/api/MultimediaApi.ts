import { z } from "zod";
import { apiClient } from "@/services/apiClient";
import type {
  MultimediaItem,
  MultimediaPayload,
  MultimediaSection,
} from "@/types/multimedia";

const multimediaSchema = z.object({
  id: z.number(),
  title: z.string(),
  section: z.enum(["HERO", "MISSION_VISION", "GALLERY"]),
  imageUrl: z.string(),
  imageFileId: z.string().nullable().optional(),
  sortOrder: z.number(),
  isActive: z.boolean(),
  uploadDate: z.string(),
});

const multimediaListSchema = z.array(multimediaSchema);

type MultimediaFilters = {
  section?: MultimediaSection;
  onlyActive?: boolean;
};

export const MultimediaApi = {
  async getAll(filters: MultimediaFilters = {}): Promise<MultimediaItem[]> {
    const params = new URLSearchParams();

    if (filters.section) {
      params.set("section", filters.section);
    }

    if (filters.onlyActive !== undefined) {
      params.set("onlyActive", String(filters.onlyActive));
    }

    const query = params.toString();
    const response = await apiClient<unknown>(`/multimedia${query ? `?${query}` : ""}`);

    return multimediaListSchema.parse(response);
  },

  async create(payload: MultimediaPayload): Promise<MultimediaItem> {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("section", payload.section);

    if (payload.sortOrder !== undefined) {
      formData.append("sortOrder", payload.sortOrder.toString());
    }

    if (payload.isActive !== undefined) {
      formData.append("isActive", String(payload.isActive));
    }

    if (payload.file) {
      formData.append("file", payload.file);
    }

    const response = await apiClient<unknown>("/multimedia", {
      method: "POST",
      body: formData,
    });

    return multimediaSchema.parse(response);
  },
};
