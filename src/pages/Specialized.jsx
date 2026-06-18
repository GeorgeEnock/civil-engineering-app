import { Sparkles, Toolbox } from 'lucide-react'
import { sidebarNav } from '../data/sidebarNav.js'

export default function Specialized() {
  const section = sidebarNav.find((item) => item.path === '/specialized')
  return (
    <div className="space-y-8">
      <section className="rounded-4xl border border-slate-800/70 bg-slate-950/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Specialized</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Specialized fabrication and installation work</h1>
            <p className="mt-3 max-w-2xl text-slate-400">{section?.description}</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300">
            <Sparkles className="h-4 w-4" /> {section?.items.length} focus areas
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {section?.items.map((item) => (
            <div key={item.path} className="rounded-[1.75rem] border border-slate-800/70 bg-slate-900/80 p-6 shadow-sm shadow-slate-950/20">
              <div className="flex items-center gap-3 text-slate-300">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#F59E0B]/10 text-[#F59E0B]">
                  <Toolbox className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-lg font-semibold text-white">{item.label}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
