import { api } from '@/lib/api'
import type { Question, Reply } from '@/types/api.types'

const courseId = import.meta.env.VITE_COURSE_ID

export const discussionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGeneralDiscussion: builder.query<{ results: Question[]; lastFetched: string }, void>({
      query: () => `/courses/${courseId}/generalDiscussion`,
      providesTags: ['Discussion'],
    }),
    addGeneralQuestion: builder.mutation<
      { newEntry: Question; lastFetched: string },
      { title: string; body: string }
    >({
      query: (data) => ({
        url: `/courses/${courseId}/generalDiscussion`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Discussion'],
    }),
    getLectureDiscussion: builder.query<{ results: Question[]; lastFetched: string }, string>({
      query: (lectureId) => `/lectures/${lectureId}/discussion`,
      providesTags: (_result, _err, lectureId) => [{ type: 'Discussion', id: lectureId }],
    }),
    addLectureQuestion: builder.mutation<
      { newEntry: Question; lastFetched: string },
      { lectureId: string; title: string; body: string }
    >({
      query: ({ lectureId, ...data }) => ({
        url: `/lectures/${lectureId}/discussion`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _err, { lectureId }) => [{ type: 'Discussion', id: lectureId }],
    }),
    getReplies: builder.query<{ question: Question; repliesList: Reply[] }, string>({
      query: (questionId) => `/questions/${questionId}/replies`,
      providesTags: (_result, _err, questionId) => [{ type: 'Replies', id: questionId }],
    }),
    addReply: builder.mutation<{ newReply: Reply }, { questionId: string; body: string }>({
      query: ({ questionId, body }) => ({
        url: `/questions/${questionId}/replies`,
        method: 'POST',
        body: { body },
      }),
      invalidatesTags: (_result, _err, { questionId }) => [{ type: 'Replies', id: questionId }],
    }),
    toggleQuestionVote: builder.mutation<
      { isUpvoted: boolean; upvotes: number },
      { questionId: string }
    >({
      query: ({ questionId }) => ({
        url: `/questions/${questionId}/vote`,
        method: 'POST',
      }),
    }),
    toggleReplyVote: builder.mutation<
      { isUpvoted: boolean; upvotes: number },
      { replyId: string; questionId: string }
    >({
      query: ({ replyId }) => ({
        url: `/replies/${replyId}/vote`,
        method: 'POST',
      }),
    }),
    deleteQuestion: builder.mutation<void, { questionId: string; lectureId?: string }>({
      query: ({ questionId }) => ({
        url: `/questions/${questionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Discussion'],
    }),
    deleteReply: builder.mutation<void, { replyId: string; questionId: string }>({
      query: ({ replyId }) => ({
        url: `/replies/${replyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _err, { questionId }) => [{ type: 'Replies', id: questionId }],
    }),
  }),
})

export const {
  useGetGeneralDiscussionQuery,
  useAddGeneralQuestionMutation,
  useGetLectureDiscussionQuery,
  useAddLectureQuestionMutation,
  useGetRepliesQuery,
  useAddReplyMutation,
  useToggleQuestionVoteMutation,
  useToggleReplyVoteMutation,
  useDeleteQuestionMutation,
  useDeleteReplyMutation,
} = discussionApi
