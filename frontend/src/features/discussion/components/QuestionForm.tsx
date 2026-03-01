import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface QuestionFormProps {
  onSubmit: (title: string, body: string) => void
  onCancel: () => void
  isLoading?: boolean
}

export function QuestionForm({ onSubmit, onCancel, isLoading }: QuestionFormProps) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) onSubmit(title.trim(), body.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-4 space-y-3">
      <div className="grid gap-1">
        <Label htmlFor="q-title">Question Title *</Label>
        <Input
          id="q-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you want to ask?"
          required
        />
      </div>
      <div className="grid gap-1">
        <Label htmlFor="q-body">Details (optional)</Label>
        <Textarea
          id="q-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Provide more context…"
          className="min-h-24"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading || !title.trim()}>
          {isLoading ? 'Posting…' : 'Post Question'}
        </Button>
      </div>
    </form>
  )
}
