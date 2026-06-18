import { Box, Building2, LayoutGrid, Palette } from 'lucide-react'
import { architecturalDesignServices } from '../data/appData.js'

export default function ArchitecturalDesign() {
  return (
    <div className="space-y-8">
      <section className="rounded-4xl border border-slate-800/70 bg-slate-950/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Architectural Design</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Design services for buildings and spaces</h1>
          </div>
          <div className="rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300">5 design services</div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {architecturalDesignServices.map((service) => (
            <div key={service.title} className="rounded-[1.75rem] border border-slate-800/70 bg-slate-900/80 p-6 shadow-sm shadow-slate-950/20">
              <div className="flex items-center gap-3 text-slate-300">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#F59E0B]/10 text-[#F59E0B]">
                  {service.title === 'Building Design' ? <Building2 className="h-5 w-5" /> : service.title === 'Floor Plans' ? <LayoutGrid className="h-5 w-5" /> : service.title === '3D Presentation' ? <Box className="h-5 w-5" /> : <Palette className="h-5 w-5" />}
                </span>
                <div>
                  <p className="text-lg font-semibold text-white">{service.title}</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-400">{service.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
