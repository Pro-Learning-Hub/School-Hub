import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { loginSuccess } from '@/store/slices/authSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

const schema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const courseId = import.meta.env.VITE_COURSE_ID

interface RegisterFormProps {
  onSuccess?: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const dispatch = useAppDispatch()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setServerError('')
    try {
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userData: { name: data.name, email: data.email, password: data.password },
          courseId,
        }),
      })
      const json = await response.json()
      if (!response.ok) {
        throw new Error(json.message || 'Registration failed')
      }
      dispatch(loginSuccess({ token: json.accessToken, user: json.user }))
      toast.success('Account created successfully!')
      onSuccess?.()
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Registration failed')
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
        <Label htmlFor="reg-name">Full Name</Label>
        <Input id="reg-name" placeholder="Jane Doe" {...register('name')} aria-invalid={!!errors.name} />
        {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
      </div>

      <div className="grid gap-1">
        <Label htmlFor="reg-email">Email</Label>
        <Input id="reg-email" type="email" placeholder="you@example.com" {...register('email')} aria-invalid={!!errors.email} />
        {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
      </div>

      <div className="grid gap-1">
        <Label htmlFor="reg-password">Password</Label>
        <Input id="reg-password" type="password" placeholder="••••••••" {...register('password')} aria-invalid={!!errors.password} />
        {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
      </div>

      <div className="grid gap-1">
        <Label htmlFor="reg-confirm">Confirm Password</Label>
        <Input id="reg-confirm" type="password" placeholder="••••••••" {...register('confirmPassword')} aria-invalid={!!errors.confirmPassword} />
        {errors.confirmPassword && <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account…' : 'Create Account'}
      </Button>
    </form>
  )
}
