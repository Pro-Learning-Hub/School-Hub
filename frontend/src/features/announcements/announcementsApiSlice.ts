import { api } from '@/lib/api'
import type { Announcement, AnnouncementComment } from '@/types/api.types'

const courseId = import.meta.env.VITE_COURSE_ID

export const announcementsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAnnouncements: builder.query<{ announcements: Announcement[]; lastFetched: string }, void>({
      query: () => `/courses/${courseId}/announcements`,
      providesTags: ['Announcements'],
    }),
    createAnnouncement: builder.mutation<{ announcement: Announcement }, { title: string; body: string }>({
      query: (data) => ({
        url: `/courses/${courseId}/announcements`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Announcements'],
    }),
    updateAnnouncement: builder.mutation<
      { announcement: Announcement },
      { announcementId: string; title: string; body: string }
    >({
      query: ({ announcementId, ...data }) => ({
        url: `/announcements/${announcementId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Announcements'],
    }),
    deleteAnnouncement: builder.mutation<void, string>({
      query: (announcementId) => ({
        url: `/announcements/${announcementId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Announcements'],
    }),
    getAnnouncementComments: builder.query<AnnouncementComment[], string>({
      query: (announcementId) => `/announcements/${announcementId}/comments`,
    }),
    addAnnouncementComment: builder.mutation<
      { comment: AnnouncementComment },
      { announcementId: string; comment: string }
    >({
      query: ({ announcementId, comment }) => ({
        url: `/announcements/${announcementId}/comments`,
        method: 'POST',
        body: { comment },
      }),
    }),
  }),
})

export const {
  useGetAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useGetAnnouncementCommentsQuery,
  useAddAnnouncementCommentMutation,
} = announcementsApi
