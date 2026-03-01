import { Link } from 'react-router-dom'
import { CircleArrowUp, MessageSquare } from 'lucide-react'
import type { Question } from '@/types/api.types'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { useToggleQuestionVoteMutation } from '../discussionApiSlice'
import { toast } from 'sonner'

interface QuestionCardProps {
  question: Question
  backRoute?: string
}

export function QuestionCard({ question, backRoute = '/discussion' }: QuestionCardProps) {
  const [toggleVote] = useToggleQuestionVoteMutation()

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await toggleVote({ questionId: question.id }).unwrap()
    } catch {
      toast.error('Failed to toggle vote')
    }
  }

  return (
    <div className="flex items-start gap-3 rounded-lg border bg-card p-4 hover:shadow-sm transition-shadow">
      <UserAvatar
        src={question.user?.pictureThumbnail}
        name={question.user?.name}
        size="md"
      />

      <div className="flex-1 min-w-0">
        <Link
          to={`/questions/${question.id}`}
          state={{ backRoute }}
          className="block"
        >
          <h3 className="font-medium text-sm hover:text-primary transition-colors">
            {question.title}
          </h3>
          {question.body && (
            <div
              className="mt-1 text-xs text-muted-foreground line-clamp-2 prose prose-xs"
              dangerouslySetInnerHTML={{ __html: question.body }}
            />
          )}
        </Link>

        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span>{question.user?.name}</span>
          <span>·</span>
          <span>{formatDate(question.updatedAt)}</span>
        </div>
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

        <Link
          to={`/questions/${question.id}`}
          state={{ backRoute }}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageSquare className="size-3" />
          {question.repliesCount}
        </Link>
      </div>
    </div>
  )
}
