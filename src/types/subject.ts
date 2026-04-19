export enum SubjectType {
  PRINCIPAL = "PRINCIPAL",
  COMPLEMENTARY = "COMPLEMENTARY",
  GROUP = "GROUP",
}

export type Subject = {
  id: number;
  name: string;
  type: SubjectType;
};
