import { useState } from 'react'
import { RichTextEditor } from '@/components/shared/RichTextEditor'

interface AnnouncementFormProps {
  onSubmit: (title: string, body: string) => void
  onCancel: () => void
}

export function AnnouncementForm({ onSubmit, onCancel }: AnnouncementFormProps) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  return (
    <RichTextEditor
      value={body}
      onChange={setBody}
      title={title}
      onTitleChange={setTitle}
      showTitle
      titlePlaceholder="Announcement title"
      placeholder="Write your announcement…"
      onSubmit={() => { if (title && body) onSubmit(title, body) }}
      onCancel={onCancel}
      submitLabel="Publish"
    />
  )
}
