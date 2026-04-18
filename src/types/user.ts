export enum UserRole {
  ADMIN = "ADMIN",
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
