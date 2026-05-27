import { SongCategory } from "./songCategory";

export type Song = {
  id: number;
  title: string;
  url: string;
  fileId?: string | null;
  categoryId: number;
  subjectId?: number | null;
  academicLevelId?: number | null;
  category?: SongCategory;
};
