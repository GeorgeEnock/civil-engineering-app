import { BarChart3, FileText, Layers } from 'lucide-react'
import { reportHighlights } from '../data/appData.js'

export default function Reports() {
  return (
    <div className="space-y-8">
      <section className="rounded-4xl border border-slate-800/70 bg-slate-950/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Reports</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Project reporting and executive summaries</h1>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-[#F59E0B] px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#d98f00]">
            <BarChart3 className="h-4 w-4" /> Generate Report
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {reportHighlights.map((item) => (
            <div key={item.title} className="rounded-[1.75rem] border border-slate-800/70 bg-slate-900/80 p-6 shadow-sm shadow-slate-950/20">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#F59E0B]/10 text-[#F59E0B]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm text-slate-400">{item.updated}</p>
                </div>
              </div>
              <p className="mt-6 text-sm leading-6 text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
