import type { AcademicLevel } from "@/types/academicLevel";
import type { Subject } from "@/types/subject";
import type { AppUser } from "@/types/user";

export type ProfessorRecord = {
  id: number;
  userId: number;
  user: AppUser;
  subjects: Subject[];
  academicLevels: AcademicLevel[];
};

export type StudentRecord = {
  id: number;
  userId: number;
  age: number;
  academicLevelId: number;
  principalSubjectId: number | null;
  user: AppUser;
  academicLevel: AcademicLevel;
  principalSubject: Subject | null;
  complementarySubjects: Subject[];
};
