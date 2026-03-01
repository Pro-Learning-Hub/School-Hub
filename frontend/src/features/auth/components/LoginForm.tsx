import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useAppDispatch } from '@/store/hooks'
import { loginSuccess } from '@/store/slices/authSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useState } from 'react'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  isAdmin: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const courseId = import.meta.env.VITE_COURSE_ID

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const dispatch = useAppDispatch()
  const [isAdmin, setIsAdmin] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setServerError('')
    const url = isAdmin
      ? `${baseUrl}/auth/admin/login`
      : `${baseUrl}/auth/login`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password, courseId }),
      })
      const json = await response.json()
      if (!response.ok) {
        throw new Error(json.message || 'Login failed')
      }
      dispatch(loginSuccess({ token: json.accessToken, user: json.user }))
      toast.success('Welcome back!')
      onSuccess?.()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed'
      setServerError(msg)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {serverError && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="grid gap-1">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={isAdmin}
          onChange={(e) => setIsAdmin(e.target.checked)}
          className="rounded border-input"
        />
        Sign in as Admin
      </label>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in…' : 'Sign In'}
      </Button>
    </form>
  )
}
