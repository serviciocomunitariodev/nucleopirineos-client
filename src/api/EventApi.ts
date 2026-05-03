import { z } from 'zod'
import { apiClient } from '@/services/apiClient'
import type { Event, EventPayload } from '@/types/event'

const eventSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  endTime: z.string().nullable().optional(),
  location: z.string(),
  responsible: z.string().nullable().optional(),
  time: z.string(),
  subjectId: z.number().nullable().optional(),
  academicLevelId: z.number().nullable().optional(),
})

const eventsSchema = z.array(eventSchema)

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('auth-token') : null

  if (!token) {
    return undefined
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

export const EventApi = {
  async getAll(): Promise<Event[]> {
    const response = await apiClient<unknown>('/events', {
      method: 'GET',
    })

    return eventsSchema.parse(response)
  },

  async getById(id: number): Promise<Event> {
    const response = await apiClient<unknown>(`/events/${id}`, {
      method: 'GET',
    })

    return eventSchema.parse(response)
  },

  async getVisible(): Promise<Event[]> {
    const response = await apiClient<unknown>('/events/visible', {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    return eventsSchema.parse(response)
  },

  async create(payload: EventPayload): Promise<Event> {
    const response = await apiClient<unknown>('/events', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    })

    return eventSchema.parse(response)
  },

  async update(id: number, payload: EventPayload): Promise<Event> {
    const response = await apiClient<unknown>(`/events/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    })

    return eventSchema.parse(response)
  },

  async remove(id: number): Promise<void> {
    await apiClient<unknown>(`/events/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
  },
}
