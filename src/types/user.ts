export enum UserRole {
  ADMIN = "ADMIN",
  PROFESSOR = "PROFESSOR",
  STUDENT = "STUDENT",
}

export type AppUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
};
