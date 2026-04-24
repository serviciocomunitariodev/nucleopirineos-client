import { z } from "zod";
import { apiClient } from "@/services/apiClient";
import type { Song } from "@/types/song";

const songSchema = z.object({
  id: z.number(),
  title: z.string(),
  url: z.string(),
  categoryId: z.number(),
  category: z.object({
    id: z.number(),
    name: z.string(),
  }).optional(),
});

const songsSchema = z.array(songSchema);

export type CreateSongPayload = {
  title: string;
  url: string;
  categoryId: number;
};

export type UpdateSongPayload = CreateSongPayload;

export const SongApi = {
  async getAll(): Promise<Song[]> {
    const response = await apiClient<unknown>("/songs", {
      method: "GET",
    });

    return songsSchema.parse(response);
  },

  async getById(id: number): Promise<Song> {
    const response = await apiClient<unknown>(`/songs/${id}`, {
      method: "GET",
    });

    return songSchema.parse(response);
  },

  async create(payload: CreateSongPayload): Promise<Song> {
    const response = await apiClient<unknown>("/songs", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return songSchema.parse(response);
  },

  async update(id: number, payload: UpdateSongPayload): Promise<Song> {
    const response = await apiClient<unknown>(`/songs/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    return songSchema.parse(response);
  },

  async remove(id: number): Promise<void> {
    await apiClient<unknown>(`/songs/${id}`, {
      method: "DELETE",
    });
  },
};
