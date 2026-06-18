import { motion } from 'framer-motion'
import { ArrowRight, Layers, Sparkles } from 'lucide-react'

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.14),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.14),transparent_18%)] py-20 sm:py-28 lg:py-32">
      <div className="absolute inset-x-0 top-0 h-36 bg-[#0F172A]/5 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#F59E0B]/20 bg-[#F59E0B]/10 px-4 py-2 text-sm font-semibold text-[#0F172A] shadow-sm shadow-[#F59E0B]/10">
              <Layers className="h-4 w-4" />
              Enterprise-grade civil infrastructure solutions
            </span>
            <h1 className="mt-8 max-w-3xl text-4xl font-semibold tracking-tight text-[#0F172A] sm:text-5xl lg:text-6xl">
              Civil engineering and construction management built for the modern project lifecycle.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Deliver complex infrastructure with confidence using unified planning, field execution, and project controls from concept to commissioning.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full bg-[#0F172A] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#0F172A]/10 transition hover:bg-slate-950"
              >
                Request a Demo
                <ArrowRight className="ml-3 h-4 w-4" />
              </a>
              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-[#0F172A] shadow-sm transition hover:border-[#0F172A] hover:bg-slate-50"
              >
                Explore Projects
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.75, delay: 0.15 }}>
            <div className="relative overflow-hidden rounded-4xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-900/5 sm:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.16),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.14),transparent_34%)]" />
              <div className="relative grid gap-5">
                <div className="flex items-center justify-between rounded-3xl border border-slate-100 bg-[#0F172A]/5 p-5">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Field Progress</p>
                    <p className="mt-3 text-3xl font-semibold text-[#0F172A]">86%</p>
                  </div>
                  <Sparkles className="h-8 w-8 text-[#F59E0B]" />
                </div>
                <div className="rounded-3xl border border-slate-100 bg-slate-950 p-6 text-white">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Blueprint Preview</p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-[#111827]/90 p-4 shadow-inner shadow-slate-950/10">
                      <p className="text-sm text-slate-400">Cost Forecast</p>
                      <p className="mt-3 text-2xl font-semibold">$18.4M</p>
                    </div>
                    <div className="rounded-3xl bg-[#111827]/90 p-4 shadow-inner shadow-slate-950/10">
                      <p className="text-sm text-slate-400">Schedule Health</p>
                      <p className="mt-3 text-2xl font-semibold">On Track</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5 text-slate-700">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Project Snapshot</p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-3xl bg-white p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Structures</p>
                      <p className="mt-3 text-xl font-semibold text-[#0F172A]">12</p>
                    </div>
                    <div className="rounded-3xl bg-white p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Teams</p>
                      <p className="mt-3 text-xl font-semibold text-[#0F172A]">6</p>
                    </div>
                    <div className="rounded-3xl bg-white p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Milestones</p>
                      <p className="mt-3 text-xl font-semibold text-[#0F172A]">24</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
