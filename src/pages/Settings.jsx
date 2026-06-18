import { useEffect, useState } from 'react'
import { Cog, ShieldCheck, SlidersHorizontal, Key } from 'lucide-react'
import { settingsOptions } from '../data/appData.js'
import { supabase } from '../supabase.js'

export default function Settings() {
  const [currentUser, setCurrentUser] = useState(null)
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [status, setStatus] = useState({ message: '', error: '' })

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) setCurrentUser(session.user)
    }
    getSession()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setStatus({ message: '', error: '' })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!currentUser) {
      setStatus({ message: '', error: 'Please sign in before changing your password.' })
      return
    }

    const { currentPassword, newPassword, confirmPassword } = form
    if (!currentPassword || !newPassword || !confirmPassword) {
      setStatus({ message: '', error: 'All fields are required.' })
      return
    }

    if (newPassword !== confirmPassword) {
      setStatus({ message: '', error: 'New password and confirmation must match.' })
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      setStatus({ message: '', error: error.message })
    } else {
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setStatus({ message: 'Password updated successfully.', error: '' })
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-4xl border border-slate-800/70 bg-slate-950/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Settings</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Project controls and configuration</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300">
            <Cog className="h-4 w-4 text-[#F59E0B]" /> System settings
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {settingsOptions.map((option) => (
            <div key={option.title} className="rounded-[1.75rem] border border-slate-800/70 bg-slate-900/80 p-6 shadow-sm shadow-slate-950/20">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#F59E0B]/10 text-[#F59E0B]">
                  {option.title.includes('Defaults') ? <SlidersHorizontal className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">{option.title}</p>
                </div>
              </div>
              <p className="mt-6 text-sm leading-6 text-slate-400">{option.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-4xl border border-slate-800/70 bg-slate-950/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Account security</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Change your password</h2>
            <p className="mt-2 text-sm text-slate-400">
              Update your password for {currentUser?.email ?? 'your account'}.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300">
            <Key className="h-4 w-4 text-[#F59E0B]" /> Password reset
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-3">
          <label className="space-y-2 text-sm text-slate-300">
            Current password
            <input
              name="currentPassword"
              type="password"
              value={form.currentPassword}
              onChange={handleChange}
              className="w-full rounded-3xl border border-slate-700/80 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-[#F59E0B]"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            New password
            <input
              name="newPassword"
              type="password"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full rounded-3xl border border-slate-700/80 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-[#F59E0B]"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            Confirm new password
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-3xl border border-slate-700/80 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-[#F59E0B]"
            />
          </label>

          {status.error ? (
            <div className="sm:col-span-3 rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{status.error}</div>
          ) : null}
          {status.message ? (
            <div className="sm:col-span-3 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{status.message}</div>
          ) : null}

          <div className="sm:col-span-3">
            <button
              type="submit"
              className="rounded-full bg-[#F59E0B] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#d98f00]"
            >
              Update password
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
