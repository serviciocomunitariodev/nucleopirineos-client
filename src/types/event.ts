export type Event = {
  id: number
  title: string
  description: string
  startDate: string
  endDate?: string | null
  endTime?: string | null
  location: string
  responsible?: string | null
  time: string
  subjectId?: number | null
  academicLevelId?: number | null
}

export type EventPayload = {
  title: string
  description: string
  startDate: string
  endDate?: string
  endTime?: string
  location: string
  responsible?: string
  time: string
  subjectId?: number
  academicLevelId?: number
}
