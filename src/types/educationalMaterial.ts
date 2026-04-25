export type EducationalMaterial = {
  id: number;
  title: string;
  fileUrl: string;
  professorId: number;
  subjectId: number;
  uploadDate: string;
  professor?: {
    id: number;
    fullName: string;
  };
  subject?: {
    id: number;
    name: string;
  };
};

export type EducationalMaterialPayload = {
  title: string;
  fileUrl: string;
  professorId: number;
  subjectId: number;
};
