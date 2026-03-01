import { useState, useEffect } from 'react'
import {
  useGetLectureDiscussionQuery,
  useAddLectureQuestionMutation,
} from '../discussionApiSlice'
import { QuestionCard } from '../components/QuestionCard'
import { QuestionForm } from '../components/QuestionForm'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useAppSelector } from '@/store/hooks'
import { getSocket } from '@/lib/socket'
import { api } from '@/lib/api'
import { useAppDispatch } from '@/store/hooks'
import { toast } from 'sonner'

interface LectureDiscussionPageProps {
  lectureId: string
}

export function LectureDiscussionPage({ lectureId }: LectureDiscussionPageProps) {
  const isSocketReady = useAppSelector((s) => s.auth.isSocketReady)
  const dispatch = useAppDispatch()
  const [showForm, setShowForm] = useState(false)

  const { data, isLoading, isError } = useGetLectureDiscussionQuery(lectureId, { skip: !lectureId })
  const [addQuestion, { isLoading: isPosting }] = useAddLectureQuestionMutation()

  // Join lecture discussion room
  useEffect(() => {
    const socket = getSocket()
    if (socket && lectureId) {
      const room = `lectureDiscussion-${lectureId}`
      socket.emit('joinRoom', room)
      return () => { socket.emit('leaveRoom', room) }
    }
  }, [lectureId, isSocketReady])

  // Real-time
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return
    const invalidate = () => dispatch(api.util.invalidateTags([{ type: 'Discussion', id: lectureId }]))
    socket.on('lectureQuestionCreated', invalidate)
    socket.on('lectureQuestionDeleted', invalidate)
    socket.on('lectureQuestionEdited', invalidate)
    socket.on('questionUpvoteToggled', invalidate)
    return () => {
      socket.off('lectureQuestionCreated', invalidate)
      socket.off('lectureQuestionDeleted', invalidate)
      socket.off('lectureQuestionEdited', invalidate)
      socket.off('questionUpvoteToggled', invalidate)
    }
  }, [dispatch, lectureId, isSocketReady])

  const handlePost = async (title: string, body: string) => {
    try {
      await addQuestion({ lectureId, title, body }).unwrap()
      toast.success('Question posted!')
      setShowForm(false)
    } catch {
      toast.error('Failed to post question')
    }
  }

  const questions = data?.results ?? []
  const sorted = [...questions].sort((a, b) => b.upvotes - a.upvotes)
  const backRoute = `/lectures/${lectureId}`

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertDescription>Failed to load discussion.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg">Lecture Discussion</h2>

      <div className="space-y-3">
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">
            No questions yet. Be the first to ask!
          </p>
        ) : (
          sorted.map((q) => (
            <QuestionCard key={q.id} question={q} backRoute={backRoute} />
          ))
        )}
      </div>

      {showForm ? (
        <QuestionForm
          onSubmit={handlePost}
          onCancel={() => setShowForm(false)}
          isLoading={isPosting}
        />
      ) : (
        <Button variant="outline" className="w-full" onClick={() => setShowForm(true)}>
          Ask a question about this lecture
        </Button>
      )}
    </div>
  )
}
