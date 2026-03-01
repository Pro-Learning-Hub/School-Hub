import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import {
  useGetGeneralDiscussionQuery,
  useAddGeneralQuestionMutation,
} from '../discussionApiSlice'
import { QuestionCard } from '../components/QuestionCard'
import { QuestionForm } from '../components/QuestionForm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useAppSelector } from '@/store/hooks'
import { getSocket } from '@/lib/socket'
import { api } from '@/lib/api'
import { useAppDispatch } from '@/store/hooks'
import { toast } from 'sonner'

const courseId = import.meta.env.VITE_COURSE_ID

export function GeneralDiscussionPage() {
  const isSocketReady = useAppSelector((s) => s.auth.isSocketReady)
  const dispatch = useAppDispatch()
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')

  const { data, isLoading, isError } = useGetGeneralDiscussionQuery()
  const [addQuestion, { isLoading: isPosting }] = useAddGeneralQuestionMutation()

  // Join room
  useEffect(() => {
    const socket = getSocket()
    if (socket && courseId) {
      const room = `generalDiscussion-${courseId}`
      socket.emit('joinRoom', room)
      return () => { socket.emit('leaveRoom', room) }
    }
  }, [isSocketReady])

  // Real-time
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return
    const invalidate = () => dispatch(api.util.invalidateTags(['Discussion']))
    socket.on('generalDiscussionQuestionCreated', invalidate)
    socket.on('generalDiscussionQuestionDeleted', invalidate)
    socket.on('generalDiscussionQuestionEdited', invalidate)
    socket.on('questionUpvoteToggled', invalidate)
    return () => {
      socket.off('generalDiscussionQuestionCreated', invalidate)
      socket.off('generalDiscussionQuestionDeleted', invalidate)
      socket.off('generalDiscussionQuestionEdited', invalidate)
      socket.off('questionUpvoteToggled', invalidate)
    }
  }, [dispatch, isSocketReady])

  const handlePost = async (title: string, body: string) => {
    try {
      await addQuestion({ title, body }).unwrap()
      toast.success('Question posted!')
      setShowForm(false)
    } catch {
      toast.error('Failed to post question')
    }
  }

  const questions = data?.results ?? []
  const filtered = questions.filter(
    (q) =>
      !search ||
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.body?.toLowerCase().includes(search.toLowerCase())
  )
  const sorted = [...filtered].sort((a, b) => b.upvotes - a.upvotes)

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">General Discussion</h1>
        <p className="text-muted-foreground text-sm">Course Discussion Forum</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search questions…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}
        </div>
      )}

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>Failed to load discussion.</AlertDescription>
        </Alert>
      )}

      {!isLoading && !isError && (
        <div className="space-y-3">
          {sorted.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              {search ? 'No questions match your search.' : 'No questions yet. Be the first to ask!'}
            </p>
          ) : (
            sorted.map((q) => (
              <QuestionCard key={q.id} question={q} backRoute="/discussion" />
            ))
          )}
        </div>
      )}

      <div className="mt-6">
        {showForm ? (
          <QuestionForm
            onSubmit={handlePost}
            onCancel={() => setShowForm(false)}
            isLoading={isPosting}
          />
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowForm(true)}
          >
            Ask a new question
          </Button>
        )}
      </div>
    </div>
  )
}
