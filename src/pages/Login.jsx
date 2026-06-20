import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase.js'

const defaultForm = {
  username: '',
  email: '',
  password: '',
}

// A password-reset email link lands here with "type=recovery" in the URL.
// Computed once, outside of any effect, so it can be used as a pure initial
// value for useState below instead of calling setState synchronously inside
// an effect (which React flags as an impure render side effect).
function checkIsRecoveryLink() {
  if (typeof window === 'undefined') return false
  return window.location.hash.includes('type=recovery') || window.location.search.includes('type=recovery')
}

export default function Login() {
  const [isRecoveryFlow] = useState(checkIsRecoveryLink)
  const [loading, setLoading] = useState(() => !checkIsRecoveryLink())
  const [mode, setMode] = useState('signin')
  const [form, setForm] = useState(defaultForm)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [forgotMode, setForgotMode] = useState(false)
  const [changePasswordMode, setChangePasswordMode] = useState(() => checkIsRecoveryLink())
  const [passwordChangeForm, setPasswordChangeForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [signingIn, setSigningIn] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // If this is a recovery link, the change-password form is already
    // showing (set via the initial state above) - there's nothing left to
    // do here, so skip the normal "is anyone already logged in" check
    // entirely rather than letting it redirect away from the reset form.
    if (isRecoveryFlow) return

    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) navigate('/')
      setLoading(false)
    }
    checkUser()
    const timer = window.setTimeout(() => setLoading(false), 800)
    return () => window.clearTimeout(timer)
  }, [navigate, isRecoveryFlow])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setError('')
    setMessage('')
  }

  function handlePasswordChangeFormChange(event) {
    const { name, value } = event.target
    setPasswordChangeForm((current) => ({ ...current, [name]: value }))
    setError('')
    setMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const email = form.email.trim().toLowerCase()
    const password = form.password.trim()

    if (changePasswordMode) {
      const { currentPassword, newPassword, confirmPassword } = passwordChangeForm

      if (!isRecoveryFlow && !currentPassword) {
        setError('Please enter your current password.')
        return
      }
      if (!newPassword || !confirmPassword) {
        setError('Please fill in the new password fields.')
        return
      }
      if (newPassword !== confirmPassword) {
        setError('New password and confirmation do not match.')
        return
      }
      if (newPassword.length < 6) {
        setError('New password must be at least 6 characters.')
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user?.email) {
        setError('You must be signed in to change your password.')
        return
      }

      // Skip re-authentication during a password-recovery flow (the whole
      // point of "forgot password" is that the user doesn't know their old
      // password). The temporary recovery session from the email link is
      // already enough authorization to set a new one. Outside of recovery
      // (e.g. changing password from a logged-in session), still require
      // the current password to prevent a stale session being used alone.
      if (!isRecoveryFlow) {
        const { error: reauthError } = await supabase.auth.signInWithPassword({
          email: session.user.email,
          password: currentPassword,
        })
        if (reauthError) {
          setError('Current password is incorrect.')
          return
        }
      }

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
      if (updateError) {
        setError(updateError.message)
        return
      }

      setMessage('Password changed successfully. Please sign in again with your new password.')
      setChangePasswordMode(false)
      setMode('signin')
      setPasswordChangeForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      await supabase.auth.signOut()
      // Clear the recovery tokens out of the URL so refreshing the page
      // doesn't trigger the recovery flow again.
      window.history.replaceState(null, '', window.location.pathname)
      return
    }

    if (forgotMode) {
      if (!email) {
        setError('Please enter your email address.')
        return
      }
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      })
      if (error) setError(error.message)
      else setMessage('Password reset link has been sent to your email.')
      return
    }

    if (!email || !password || (mode === 'register' && !form.username.trim())) {
      setError('Please complete all required fields.')
      return
    }

    if (mode === 'signin') {
      setSigningIn(true)
      const signInStart = Date.now()
      const minimumSplashDuration = 5000 // 5 seconds

      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed')) {
          setError('Your email is not confirmed yet. Please check your inbox and click the confirmation link before signing in.')
        } else {
          setError(error.message)
        }
        setSigningIn(false)
        return
      }

      // Keep the "Welcome to CivilPro Engineering" splash visible for at
      // least 5 seconds in total, even though sign-in itself finishes faster.
      const elapsed = Date.now() - signInStart
      const remaining = minimumSplashDuration - elapsed
      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining))
      }

      navigate('/')
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: form.username },
          emailRedirectTo: `${window.location.origin}/login`,
        }
      })

      if (error) {
        if (error.message.toLowerCase().includes('rate exceeded')) {
          setError('Too many registration attempts for this email. Please wait a few minutes and try again.')
        } else {
          setError(error.message)
        }
        return
      }
      setError('')
      setMessage('Account created! Please check your email and confirm your address before signing in.')
      setMode('signin')
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
        <div className="flex flex-col items-center gap-6 rounded-4xl border border-white/10 bg-slate-950/80 p-10 shadow-[0_25px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-900/90 shadow-lg shadow-slate-950/30">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-[#F59E0B] to-[#F97316] shadow-inner shadow-orange-500/40">
              <span className="text-3xl font-black tracking-tight text-slate-950">CP</span>
            </div>
          </div>
          <div className="space-y-2 text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">CivilPro</p>
            <h1 className="text-3xl font-semibold">Preparing your workspace</h1>
            <p className="max-w-sm text-sm text-slate-400">Loading the dashboard, sign in screen, and saved workspace data.</p>
          </div>
          <div className="relative h-2 w-72 overflow-hidden rounded-full bg-slate-800/90">
            <div className="absolute inset-y-0 left-0 w-2/5 animate-[move-right_1.6s_ease-in-out_infinite] rounded-full bg-linear-to-r from-[#F59E0B] to-[#F97316]" />
          </div>
        </div>
      </main>
    )
  }

  if (signingIn) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-6 rounded-4xl border border-slate-700/80 bg-slate-900/90 p-10 shadow-[0_30px_90px_rgba(15,23,42,0.35)]">
          <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-slate-800 shadow-inner shadow-slate-900/60">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-t-[#F59E0B] border-slate-800 bg-slate-950 animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">CivilPro</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Welcome to CivilPro Engineering</h1>
            <p className="mt-2 max-w-md text-sm text-slate-400">Just a moment while we load your workspace and secure your account.</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.95fr] lg:items-center">
        <section className="rounded-4xl border border-slate-800/80 bg-slate-900/80 p-8 sm:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Welcome to CivilPro</p>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Secure access for your engineering projects.</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
            Sign in with your existing account or register a new one to start tracking your project posts, categories, and shared site reports.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setMode('signin')
                setForgotMode(false)
                setError('')
                setMessage('')
              }}
              className={`rounded-3xl px-6 py-4 text-sm font-semibold transition ${
                mode === 'signin' && !forgotMode ? 'bg-[#F59E0B] text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register')
                setForgotMode(false)
                setError('')
                setMessage('')
              }}
              className={`rounded-3xl px-6 py-4 text-sm font-semibold transition ${
                mode === 'register' ? 'bg-[#F59E0B] text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Register
            </button>
          </div>
        </section>

        <section className="rounded-4xl border border-slate-800/80 bg-slate-950/90 p-8 sm:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                {changePasswordMode
                  ? isRecoveryFlow ? 'Password Recovery' : 'Change Password'
                  : forgotMode
                  ? 'Password Recovery'
                  : mode === 'signin'
                  ? 'Sign In'
                  : 'Register'}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                {changePasswordMode
                  ? isRecoveryFlow ? 'Set your new password' : 'Update your password'
                  : forgotMode
                  ? 'Reset your account password'
                  : mode === 'signin'
                  ? 'Access your account'
                  : 'Create a new account'}
              </h2>
            </div>
            <span className="rounded-full bg-slate-800 px-3 py-2 text-xs text-slate-400">Safe & simple</span>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {mode === 'register' && !forgotMode ? (
              <label className="block text-sm text-slate-300">
                Username
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className="mt-2 w-full rounded-3xl border border-slate-700/90 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-[#F59E0B]"
                />
              </label>
            ) : null}

            <label className="block text-sm text-slate-300">
              Email address
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-3xl border border-slate-700/90 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-[#F59E0B]"
              />
            </label>

            {!forgotMode && !changePasswordMode ? (
              <label className="block text-sm text-slate-300">
                Password
                <div className="relative mt-2">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-3xl border border-slate-700/90 bg-slate-900 px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-[#F59E0B]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute inset-y-0 right-3 inline-flex items-center rounded-full px-2 text-slate-400 transition hover:text-white"
                  >
                    {showPassword ? (
                      <span aria-label="Hide password">👁️‍🗨️</span>
                    ) : (
                      <span aria-label="Show password">👁️</span>
                    )}
                  </button>
                </div>
              </label>
            ) : null}

            {changePasswordMode ? (
              <>
                {!isRecoveryFlow ? (
                  <label className="block text-sm text-slate-300">
                    Current password
                    <input
                      name="currentPassword"
                      type="password"
                      value={passwordChangeForm.currentPassword}
                      onChange={handlePasswordChangeFormChange}
                      placeholder="Enter current password"
                      className="mt-2 w-full rounded-3xl border border-slate-700/90 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-[#F59E0B]"
                    />
                  </label>
                ) : null}
                <label className="block text-sm text-slate-300">
                  New password
                  <input
                    name="newPassword"
                    type="password"
                    value={passwordChangeForm.newPassword}
                    onChange={handlePasswordChangeFormChange}
                    placeholder="Create a new password"
                    className="mt-2 w-full rounded-3xl border border-slate-700/90 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-[#F59E0B]"
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Confirm new password
                  <input
                    name="confirmPassword"
                    type="password"
                    value={passwordChangeForm.confirmPassword}
                    onChange={handlePasswordChangeFormChange}
                    placeholder="Confirm new password"
                    className="mt-2 w-full rounded-3xl border border-slate-700/90 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-[#F59E0B]"
                  />
                </label>
              </>
            ) : null}

            {error ? (
              <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
            ) : null}
            {message ? (
              <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{message}</div>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-3xl bg-[#F59E0B] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#d98f00]"
            >
              {changePasswordMode
                ? 'Change password'
                : forgotMode
                ? 'Send reset link'
                : mode === 'signin'
                ? 'Sign In'
                : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              {changePasswordMode
                ? 'Need to sign in instead? '
                : forgotMode
                ? 'Remembered your password? '
                : mode === 'signin'
                ? 'Don’t have an account yet? '
                : 'Already registered? '}
              <button
                type="button"
                onClick={() => {
                  if (changePasswordMode) {
                    setChangePasswordMode(false)
                    setMode('signin')
                  } else if (forgotMode) {
                    setForgotMode(false)
                    setMode('signin')
                  } else {
                    setMode(mode === 'signin' ? 'register' : 'signin')
                  }
                  setError('')
                  setMessage('')
                  setPasswordChangeForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                }}
                className="font-semibold text-[#F59E0B] hover:text-[#f7b951]"
              >
                {changePasswordMode
                  ? 'Back to sign in'
                  : forgotMode
                  ? 'Back to sign in'
                  : mode === 'signin'
                  ? 'Register now'
                  : 'Sign in instead'}
              </button>
            </p>

            <div className="flex items-center gap-4">
              {!forgotMode && mode === 'signin' ? (
                <button
                  type="button"
                  onClick={() => {
                    setForgotMode(true)
                    setChangePasswordMode(false)
                    setError('')
                    setMessage('')
                  }}
                  className="font-semibold text-[#F59E0B] hover:text-[#f7b951]"
                >
                  Forgot password?
                </button>
              ) : null}

              {!forgotMode && mode === 'signin' ? (
                <button
                  type="button"
                  onClick={() => {
                    setChangePasswordMode(true)
                    setForgotMode(false)
                    setError('')
                    setMessage('')
                  }}
                  className="font-semibold text-[#F59E0B] hover:text-[#f7b951]"
                >
                  Change password
                </button>
              ) : null}
            </div>
          </div>

          <p className="mt-8 text-xs uppercase tracking-[0.28em] text-slate-600">
            For your security, you'll need to sign in again each time you open the app.
          </p>
        </section>
      </div>
    </main>
  )
}