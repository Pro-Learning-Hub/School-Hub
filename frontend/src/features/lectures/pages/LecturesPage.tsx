import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { useGetSectionsQuery } from '../lecturesApiSlice'
import { SectionAccordion } from '../components/SectionAccordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useAppSelector } from '@/store/hooks'
import { getSocket } from '@/lib/socket'
import { api } from '@/lib/api'
import { useAppDispatch } from '@/store/hooks'

const courseId = import.meta.env.VITE_COURSE_ID

export function LecturesPage() {
  const userRole = useAppSelector((s) => s.auth.user?.role)
  const isSocketReady = useAppSelector((s) => s.auth.isSocketReady)
  const dispatch = useAppDispatch()
  const [search, setSearch] = useState('')

  const { data, isLoading, isError } = useGetSectionsQuery()

  // Join socket room
  useEffect(() => {
    const socket = getSocket()
    if (socket && courseId) {
      const room = `sections-${courseId}`
      socket.emit('joinRoom', room)
      return () => { socket.emit('leaveRoom', room) }
    }
  }, [isSocketReady])

  // Socket real-time updates
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const invalidate = () => dispatch(api.util.invalidateTags(['Sections']))

    socket.on('lectureCreated', invalidate)
    socket.on('sectionCreated', invalidate)
    socket.on('lectureUpdated', invalidate)
    socket.on('lectureDeleted', invalidate)

    return () => {
      socket.off('lectureCreated', invalidate)
      socket.off('sectionCreated', invalidate)
      socket.off('lectureUpdated', invalidate)
      socket.off('lectureDeleted', invalidate)
    }
  }, [dispatch, isSocketReady])

  const filteredSections = data?.sections
    ?.map((section) => ({
      ...section,
      lectures: section.lectures?.filter((lec) => {
        const q = search.toLowerCase()
        return (
          lec.title.toLowerCase().includes(q) ||
          lec.description?.toLowerCase().includes(q) ||
          lec.tags?.some((t) => t.toLowerCase().includes(q))
        )
      }),
    }))
    .filter((s) => !search || (s.lectures && s.lectures.length > 0))

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Lectures</h1>
        <p className="text-muted-foreground">
          Find everything you need to enhance your learning experience.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search lectures, descriptions, and tags…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>Failed to load lectures. Please try again.</AlertDescription>
        </Alert>
      )}

      {!isLoading && !isError && filteredSections && (
        filteredSections.length > 0 ? (
          <SectionAccordion sections={filteredSections} />
        ) : (
          <p className="text-center text-muted-foreground py-12">
            {search ? 'No lectures match your search.' : 'No lectures yet.'}
          </p>
        )
      )}

      {userRole && userRole !== 'student' && (
        <Button
          asChild
          className="fixed bottom-6 right-6 shadow-lg gap-2"
          size="lg"
        >
          <Link to="/lectures/new">
            <Plus className="size-5" />
            Add Lecture
          </Link>
        </Button>
      )}
    </div>
  )
}
