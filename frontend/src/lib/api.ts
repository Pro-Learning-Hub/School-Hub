import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '@/store/store'

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Sections', 'Lecture', 'Announcements', 'Discussion', 'Replies'],
  endpoints: () => ({}),
})
