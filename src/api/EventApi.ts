import { z } from 'zod'
import { apiClient } from '@/services/apiClient'
import type { Event, EventPayload } from '@/types/event'

const eventSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  location: z.string(),
  time: z.string(),
})

const eventsSchema = z.array(eventSchema)

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

  async create(payload: EventPayload): Promise<Event> {
    const response = await apiClient<unknown>('/events', {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    return eventSchema.parse(response)
  },

  async update(id: number, payload: EventPayload): Promise<Event> {
    const response = await apiClient<unknown>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })

    return eventSchema.parse(response)
  },

  async remove(id: number): Promise<void> {
    await apiClient<unknown>(`/events/${id}`, {
      method: 'DELETE',
    })
  },
}
