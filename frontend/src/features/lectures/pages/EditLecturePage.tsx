import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Plus, Minus, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useGetLectureQuery,
  useGetSectionTitlesQuery,
  useUpdateLectureMutation,
} from '../lecturesApiSlice'
import type { ResourceLink } from '@/types/api.types'

export function EditLecturePage() {
  const { lectureId } = useParams<{ lectureId: string }>()
  const navigate = useNavigate()
  const { data: sectionTitles = [] } = useGetSectionTitlesQuery()
  const { data, isLoading } = useGetLectureQuery(lectureId ?? '', { skip: !lectureId })
  const [updateLecture, { isLoading: isUpdating }] = useUpdateLectureMutation()

  const lecture = data?.lectureData

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [section, setSection] = useState('')
  const [newSection, setNewSection] = useState('')
  const [sections, setSections] = useState<string[]>([])
  const [youtubeLink, setYoutubeLink] = useState('')
  const [notesLink, setNotesLink] = useState('')
  const [slidesLink, setSlidesLink] = useState('')
  const [demos, setDemos] = useState<ResourceLink[]>([{ title: '', url: '' }])
  const [extras, setExtras] = useState<ResourceLink[]>([{ title: '', url: '' }])

  useEffect(() => {
    if (lecture) {
      setName(lecture.title)
      setDescription(lecture.description)
      setTagsInput(Array.isArray(lecture.tags) ? lecture.tags.join(', ') : '')
      setYoutubeLink(lecture.videoLink || '')
      setNotesLink(lecture.notes || '')
      setSlidesLink(lecture.slides || '')
      setDemos(lecture.demos?.length ? lecture.demos : [{ title: '', url: '' }])
      setExtras(lecture.shorts?.length ? lecture.shorts : [{ title: '', url: '' }])
    }
  }, [lecture])

  useEffect(() => {
    setSections(sectionTitles)
  }, [sectionTitles])

  const addSection = () => {
    if (newSection && !sections.includes(newSection)) {
      setSections([...sections, newSection])
    }
    setNewSection('')
  }

  const handleDemoChange = (i: number, field: keyof ResourceLink, value: string) =>
    setDemos(demos.map((d, j) => (j === i ? { ...d, [field]: value } : d)))
  const handleExtraChange = (i: number, field: keyof ResourceLink, value: string) =>
    setExtras(extras.map((e, j) => (j === i ? { ...e, [field]: value } : e)))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!lectureId) return
    try {
      await updateLecture({
        lectureId,
        data: {
          name,
          description,
          tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
          section,
          youtubeLink,
          notesLink,
          slidesLink,
          demos: demos.filter((d) => d.url),
          extras: extras.filter((e) => e.url),
        },
      }).unwrap()
      toast.success('Lecture updated!')
      navigate(`/lectures/${lectureId}`)
    } catch {
      toast.error('Failed to update lecture')
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Button asChild variant="ghost" className="mb-4 -ml-2">
        <Link to={`/lectures/${lectureId}`}><ArrowLeft className="size-4 mr-2" />Back</Link>
      </Button>

      <h1 className="text-2xl font-bold mb-6">Edit Lecture</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Lecture Name *</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="desc">Description *</Label>
          <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input id="tags" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
        </div>

        <Separator />

        <div className="grid gap-2">
          <Label>Section</Label>
          <div className="flex gap-2">
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring"
            >
              <option value="">Select a section</option>
              {sections.map((s, i) => <option key={i} value={s}>{s}</option>)}
            </select>
            <Input placeholder="New section" value={newSection} onChange={(e) => setNewSection(e.target.value)} />
            <Button type="button" variant="outline" onClick={addSection}>Add</Button>
          </div>
        </div>

        <Separator />

        <div className="grid gap-2">
          <Label htmlFor="yt">YouTube Link</Label>
          <Input id="yt" type="url" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="notes">Notes Link</Label>
          <Input id="notes" type="url" value={notesLink} onChange={(e) => setNotesLink(e.target.value)} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="slides">Slides Link</Label>
          <Input id="slides" type="url" value={slidesLink} onChange={(e) => setSlidesLink(e.target.value)} />
        </div>

        <Separator />

        <div>
          <Label className="mb-2">Demos</Label>
          {demos.map((demo, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <Input placeholder="Demo name" value={demo.title} onChange={(e) => handleDemoChange(i, 'title', e.target.value)} />
              <Input placeholder="Demo URL" type="url" value={demo.url} onChange={(e) => handleDemoChange(i, 'url', e.target.value)} />
              <Button type="button" variant="outline" size="icon" onClick={() => setDemos(demos.filter((_, j) => j !== i))}>
                <Minus className="size-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => setDemos([...demos, { title: '', url: '' }])}>
            <Plus className="size-4 mr-1" />Add Demo
          </Button>
        </div>

        <div>
          <Label className="mb-2">Shorts/Extras</Label>
          {extras.map((extra, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <Input placeholder="Extra title" value={extra.title} onChange={(e) => handleExtraChange(i, 'title', e.target.value)} />
              <Input placeholder="Extra URL" type="url" value={extra.url} onChange={(e) => handleExtraChange(i, 'url', e.target.value)} />
              <Button type="button" variant="outline" size="icon" onClick={() => setExtras(extras.filter((_, j) => j !== i))}>
                <Minus className="size-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => setExtras([...extras, { title: '', url: '' }])}>
            <Plus className="size-4 mr-1" />Add Extra
          </Button>
        </div>

        <Separator />

        <div className="flex gap-3">
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? 'Saving…' : 'Save Changes'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(`/lectures/${lectureId}`)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
