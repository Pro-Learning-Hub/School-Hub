import { useState } from 'react'
import type { Announcement } from '@/types/api.types'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { RichTextEditor } from '@/components/shared/RichTextEditor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EllipsisVertical, SquarePen, Trash2, MessageSquare } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useAppSelector } from '@/store/hooks'
import {
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useGetAnnouncementCommentsQuery,
  useAddAnnouncementCommentMutation,
} from '../announcementsApiSlice'
import { toast } from 'sonner'

interface AnnouncementCardProps {
  announcement: Announcement
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const userRole = useAppSelector((s) => s.auth.user?.role)
  const [editMode, setEditMode] = useState(false)
  const [editTitle, setEditTitle] = useState(announcement.title)
  const [editBody, setEditBody] = useState(announcement.body)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')

  const [updateAnnouncement, { isLoading: isUpdating }] = useUpdateAnnouncementMutation()
  const [deleteAnnouncement] = useDeleteAnnouncementMutation()
  const [addComment] = useAddAnnouncementCommentMutation()

  const { data: comments = [] } = useGetAnnouncementCommentsQuery(announcement.id, {
    skip: !showComments,
  })

  const handleSaveEdit = async () => {
    try {
      await updateAnnouncement({
        announcementId: announcement.id,
        title: editTitle,
        body: editBody,
      }).unwrap()
      toast.success('Announcement updated')
      setEditMode(false)
    } catch {
      toast.error('Failed to update announcement')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteAnnouncement(announcement.id).unwrap()
      toast.success('Announcement deleted')
    } catch {
      toast.error('Failed to delete announcement')
    }
  }

  const handleAddComment = async () => {
    if (!commentText.trim()) return
    try {
      await addComment({ announcementId: announcement.id, comment: commentText }).unwrap()
      setCommentText('')
    } catch {
      toast.error('Failed to add comment')
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <UserAvatar
            src={announcement.user?.pictureThumbnail}
            name={announcement.user?.name}
            size="lg"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{announcement.user?.name}</p>
            <p className="text-xs text-muted-foreground">
              {announcement.role || 'Instructor'} · {formatDate(announcement.updatedAt)}
            </p>
          </div>
          {userRole && userRole !== 'student' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8 shrink-0">
                  <EllipsisVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => { setEditMode(true) }}>
                  <SquarePen className="size-4 mr-2" />Edit
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={() => setConfirmDelete(true)}>
                  <Trash2 className="size-4 mr-2" />Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {editMode ? (
          <RichTextEditor
            value={editBody}
            onChange={setEditBody}
            title={editTitle}
            onTitleChange={setEditTitle}
            showTitle
            onSubmit={handleSaveEdit}
            onCancel={() => { setEditMode(false); setEditTitle(announcement.title); setEditBody(announcement.body) }}
            submitLabel={isUpdating ? 'Saving…' : 'Save'}
          />
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-2">{announcement.title}</h3>
            <div
              className="prose prose-sm dark:prose-invert max-w-none text-sm"
              dangerouslySetInnerHTML={{ __html: announcement.body }}
            />
          </>
        )}

        <Separator className="my-3" />

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="size-4" />
            {announcement.commentsCount} comment{announcement.commentsCount !== 1 ? 's' : ''}
          </Button>
        </div>

        {showComments && (
          <div className="mt-3 space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="flex items-start gap-2 text-sm">
                <UserAvatar src={c.user?.pictureThumbnail} name={c.user?.name} size="sm" />
                <div>
                  <span className="font-medium">{c.user?.name}</span>
                  <span className="text-muted-foreground ml-2">{c.body}</span>
                </div>
              </div>
            ))}

            <div className="flex gap-2 mt-2">
              <input
                className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm outline-none focus-visible:border-ring"
                placeholder="Add a comment…"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment() }}
              />
              <Button size="sm" onClick={handleAddComment}>Post</Button>
            </div>
          </div>
        )}
      </CardContent>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete Announcement"
        description="Are you sure you want to delete this announcement?"
        onConfirm={handleDelete}
        confirmLabel="Delete"
      />
    </Card>
  )
}
