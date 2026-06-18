import { Building2, HardDrive, Shovel, Signpost } from 'lucide-react'
import { civilEngineeringWorkTypes } from '../data/appData.js'

export default function CivilEngineeringWorks() {
  return (
    <div className="space-y-8">
      <section className="rounded-4xl border border-slate-800/70 bg-slate-950/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Civil Engineering Works</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Manage specialist infrastructure workstreams</h1>
          </div>
          <div className="rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300">5 specialties</div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {civilEngineeringWorkTypes.map((item) => (
            <div key={item.title} className="rounded-[1.75rem] border border-slate-800/70 bg-slate-900/80 p-6 shadow-sm shadow-slate-950/20">
              <div className="flex items-center gap-3 text-slate-300">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#F59E0B]/10 text-[#F59E0B]">
                  {item.title === 'Bridges' ? <Building2 className="h-5 w-5" /> : item.title === 'Roads' ? <Signpost className="h-5 w-5" /> : item.title === 'Culverts' ? <HardDrive className="h-5 w-5" /> : <Shovel className="h-5 w-5" />}
                </span>
                <div>
                  <p className="text-lg font-semibold text-white">{item.title}</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
