import { MapPin, ShieldCheck } from 'lucide-react'
import { projectCategories } from '../data/appData.js'

export default function Categories() {
  return (
    <div className="space-y-8">
      <section className="rounded-4xl border border-slate-800/70 bg-slate-950/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Categories</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Organize project work by specialty</h1>
          </div>
          <div className="rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300">4 category groups</div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {projectCategories.map((category) => (
            <div key={category.title} className="rounded-[1.75rem] border border-slate-800/70 bg-slate-900/80 p-6 shadow-sm shadow-slate-950/20">
              <div className="flex items-center justify-between gap-3">
                <p className="text-lg font-semibold text-white">{category.title}</p>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F59E0B]/10 text-[#F59E0B]">
                  <MapPin className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">{category.description}</p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950/80 px-4 py-2 text-sm text-slate-300">
                <ShieldCheck className="h-4 w-4 text-[#38BDF8]" /> {category.count} projects
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
