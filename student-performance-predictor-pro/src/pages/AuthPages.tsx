import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { forgotPassword, login, resetPassword, signup, socialLogin, verify2FA } from '../lib/api'

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Minimum 6 characters'),
})

type Values = z.infer<typeof schema>

function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen bg-slate-950 lg:grid-cols-2">
      <div className="hidden bg-[radial-gradient(circle_at_center,#22d3ee22,transparent_50%)] p-10 lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-cyan-200">Student Performance Predictor Pro</p>
          <h2 className="mt-3 text-4xl font-bold text-white">AI-powered academic intelligence</h2>
        </div>
        <p className="text-sm text-slate-400">Predict risk. Improve outcomes. Empower every student.</p>
      </div>
      <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </Card>
      </div>
    </div>
  )
}

function LoginForm() {
  const navigate = useNavigate()
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } })
  const [tempToken, setTempToken] = useState('')
  const [code, setCode] = useState('')

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const result = await login(values)
      if (result.requires_2fa && result.temp_token) {
        setTempToken(result.temp_token)
        toast.info('2FA code required')
        return
      }
      if (result.access_token && result.refresh_token) {
        localStorage.setItem('access_token', result.access_token)
        localStorage.setItem('refresh_token', result.refresh_token)
      }
      toast.success('Login successful')
      navigate('/dashboard')
    } catch {
      toast.error('Login failed. Check your credentials.')
    }
  })

  const verifyCode = async () => {
    try {
      const result = await verify2FA(tempToken, code)
      if (result.access_token && result.refresh_token) {
        localStorage.setItem('access_token', result.access_token)
        localStorage.setItem('refresh_token', result.refresh_token)
      }
      toast.success('2FA verification successful')
      navigate('/dashboard')
    } catch {
      toast.error('Invalid 2FA code')
    }
  }

  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    try {
      const result = await socialLogin(provider)
      if (result.requires_2fa && result.temp_token) {
        setTempToken(result.temp_token)
        toast.info('2FA code required')
        return
      }
      if (result.access_token && result.refresh_token) {
        localStorage.setItem('access_token', result.access_token)
        localStorage.setItem('refresh_token', result.refresh_token)
      }
      toast.success(`Signed in with ${provider === 'google' ? 'Google' : 'GitHub'}`)
      navigate('/dashboard')
    } catch {
      toast.error(`${provider === 'google' ? 'Google' : 'GitHub'} sign-in failed`)
    }
  }

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <Input placeholder="Email" {...form.register('email')} />
      {form.formState.errors.email && <p className="text-xs text-rose-300">{form.formState.errors.email.message}</p>}
      <Input type="password" placeholder="Password" {...form.register('password')} />
      {form.formState.errors.password && <p className="text-xs text-rose-300">{form.formState.errors.password.message}</p>}
      <Button className="w-full">Login</Button>
      <Button type="button" variant="outline" className="w-full" onClick={() => handleSocialSignIn('google')}>
        Sign in with Google
      </Button>
      <Button type="button" variant="outline" className="w-full" onClick={() => handleSocialSignIn('github')}>
        Sign in with GitHub
      </Button>
      {tempToken && (
        <div className="rounded-2xl border border-cyan-300/30 bg-cyan-400/10 p-3">
          <p className="mb-2 text-xs text-cyan-200">Enter 2FA code from your authenticator app</p>
          <div className="flex gap-2">
            <Input placeholder="123456" value={code} onChange={(e) => setCode(e.target.value)} />
            <Button type="button" onClick={verifyCode}>Verify</Button>
          </div>
        </div>
      )}
    </form>
  )
}

const signupSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['student', 'teacher', 'admin']),
})

type SignupValues = z.infer<typeof signupSchema>

function SignupForm() {
  const navigate = useNavigate()
  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { full_name: '', email: '', password: '', role: 'student' },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await signup(values)
      toast.success('Account created successfully. Please login.')
      navigate('/login')
    } catch {
      toast.error('Signup failed. Email may already be registered.')
    }
  })

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <Input placeholder="Full name" {...form.register('full_name')} />
      <Input placeholder="Email" {...form.register('email')} />
      <Input type="password" placeholder="Password" {...form.register('password')} />
      <select className="h-11 w-full rounded-2xl border border-white/20 bg-slate-900/60 px-3 text-sm" {...form.register('role')}>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="admin">Admin / Institution</option>
      </select>
      <Button className="w-full">Create account</Button>
    </form>
  )
}

export function LoginPage() {
  return (
    <AuthLayout title="Welcome back" subtitle="Access your intelligence dashboard">
      <LoginForm />
      <p className="mt-4 text-sm text-slate-400">No account? <Link to="/signup" className="text-cyan-300">Sign up</Link></p>
      <p className="mt-2 text-sm text-slate-400"><Link to="/forgot-password" className="text-cyan-300">Forgot password?</Link></p>
    </AuthLayout>
  )
}

export function SignupPage() {
  return (
    <AuthLayout title="Create account" subtitle="Start your AI learning journey">
      <SignupForm />
      <p className="mt-4 text-sm text-slate-400">Already registered? <Link to="/login" className="text-cyan-300">Login</Link></p>
    </AuthLayout>
  )
}

export function ForgotPasswordPage() {
  const [params] = useSearchParams()
  const resetToken = params.get('token')
  const form = useForm<{ email: string; newPassword: string }>({ defaultValues: { email: '', newPassword: '' } })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (resetToken) {
        await resetPassword(resetToken, values.newPassword)
        toast.success('Password reset successful')
      } else {
        await forgotPassword(values.email)
        toast.success('Reset link sent if email exists')
      }
    } catch {
      toast.error('Could not process request')
    }
  })

  return (
    <AuthLayout title="Reset password" subtitle="We will send a recovery link">
      <form className="space-y-3" onSubmit={onSubmit}>
        {resetToken ? (
          <>
            <Input type="password" placeholder="New password" {...form.register('newPassword')} />
            <Button className="w-full">Reset password</Button>
          </>
        ) : (
          <>
            <Input placeholder="Email" {...form.register('email')} />
            <Button className="w-full">Send reset link</Button>
          </>
        )}
      </form>
      <p className="mt-4 text-sm text-slate-400"><Link to="/login" className="text-cyan-300">Back to login</Link></p>
    </AuthLayout>
  )
}
