import { useState } from 'react'
import { Menu, X, ChevronDown, LogOut } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { appNavLinks } from '../data/appNav.js'
import { sidebarNav } from '../data/sidebarNav.js'
import { supabase } from '../supabase.js'
import { useProjectCounts } from '../hooks/useProjectCounts.js'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState(null)
  const [loggingOut, setLoggingOut] = useState(false)
  const navigate = useNavigate()
  const { sectionCounts } = useProjectCounts()

  const closeAll = () => {
    setOpen(false)
    setOpenGroup(null)
  }

  const toggleGroup = (title) => {
    setOpenGroup((current) => (current === title ? null : title))
  }

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to log out?')) return
    setLoggingOut(true)
    closeAll()
    try {
      await supabase.auth.signOut()
    } finally {
      setLoggingOut(false)
      navigate('/login', { replace: true })
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/95 backdrop-blur-xl shadow-[0_24px_48px_rgba(0,0,0,0.35)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <NavLink to="/" className="group inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.32em] text-slate-100/90">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F59E0B]/10 text-[#F59E0B] shadow-sm shadow-[#F59E0B]/20">
            CP
          </span>
          <span className="text-base text-white">CivilPro Engineering</span>
        </NavLink>

        <nav className="hidden items-center gap-6 lg:flex">
          {appNavLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-200 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            {loggingOut ? 'Logging out...' : 'Log out'}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700/70 bg-slate-950 text-slate-200 transition hover:border-slate-600 lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-slate-800 bg-slate-950/95 px-6 pb-6 lg:hidden">
          <div className="space-y-3 pt-5">
            {appNavLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={closeAll}
                className={({ isActive }) =>
                  `block rounded-3xl px-4 py-3 text-base font-medium transition ${isActive ? 'bg-slate-900 text-white' : 'text-slate-300 hover:bg-slate-900/80 hover:text-white'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-6 border-t border-slate-800 pt-6">
            <p className="px-1 text-xs uppercase tracking-[0.32em] text-slate-500">Browse Sections</p>
            <div className="mt-3 space-y-2">
              {sidebarNav.map((group) => {
                const isGroupOpen = openGroup === group.title
                // The main title's total is the sum of all its subsection
                // counts, so "Construction 24" always matches School 2 +
                // Apartment 15 + ... shown underneath it.
                const groupTotal = group.items.reduce(
                  (sum, item) => sum + (sectionCounts[item.label] || 0),
                  0
                )

                return (
                  <div
                    key={group.title}
                    className="overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-900/40"
                  >
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.title)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left"
                      aria-expanded={isGroupOpen}
                    >
                      <span className="flex flex-col">
                        <span className="flex items-center gap-2">
                          <NavLink
                            to={group.path}
                            end
                            onClick={closeAll}
                            className={({ isActive }) =>
                              `text-lg font-bold ${isActive ? 'text-[#F59E0B]' : 'text-white'}`
                            }
                          >
                            {group.title}
                          </NavLink>
                          <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#F59E0B]/15 px-2.5 py-0.5 text-xs font-bold text-[#F59E0B]">
                            {groupTotal}
                          </span>
                        </span>
                        <span className="mt-1 text-xs text-slate-500">{group.description}</span>
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                          isGroupOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isGroupOpen ? (
                      <div className="space-y-2 px-4 pb-4">
                        {group.items.map((item) => (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={closeAll}
                            className={({ isActive }) =>
                              `flex items-center justify-between gap-3 rounded-2xl border px-4 py-2.5 text-sm transition ${
                                isActive
                                  ? 'border-[#F59E0B] bg-[#F59E0B]/10 text-white'
                                  : 'border-transparent text-slate-300 hover:border-slate-700/80 hover:bg-slate-900/80 hover:text-white'
                              }`
                            }
                          >
                            <span>{item.label}</span>
                            <span className="shrink-0 rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-400">
                              {sectionCounts[item.label] || 0}
                            </span>
                          </NavLink>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-6 border-t border-slate-800 pt-6">
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-500/20 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              {loggingOut ? 'Logging out...' : 'Log out'}
            </button>
          </div>
        </div>
      ) : null}
    </header>
  )
}