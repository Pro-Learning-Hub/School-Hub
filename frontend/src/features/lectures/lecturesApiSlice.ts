import { api } from '@/lib/api'
import type { Section, Lecture, LectureFormData } from '@/types/api.types'

const courseId = import.meta.env.VITE_COURSE_ID

export const lecturesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSections: builder.query<{ sections: Section[]; lastFetched: string }, void>({
      query: () => `/courses/${courseId}/lectures`,
      providesTags: ['Sections'],
    }),
    getLecture: builder.query<{ lectureData: Lecture }, string>({
      query: (lectureId) => `/courses/${courseId}/lectures/${lectureId}`,
      providesTags: (_result, _err, id) => [{ type: 'Lecture', id }],
    }),
    getSectionTitles: builder.query<string[], void>({
      query: () => `/courses/${courseId}/sections_titles`,
    }),
    createLecture: builder.mutation<{ lecture: Lecture }, LectureFormData>({
      query: (data) => ({
        url: `/courses/${courseId}/lectures`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Sections'],
    }),
    updateLecture: builder.mutation<{ lecture: Lecture }, { lectureId: string; data: Partial<LectureFormData> }>({
      query: ({ lectureId, data }) => ({
        url: `/lectures/${lectureId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _err, { lectureId }) => [
        'Sections',
        { type: 'Lecture', id: lectureId },
      ],
    }),
    deleteLecture: builder.mutation<void, { lectureId: string; sectionId: string }>({
      query: ({ lectureId }) => ({
        url: `/lectures/${lectureId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Sections'],
    }),
  }),
})

export const {
  useGetSectionsQuery,
  useGetLectureQuery,
  useGetSectionTitlesQuery,
  useCreateLectureMutation,
  useUpdateLectureMutation,
  useDeleteLectureMutation,
} = lecturesApi
