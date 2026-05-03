export type Event = {
  id: number
  title: string
  description: string
  startDate: string
  endDate?: string | null
  location: string
  time: string
}

export type EventPayload = {
  title: string
  description: string
  startDate: string
  endDate?: string
  location: string
  time: string
}
