import { FileArchive, FileCheck2, FileText, ShieldCheck } from 'lucide-react'
import { documentLibrary } from '../data/appData.js'

const statusStyles = {
  Approved: 'bg-[#16A34A]/10 text-[#16A34A]',
  'In Review': 'bg-[#F59E0B]/10 text-[#F59E0B]',
  Verified: 'bg-[#38BDF8]/10 text-[#38BDF8]',
  Draft: 'bg-slate-700/80 text-slate-100',
}

export default function Documents() {
  return (
    <div className="space-y-8">
      <section className="rounded-4xl border border-slate-800/70 bg-slate-950/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Documents</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Document control and approvals</h1>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-[#F59E0B] px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#d98f00]">
            <FileArchive className="h-4 w-4" /> Upload Document
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_0.8fr]">
          <div className="rounded-[1.75rem] border border-slate-800/70 bg-slate-900/80 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Library overview</p>
                <p className="mt-2 text-xl font-semibold text-white">Document activities and approvals</p>
              </div>
              <div className="rounded-full bg-slate-950/80 px-4 py-2 text-sm text-slate-300">234 assets</div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-[1.75rem] bg-slate-950/80 p-4 text-slate-300">
                <div>
                  <p className="text-sm text-slate-400">Pending reviews</p>
                  <p className="mt-1 text-2xl font-semibold text-white">16</p>
                </div>
                <FileCheck2 className="h-6 w-6 text-[#F59E0B]" />
              </div>
              <div className="flex items-center justify-between rounded-[1.75rem] bg-slate-950/80 p-4 text-slate-300">
                <div>
                  <p className="text-sm text-slate-400">Active approvals</p>
                  <p className="mt-1 text-2xl font-semibold text-white">9</p>
                </div>
                <ShieldCheck className="h-6 w-6 text-[#38BDF8]" />
              </div>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-slate-800/70 bg-slate-900/80 p-6">
            <div className="flex items-center gap-3 text-slate-300">
              <FileText className="h-5 w-5 text-[#F59E0B]" />
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Latest updates</p>
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-[1.75rem] bg-slate-950/80 p-4">
                <p className="text-sm text-slate-400">Today</p>
                <p className="mt-2 font-semibold text-white">Structural package submitted for review</p>
              </div>
              <div className="rounded-[1.75rem] bg-slate-950/80 p-4">
                <p className="text-sm text-slate-400">Yesterday</p>
                <p className="mt-2 font-semibold text-white">Permit document updated for Riverbend project</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-slate-800/70 bg-slate-900/80">
          <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-[0.2em]">Document</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-[0.2em]">Project</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-[0.2em]">Type</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-[0.2em]">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {documentLibrary.map((item) => (
                <tr key={item.title} className="hover:bg-slate-800/80">
                  <td className="px-6 py-5 font-medium text-white">{item.title}</td>
                  <td className="px-6 py-5">{item.project}</td>
                  <td className="px-6 py-5">{item.type}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[item.status]}`}>{item.status}</span>
                  </td>
                  <td className="px-6 py-5">{item.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
