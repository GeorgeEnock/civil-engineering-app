import { useEffect, useState } from 'react'
import { sidebarNav } from '../data/sidebarNav.js'
import { supabase } from '../supabase.js'

export default function Dashboard() {
  const [totalProjects, setTotalProjects] = useState(0)
  const [loading, setLoading] = useState(true)
  const [categoryLoading, setCategoryLoading] = useState(true)
  const [categoryProjectCounts, setCategoryProjectCounts] = useState({})

  useEffect(() => {
    async function fetchProjectCount() {
      const { count, error } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })

      if (!error) {
        setTotalProjects(count || 0)
      }
      setLoading(false)
    }
    fetchProjectCount()
  }, [])

  useEffect(() => {
    async function fetchCategoryCounts() {
      const { data, error } = await supabase
        .from('projects')
        .select('category, count', { count: 'exact', head: false })
        .group('category')

      if (!error && data) {
        const counts = data.reduce((acc, item) => {
          acc[item.category] = item.count || 0
          return acc
        }, {})
        setCategoryProjectCounts(counts)
      }
      setCategoryLoading(false)
    }
    fetchCategoryCounts()
  }, [])

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
      <section className="rounded-4xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Total Project Categories</p>
            <p className="mt-4 text-3xl font-semibold text-slate-950">{sidebarNav.length}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">Project categories as shown in the sidebar</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Total Projects</p>
            <p className="mt-4 text-3xl font-semibold text-slate-950">{loading ? '...' : totalProjects}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">Actual projects saved in Supabase</p>
          </div>
        </div>
      </section>

      <section className="rounded-4xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
        <div className="space-y-4">
          <div className="text-slate-700">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Project Distribution</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">Projects by Category</h2>
          </div>
          {categoryLoading ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm text-center text-slate-500">
              Loading project distribution data...
            </div>
          ) : (
          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-5">
            <div className="grid gap-4 md:grid-cols-2">
              {sidebarNav.map((group, groupIndex) => {
                const color = ['#F59E0B', '#38BDF8', '#34D399', '#A855F7', '#F472B6'][groupIndex % 5]
                const points = group.items.map((item, index) => {
                  const x = 20 + (index * 160) / Math.max(group.items.length - 1, 1)
                  const y = 140 - (index * 100) / Math.max(group.items.length - 1, 1)
                  return { x, y }
                })
                const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')

                return (
                  <div key={group.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{group.title} ({categoryProjectCounts[group.title] || 0} projects)</p>
                        <p className="text-xs text-slate-500">{group.items.length} sections defined</p>
                      </div>
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                    </div>

                    <div className="relative h-44 overflow-hidden rounded-3xl bg-white p-3">
                      <svg viewBox="0 0 200 160" className="h-full w-full">
                        <path d="M20 20 L20 140 L190 140" stroke="#E2E8F0" strokeWidth="1" fill="none" />
                        <path d={path} stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        {points.map((point, pointIndex) => (
                          <circle key={pointIndex} cx={point.x} cy={point.y} r="4" fill={color} />
                        ))}
                      </svg>
                    </div>

                    <div className="mt-4 space-y-2 text-slate-600">
                      {group.items.map((item, index) => (
                        <div key={item.path} className="flex items-center justify-between text-xs">
                          <span className="truncate">{item.label}</span>
                          <span className="font-semibold text-slate-900">{index + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        </div>
      </section>
    </div>
  )
}
