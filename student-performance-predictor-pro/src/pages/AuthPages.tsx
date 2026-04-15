import type { ReactNode } from 'react'
import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldEllipsis, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { NeuralHeroScene } from '../components/three/NeuralHeroScene'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
import {
  fetchMe,
  forgotPassword,
  getApiErrorMessage,
  login,
  resetPassword,
  signup,
  verify2FA,
} from '../lib/api'
import { clearSessionTokens, storeDemoSession, storeSessionTokens } from '../lib/session'
import { useAppStore } from '../store/appStore'

const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Minimum 8 characters'),
})

type LoginValues = z.infer<typeof loginSchema>

const signupSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Minimum 8 characters'),
  role: z.enum(['student', 'teacher']),
})

type SignupValues = z.infer<typeof signupSchema>

function AuthLayout({
  title,
  subtitle,
  spotlight,
  actions,
  children,
}: {
  title: string
  subtitle: string
  spotlight: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="min-h-screen overflow-hidden">
      <div className="grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative hidden overflow-hidden border-r border-white/10 bg-[linear-gradient(180deg,rgba(2,6,23,0.9),rgba(2,6,23,0.72))] px-8 py-10 lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.18),transparent_34%)]" />
          <div className="relative z-10">
            <p className="text-[0.72rem] uppercase tracking-[0.34em] text-cyan-300/80">
              Student Performance Predictor Pro
            </p>
            <h1 className="mt-6 max-w-xl text-5xl font-bold leading-[0.95] text-white">
              Secure access to your
              <span className="aurora-text block">AI performance cockpit.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-slate-300">{spotlight}</p>
          </div>

          <div className="relative z-10 mt-10">
            <NeuralHeroScene className="min-h-[28rem]" />
          </div>

          <div className="relative z-10 flex items-center gap-3 text-sm text-slate-300">
            <ShieldEllipsis className="size-4 text-cyan-300" />
            Secure sign-in, premium experience, and confidence-aware forecasting.
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-8">
          <motion.div
            initial={{ opacity: 0, x: 26 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full max-w-xl"
          >
            <Card className="overflow-hidden border-white/10 bg-[linear-gradient(180deg,rgba(8,15,34,0.92),rgba(8,15,34,0.72))] p-0">
              <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-6">
                <div>
                  <p className="text-[0.72rem] uppercase tracking-[0.34em] text-cyan-200/80">Authentication</p>
                  <h2 className="mt-3 text-3xl font-bold text-white">{title}</h2>
                  <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
                </div>
                {actions && <div className="shrink-0">{actions}</div>}
              </div>
              <div className="px-6 py-6">{children}</div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}


function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setAuthenticated } = useAppStore()
  const redirectTo = typeof location.state?.from === 'string' ? location.state.from : '/dashboard'
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })
  const [tempToken, setTempToken] = useState('')
  const [code, setCode] = useState('')

  async function finalizeLogin(accessToken: string, refreshToken: string) {
    storeSessionTokens(accessToken, refreshToken)
    const user = await fetchMe(accessToken)
    setAuthenticated(user)
    toast.success('Login successful')
    navigate(redirectTo)
  }

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const result = await login(values)
      if (result.requires_2fa && result.temp_token) {
        setTempToken(result.temp_token)
        toast.info('2FA code required')
        return
      }

      if (!result.access_token || !result.refresh_token) {
        throw new Error('Missing session tokens')
      }

      await finalizeLogin(result.access_token, result.refresh_token)
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Login failed. Check your credentials.'))
    }
  })

  const verifyCode = async () => {
    try {
      const result = await verify2FA(tempToken, code)
      if (!result.access_token || !result.refresh_token) {
        throw new Error('Missing session tokens')
      }
      await finalizeLogin(result.access_token, result.refresh_token)
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Invalid 2FA code'))
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <label className="block space-y-2">
        <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Email</span>
        <Input placeholder="learner@campus.ai" {...form.register('email')} />
        {form.formState.errors.email && (
          <p className="text-xs text-rose-300">{form.formState.errors.email.message}</p>
        )}
      </label>

      <label className="block space-y-2">
        <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Password</span>
        <Input type="password" placeholder="Enter your password" {...form.register('password')} />
        {form.formState.errors.password && (
          <p className="text-xs text-rose-300">{form.formState.errors.password.message}</p>
        )}
      </label>

      <Button className="w-full" size="lg" disabled={form.formState.isSubmitting}>
        Enter dashboard
        <ArrowRight className="ml-2 size-4" />
      </Button>

      <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
        Google and GitHub sign-in are hidden until the backend OAuth routes are configured. This avoids dead-end
        auth buttons and keeps the login flow trustworthy.
      </div>

      {tempToken && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-400/10 p-4"
        >
          <p className="text-[0.72rem] uppercase tracking-[0.24em] text-cyan-100/80">2FA required</p>
          <p className="mt-2 text-sm text-slate-200">Enter the 6-digit verification code from your authenticator app.</p>
          <div className="mt-4 flex gap-2">
            <Input placeholder="123456" value={code} onChange={(event) => setCode(event.target.value)} />
            <Button type="button" onClick={verifyCode}>
              Verify
            </Button>
          </div>
        </motion.div>
      )}
    </form>
  )
}

