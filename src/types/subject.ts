export enum SubjectType {
  PRINCIPAL = "PRINCIPAL",
  COMPLEMENTARY = "COMPLEMENTARY",
  GROUP = "GROUP",
}

export const subjectTypeLabelMap: Record<SubjectType, string> = {
  [SubjectType.PRINCIPAL]: "PRINCIPAL",
  [SubjectType.COMPLEMENTARY]: "COMPLEMENTARIO",
  [SubjectType.GROUP]: "GRUPAL",
};

export const getSubjectTypeLabel = (type: SubjectType): string => {
  return subjectTypeLabelMap[type];
};

export type Subject = {
  id: number;
  name: string;
  type: SubjectType;
};
