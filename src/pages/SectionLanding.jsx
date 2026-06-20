import { useLocation, NavLink } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { sidebarNav } from '../data/sidebarNav.js'

export default function SectionLanding() {
  const location = useLocation()
  const section = sidebarNav.find((item) => item.path === location.pathname)

  if (!section) {
    return (
      <div className="rounded-4xl border border-slate-800/70 bg-slate-950/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <h1 className="text-2xl font-semibold text-white">Section not found</h1>
        <p className="mt-3 text-slate-400">The requested section does not exist.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section className="rounded-4xl border border-slate-800/70 bg-slate-950/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">{section.title}</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">{section.title}</h1>
            <p className="mt-3 max-w-2xl text-slate-400">{section.description}</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300">
            {section.items.length} sections
          </div>
        </div>

        {section.items.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="group flex flex-col justify-between rounded-[1.75rem] border border-slate-800/70 bg-slate-900/80 p-6 shadow-sm shadow-slate-950/20 transition hover:border-[#F59E0B]/50 hover:bg-slate-900"
              >
                <div>
                  <p className="text-lg font-semibold text-white">{item.label}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{item.description}</p>
                </div>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#F59E0B] opacity-0 transition group-hover:opacity-100">
                  View section
                  <ChevronRight className="h-4 w-4" />
                </div>
              </NavLink>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[1.75rem] border border-slate-800/70 bg-slate-900/80 p-12 text-center text-slate-400 shadow-sm shadow-slate-950/20">
            <p className="text-lg font-semibold text-slate-100">Section is empty</p>
            <p className="mt-3 max-w-2xl mx-auto leading-7">
              No subsections have been defined for this category yet.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}