function DemoLoginButton() {
  const navigate = useNavigate()
  const { setAuthenticated } = useAppStore()

  const handleDemoLogin = () => {
    clearSessionTokens()
    const demoUser = storeDemoSession('student')
    setAuthenticated(demoUser)
    toast.success('Demo session started')
    navigate('/student')
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleDemoLogin}>
      Demo login
    </Button>
  )
}


function SignupForm() {
  const navigate = useNavigate()
  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { full_name: '', email: '', password: '', role: 'student' },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await signup(values)
      toast.success('Account created successfully. Please log in.')
      navigate('/login')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Signup failed. Email may already be registered.'))
    }
  })

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <label className="block space-y-2">
        <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Full name</span>
        <Input placeholder="Sneh" {...form.register('full_name')} />
        {form.formState.errors.full_name && (
          <p className="text-xs text-rose-300">{form.formState.errors.full_name.message}</p>
        )}
      </label>
      <label className="block space-y-2">
        <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Email</span>
        <Input placeholder="learner@campus.ai" {...form.register('email')} />
        {form.formState.errors.email && (
          <p className="text-xs text-rose-300">{form.formState.errors.email.message}</p>
        )}
      </label>
      <label className="block space-y-2">
        <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Password</span>
        <Input type="password" placeholder="Create a secure password" {...form.register('password')} />
        {form.formState.errors.password && (
          <p className="text-xs text-rose-300">{form.formState.errors.password.message}</p>
        )}
      </label>
      <label className="block space-y-2">
        <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Role</span>
        <select
          className="flex h-12 w-full rounded-[1.15rem] border border-white/12 bg-[linear-gradient(180deg,rgba(2,6,23,0.88),rgba(15,23,42,0.75))] px-4 text-sm text-slate-100 focus-visible:border-cyan-300/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/30"
          {...form.register('role')}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
      </label>
      <Button className="w-full" size="lg" disabled={form.formState.isSubmitting}>
        Create account
        <Sparkles className="ml-2 size-4" />
      </Button>
    </form>
  )
}


export function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Access your cinematic AI workspace."
      spotlight="Step into a premium product layer built for confidence-aware forecasting, intervention planning, and academic intelligence."
      actions={<DemoLoginButton />}
    >
      <LoginForm />
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
        <p>
          No account?{' '}
          <Link to="/signup" className="text-cyan-300">
            Sign up
          </Link>
        </p>
        <Link to="/forgot-password" className="text-cyan-300">
          Forgot password?
        </Link>
      </div>
    </AuthLayout>
  )
}


export function SignupPage() {
  return (
    <AuthLayout
      title="Create your AI account"
      subtitle="Launch the academic performance cockpit in minutes."
      spotlight="Bring students and teachers into one immersive product with layered analytics, prediction workflows, and intervention intelligence."
      actions={<DemoLoginButton />}
    >
      <SignupForm />
      <div className="mt-6 text-sm text-slate-400">
        Already registered?{' '}
        <Link to="/login" className="text-cyan-300">
          Login
        </Link>
      </div>
    </AuthLayout>
  )
}


export function ForgotPasswordPage() {
  const [params] = useSearchParams()
  const resetToken = params.get('token')
  const form = useForm<{ email: string; newPassword: string }>({
    defaultValues: { email: '', newPassword: '' },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (resetToken) {
        await resetPassword(resetToken, values.newPassword)
        toast.success('Password reset successful')
      } else {
        await forgotPassword(values.email)
        toast.success('Reset link sent if email exists')
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not process request'))
    }
  })

  return (
    <AuthLayout
      title={resetToken ? 'Choose a new password' : 'Reset password'}
      subtitle="We will help you recover access securely."
      spotlight="Security, elegant UX, and speed matter just as much on utility flows as they do on flagship dashboards."
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        {resetToken ? (
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.24em] text-slate-400">New password</span>
            <Input type="password" placeholder="Create a new password" {...form.register('newPassword')} />
          </label>
        ) : (
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Email</span>
            <Input placeholder="learner@campus.ai" {...form.register('email')} />
          </label>
        )}
        <Button className="w-full" size="lg" disabled={form.formState.isSubmitting}>
          {resetToken ? 'Reset password' : 'Send reset link'}
        </Button>
      </form>
      <div className="mt-6 text-sm text-slate-400">
        <Link to="/login" className="text-cyan-300">
          Back to login
        </Link>
      </div>
    </AuthLayout>
  )
}
