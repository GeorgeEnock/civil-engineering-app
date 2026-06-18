import { useLocation } from 'react-router-dom'
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
            Section landing
          </div>
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-slate-800/70 bg-slate-900/80 p-12 text-center text-slate-400 shadow-sm shadow-slate-950/20">
          <p className="text-lg font-semibold text-slate-100">Section is empty</p>
          <p className="mt-3 max-w-2xl mx-auto leading-7">
            Select an item from the sidebar to view more details for this section.
          </p>
        </div>
      </section>
    </div>
  )
}
