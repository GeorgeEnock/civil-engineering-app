import { useState } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { appNavLinks } from '../data/appNav.js'

export default function Navbar() {
  const [open, setOpen] = useState(false)

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

        <div className="hidden items-center gap-4 lg:flex" />

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
        <div className="border-t border-slate-800 bg-slate-950/95 px-6 pb-6 lg:hidden">
          <div className="space-y-3 pt-5">
            {appNavLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block rounded-3xl px-4 py-3 text-base font-medium transition ${isActive ? 'bg-slate-900 text-white' : 'text-slate-300 hover:bg-slate-900/80 hover:text-white'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-3" />
        </div>
      ) : null}
    </header>
  )
}
