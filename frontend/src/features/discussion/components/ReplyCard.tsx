import { CircleArrowUp } from 'lucide-react'
import type { Reply } from '@/types/api.types'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { useToggleReplyVoteMutation, useDeleteReplyMutation } from '../discussionApiSlice'
import { useAppSelector } from '@/store/hooks'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { useState } from 'react'

interface ReplyCardProps {
  reply: Reply
  questionId: string
}

export function ReplyCard({ reply, questionId }: ReplyCardProps) {
  const userId = useAppSelector((s) => s.auth.user?.id)
  const userRole = useAppSelector((s) => s.auth.user?.role)
  const [toggleVote] = useToggleReplyVoteMutation()
  const [deleteReply] = useDeleteReplyMutation()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleVote = async () => {
    try {
      await toggleVote({ replyId: reply.id, questionId }).unwrap()
    } catch {
      toast.error('Failed to toggle vote')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteReply({ replyId: reply.id, questionId }).unwrap()
      toast.success('Reply deleted')
    } catch {
      toast.error('Failed to delete reply')
    }
  }

  const canDelete = userRole !== 'student' || userId === reply.user?.id

  return (
    <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
      <UserAvatar src={reply.user?.pictureThumbnail} name={reply.user?.name} size="md" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">{reply.user?.name}</span>
          <span className="text-xs text-muted-foreground">{formatDate(reply.updatedAt)}</span>
        </div>
        <div
          className="text-sm prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: reply.body }}
        />
      </div>

      <div className="flex flex-col items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1 text-xs h-7 px-2 ${reply.isUpvoted ? 'text-primary' : 'text-muted-foreground'}`}
          onClick={handleVote}
        >
          <CircleArrowUp className="size-4" strokeWidth={reply.isUpvoted ? 2.2 : 2} />
          {reply.upvotes}
        </Button>
        {canDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-destructive"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="size-3" />
          </Button>
        )}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete Reply"
        description="Are you sure you want to delete this reply?"
        onConfirm={handleDelete}
        confirmLabel="Delete"
      />
    </div>
  )
}
