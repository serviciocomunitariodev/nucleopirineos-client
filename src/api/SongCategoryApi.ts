import { z } from "zod";
import { apiClient } from "@/services/apiClient";
import type { SongCategory } from "@/types/songCategory";

const songCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
});

const songCategoriesSchema = z.array(songCategorySchema);

export type CreateSongCategoryPayload = {
  name: string;
};

export type UpdateSongCategoryPayload = CreateSongCategoryPayload;

export const SongCategoryApi = {
  async getAll(): Promise<SongCategory[]> {
    const response = await apiClient<unknown>("/song-categories", {
      method: "GET",
    });

    return songCategoriesSchema.parse(response);
  },

  async getById(id: number): Promise<SongCategory> {
    const response = await apiClient<unknown>(`/song-categories/${id}`, {
      method: "GET",
    });

    return songCategorySchema.parse(response);
  },

  async create(payload: CreateSongCategoryPayload): Promise<SongCategory> {
    const response = await apiClient<unknown>("/song-categories", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return songCategorySchema.parse(response);
  },

  async update(id: number, payload: UpdateSongCategoryPayload): Promise<SongCategory> {
    const response = await apiClient<unknown>(`/song-categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    return songCategorySchema.parse(response);
  },

  async remove(id: number): Promise<void> {
    await apiClient<unknown>(`/song-categories/${id}`, {
      method: "DELETE",
    });
  },
};
