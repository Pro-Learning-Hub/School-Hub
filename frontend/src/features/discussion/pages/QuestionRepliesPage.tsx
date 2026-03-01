import { useParams, Link, useLocation } from 'react-router-dom'
import { ArrowLeft, CircleArrowUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import {
  useGetRepliesQuery,
  useAddReplyMutation,
  useToggleQuestionVoteMutation,
  useDeleteQuestionMutation,
} from '../discussionApiSlice'
import { ReplyCard } from '../components/ReplyCard'
import { ReplyForm } from '../components/ReplyForm'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { AlertCircle, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useAppSelector } from '@/store/hooks'
import { getSocket } from '@/lib/socket'
import { api } from '@/lib/api'
import { useAppDispatch } from '@/store/hooks'
import { toast } from 'sonner'

export function QuestionRepliesPage() {
  const { questionId } = useParams<{ questionId: string }>()
  const location = useLocation()
  const { backRoute = '/discussion' } = (location.state as { backRoute?: string }) ?? {}
  const isSocketReady = useAppSelector((s) => s.auth.isSocketReady)
  const userId = useAppSelector((s) => s.auth.user?.id)
  const userRole = useAppSelector((s) => s.auth.user?.role)
  const dispatch = useAppDispatch()
  const [confirmDeleteQuestion, setConfirmDeleteQuestion] = useState(false)

  const { data, isLoading, isError } = useGetRepliesQuery(questionId ?? '', { skip: !questionId })
  const [addReply, { isLoading: isPosting }] = useAddReplyMutation()
  const [toggleVote] = useToggleQuestionVoteMutation()
  const [deleteQuestion] = useDeleteQuestionMutation()

  // Join question room
  useEffect(() => {
    const socket = getSocket()
    if (socket && questionId) {
      const room = `question-${questionId}`
      socket.emit('joinRoom', room)
      return () => { socket.emit('leaveRoom', room) }
    }
  }, [questionId, isSocketReady])

  // Real-time
  useEffect(() => {
    const socket = getSocket()
    if (!socket || !questionId) return
    const invalidate = () => dispatch(api.util.invalidateTags([{ type: 'Replies', id: questionId }]))
    socket.on('replyCreated', invalidate)
    socket.on('replyDeleted', invalidate)
    socket.on('replyUpdated', invalidate)
    socket.on('replyUpvoteToggled', invalidate)
    socket.on('questionUpvoteToggled', invalidate)
    return () => {
      socket.off('replyCreated', invalidate)
      socket.off('replyDeleted', invalidate)
      socket.off('replyUpdated', invalidate)
      socket.off('replyUpvoteToggled', invalidate)
      socket.off('questionUpvoteToggled', invalidate)
    }
  }, [dispatch, questionId, isSocketReady])

  const handleAddReply = async (body: string) => {
    if (!questionId) return
    try {
      await addReply({ questionId, body }).unwrap()
      toast.success('Reply posted!')
    } catch {
      toast.error('Failed to post reply')
    }
  }

  const handleVote = async () => {
    if (!questionId) return
    try {
      await toggleVote({ questionId }).unwrap()
    } catch {
      toast.error('Failed to vote')
    }
  }

  const handleDeleteQuestion = async () => {
    if (!questionId) return
    try {
      await deleteQuestion({ questionId }).unwrap()
      toast.success('Question deleted')
    } catch {
      toast.error('Failed to delete question')
    }
  }

  const question = data?.question
  const replies = data?.repliesList ?? []
  const sortedReplies = [...replies].sort((a, b) => b.upvotes - a.upvotes)
  const canDeleteQuestion =
    question && (userRole !== 'student' || userId === question.user?.id)

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Button asChild variant="ghost" className="mb-4 -ml-2">
        <Link to={backRoute}><ArrowLeft className="size-4 mr-2" />Back to questions</Link>
      </Button>

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      )}

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>Failed to load question.</AlertDescription>
        </Alert>
      )}

      {!isLoading && !isError && question && (
        <>
          {/* Question */}
          <div className="rounded-lg border bg-card p-4 mb-6">
            <div className="flex items-start gap-3">
              <UserAvatar src={question.user?.pictureThumbnail} name={question.user?.name} size="lg" />
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-semibold mb-1">{question.title}</h1>
                <p className="text-xs text-muted-foreground mb-3">
                  {question.user?.name} · {formatDate(question.updatedAt)}
                </p>
                {question.body && (
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: question.body }}
                  />
                )}
              </div>
              <div className="flex flex-col items-center gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-1 text-xs h-7 px-2 ${question.isUpvoted ? 'text-primary' : 'text-muted-foreground'}`}
                  onClick={handleVote}
                >
                  <CircleArrowUp className="size-4" strokeWidth={question.isUpvoted ? 2.2 : 2} />
                  {question.upvotes}
                </Button>
                {canDeleteQuestion && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-destructive"
                    onClick={() => setConfirmDeleteQuestion(true)}
                  >
                    <Trash2 className="size-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Replies */}
          <div className="mb-4">
            <h2 className="font-semibold mb-3">
              {sortedReplies.length} {sortedReplies.length === 1 ? 'Answer' : 'Answers'}
            </h2>
            <div className="space-y-3">
              {sortedReplies.map((reply) => (
                <ReplyCard key={reply.id} reply={reply} questionId={questionId!} />
              ))}
            </div>
          </div>

          {/* Reply form */}
          <ReplyForm onSubmit={handleAddReply} isLoading={isPosting} />
        </>
      )}

      {!isLoading && !isError && !question && (
        <p className="text-muted-foreground text-center py-12">Question not found.</p>
      )}

      <ConfirmDialog
        open={confirmDeleteQuestion}
        onOpenChange={setConfirmDeleteQuestion}
        title="Delete Question"
        description="Are you sure you want to delete this question and all its replies?"
        onConfirm={handleDeleteQuestion}
        confirmLabel="Delete"
      />
    </div>
  )
}
