import { SongCategory } from "./songCategory";

export type Song = {
  id: number;
  title: string;
  url: string;
  categoryId: number;
  category?: SongCategory;
};
