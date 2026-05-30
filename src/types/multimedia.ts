export type MultimediaSection = "HERO" | "MISSION_VISION" | "GALLERY" | "LOGO";

export type MultimediaItem = {
  id: number;
  title: string;
  section: MultimediaSection;
  imageUrl: string;
  imageFileId?: string | null;
  sortOrder: number;
  isActive: boolean;
  uploadDate: string;
};

export type MultimediaPayload = {
  title: string;
  section: MultimediaSection;
  sortOrder?: number;
  isActive?: boolean;
  file?: File;
};
