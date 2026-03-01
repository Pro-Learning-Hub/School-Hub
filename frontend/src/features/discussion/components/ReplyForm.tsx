import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface ReplyFormProps {
  onSubmit: (body: string) => void
  onCancel?: () => void
  isLoading?: boolean
}

export function ReplyForm({ onSubmit, onCancel, isLoading }: ReplyFormProps) {
  const [body, setBody] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (body.trim()) {
      onSubmit(body.trim())
      setBody('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-4 space-y-3">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your answer…"
        className="min-h-28"
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        )}
        <Button type="submit" disabled={isLoading || !body.trim()}>
          {isLoading ? 'Posting…' : 'Post Reply'}
        </Button>
      </div>
    </form>
  )
}
