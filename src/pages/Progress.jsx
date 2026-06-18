import { Activity, Clock3, ShieldCheck, TrendingUp } from 'lucide-react'
import { progressPanels } from '../data/appData.js'

export default function Progress() {
  return (
    <div className="space-y-8">
      <section className="rounded-4xl border border-slate-800/70 bg-slate-950/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Progress Tracking</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Field progress and schedule control</h1>
          </div>
          <div className="rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300">3 panels</div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {progressPanels.map((panel) => (
            <div key={panel.title} className="rounded-[1.75rem] border border-slate-800/70 bg-slate-900/80 p-6 shadow-sm shadow-slate-950/20">
              <div className="flex items-center gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#F59E0B]/10 text-[#F59E0B]">
                  {panel.title.includes('Schedule') ? <Clock3 className="h-5 w-5" /> : panel.title.includes('Quality') ? <ShieldCheck className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">{panel.title}</p>
                  <p className="mt-2 text-sm text-slate-400">{panel.description}</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-3xl font-semibold text-white">{panel.value}</p>
                {panel.progress ? (
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-[#16A34A]" style={{ width: `${panel.progress}%` }} />
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-slate-800/70 bg-slate-900/80 p-6 text-slate-300 shadow-sm shadow-slate-950/20">
          <div className="flex items-center gap-3 text-slate-300">
            <Activity className="h-5 w-5 text-[#F59E0B]" />
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Progress workflow</p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] bg-slate-950/80 p-4">
              <p className="text-sm text-slate-400">Weekly field achievements</p>
              <p className="mt-2 text-lg font-semibold text-white">68 inspections completed</p>
            </div>
            <div className="rounded-[1.75rem] bg-slate-950/80 p-4">
              <p className="text-sm text-slate-400">Milestone readiness</p>
              <p className="mt-2 text-lg font-semibold text-white">4 of 5 critical milestones green</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
