import { z } from "zod";
import { apiClient } from "@/services/apiClient";
import type { AcademicLevel } from "@/types/academicLevel";
import { SubjectType, type Subject } from "@/types/subject";
import { UserRole, type AppUser } from "@/types/user";
import type { ProfessorRecord, StudentRecord } from "@/types/users";

const backendRoleSchema = z.enum(["PROFESSOR", "STUDENT"]);

const userSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  role: backendRoleSchema,
  isActive: z.boolean(),
});

const subjectTypeSchema = z.enum(["PRINCIPAL", "COMPLEMENTARY", "GROUP"]);

const subjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: subjectTypeSchema,
});

const academicLevelSchema = z.object({
  id: z.number(),
  name: z.string(),
  minAge: z.number(),
  maxAge: z.number().nullable(),
});

const professorSchema = z.object({
  id: z.number(),
  userId: z.number(),
  user: userSchema,
  subjectsTaught: z.array(z.object({ subject: subjectSchema })),
  academicLevelAssignments: z.array(z.object({ academicLevel: academicLevelSchema })),
});

const studentSchema = z.object({
  id: z.number(),
  userId: z.number(),
  age: z.number(),
  academicLevelId: z.number(),
  principalSubjectId: z.number().nullable(),
  user: userSchema,
  academicLevel: academicLevelSchema,
  principalSubject: subjectSchema.nullable(),
  complementarySubjects: z.array(z.object({ subject: subjectSchema })),
});

const usersSchema = z.array(userSchema);
const professorsSchema = z.array(professorSchema);
const studentsSchema = z.array(studentSchema);

const mapRoleToClient = (role: z.infer<typeof backendRoleSchema>): UserRole => {
  if (role === "PROFESSOR") {
    return UserRole.PROFESSOR;
  }

  return UserRole.STUDENT;
};

const mapUserToClient = (user: z.infer<typeof userSchema>): AppUser => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: mapRoleToClient(user.role),
  isActive: user.isActive,
});

const mapSubject = (subject: z.infer<typeof subjectSchema>): Subject => ({
  id: subject.id,
  name: subject.name,
  type:
    subject.type === "PRINCIPAL"
      ? SubjectType.PRINCIPAL
      : subject.type === "COMPLEMENTARY"
      ? SubjectType.COMPLEMENTARY
      : SubjectType.GROUP,
});

const mapAcademicLevel = (level: z.infer<typeof academicLevelSchema>): AcademicLevel => ({
  id: level.id,
  name: level.name,
  minAge: level.minAge,
  maxAge: level.maxAge,
});

const mapProfessor = (professor: z.infer<typeof professorSchema>): ProfessorRecord => ({
  id: professor.id,
  userId: professor.userId,
  user: mapUserToClient(professor.user),
  subjects: professor.subjectsTaught.map((item) => mapSubject(item.subject)),
  academicLevels: professor.academicLevelAssignments.map((item) => mapAcademicLevel(item.academicLevel)),
});

const mapStudent = (student: z.infer<typeof studentSchema>): StudentRecord => ({
  id: student.id,
  userId: student.userId,
  age: student.age,
  academicLevelId: student.academicLevelId,
  principalSubjectId: student.principalSubjectId,
  user: mapUserToClient(student.user),
  academicLevel: mapAcademicLevel(student.academicLevel),
  principalSubject: student.principalSubject ? mapSubject(student.principalSubject) : null,
  complementarySubjects: student.complementarySubjects.map((item) => mapSubject(item.subject)),
});

const findByUserIdOrThrow = <TRecord extends { userId: number }>(
  records: TRecord[],
  userId: number,
  entityLabel: string
): TRecord => {
  const record = records.find((item) => item.userId === userId);

  if (!record) {
    throw new Error(`${entityLabel} no encontrado para el usuario indicado.`);
  }

  return record;
};

export type BackendUserRole = z.infer<typeof backendRoleSchema>;

export type CreateUserPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: BackendUserRole;
  isActive?: boolean;
};

export type UpdateUserPayload = Partial<{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: BackendUserRole;
  isActive: boolean;
}>;

export type CreateProfessorPayload = {
  userId: number;
  subjectIds?: number[];
  academicLevelIds?: number[];
};

export type UpdateProfessorPayload = {
  subjectIds?: number[];
  academicLevelIds?: number[];
};

export type CreateStudentPayload = {
  userId: number;
  age: number;
  principalSubjectId?: number;
  complementarySubjectIds?: number[];
};

export type UpdateStudentPayload = {
  age?: number;
  principalSubjectId?: number | null;
  complementarySubjectIds?: number[];
};

export const UsersApi = {
  async getUsers(): Promise<AppUser[]> {
    const response = await apiClient<unknown>("/users", { method: "GET" });
    return usersSchema.parse(response).map(mapUserToClient);
  },

  async getUserById(id: number): Promise<AppUser> {
    const response = await apiClient<unknown>(`/users/${id}`, { method: "GET" });
    return mapUserToClient(userSchema.parse(response));
  },

  async createUser(payload: CreateUserPayload): Promise<AppUser> {
    const response = await apiClient<unknown>("/users", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return mapUserToClient(userSchema.parse(response));
  },

  async updateUser(id: number, payload: UpdateUserPayload): Promise<AppUser> {
    const response = await apiClient<unknown>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    return mapUserToClient(userSchema.parse(response));
  },

  async getProfessors(): Promise<ProfessorRecord[]> {
    const response = await apiClient<unknown>("/professors", { method: "GET" });
    return professorsSchema.parse(response).map(mapProfessor);
  },

  async getProfessorById(id: number): Promise<ProfessorRecord> {
    const response = await apiClient<unknown>(`/professors/${id}`, { method: "GET" });
    return mapProfessor(professorSchema.parse(response));
  },

  async getProfessorByUserId(userId: number): Promise<ProfessorRecord> {
    const professors = await this.getProfessors();
    return findByUserIdOrThrow(professors, userId, "Profesor");
  },

  async createProfessor(payload: CreateProfessorPayload): Promise<ProfessorRecord> {
    const response = await apiClient<unknown>("/professors", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return mapProfessor(professorSchema.parse(response));
  },

  async updateProfessor(id: number, payload: UpdateProfessorPayload): Promise<ProfessorRecord> {
    const response = await apiClient<unknown>(`/professors/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    return mapProfessor(professorSchema.parse(response));
  },

  async deleteProfessor(id: number): Promise<void> {
    await apiClient<unknown>(`/professors/${id}`, { method: "DELETE" });
  },

  async getStudents(): Promise<StudentRecord[]> {
    const response = await apiClient<unknown>("/students", { method: "GET" });
    return studentsSchema.parse(response).map(mapStudent);
  },

  async getStudentById(id: number): Promise<StudentRecord> {
    const response = await apiClient<unknown>(`/students/${id}`, { method: "GET" });
    return mapStudent(studentSchema.parse(response));
  },

  async getStudentByUserId(userId: number): Promise<StudentRecord> {
    const students = await this.getStudents();
    return findByUserIdOrThrow(students, userId, "Estudiante");
  },

  async createStudent(payload: CreateStudentPayload): Promise<StudentRecord> {
    const response = await apiClient<unknown>("/students", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return mapStudent(studentSchema.parse(response));
  },

  async updateStudent(id: number, payload: UpdateStudentPayload): Promise<StudentRecord> {
    const response = await apiClient<unknown>(`/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    return mapStudent(studentSchema.parse(response));
  },

  async deleteStudent(id: number): Promise<void> {
    await apiClient<unknown>(`/students/${id}`, { method: "DELETE" });
  },
};
