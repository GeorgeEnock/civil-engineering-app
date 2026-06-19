import { useEffect, useState } from 'react'
import { sidebarNav } from '../data/sidebarNav.js'
import { supabase } from '../supabase.js'

const COLORS = ['#F59E0B', '#38BDF8', '#34D399', '#A855F7', '#F472B6']

export default function Dashboard() {
  const [totalProjects, setTotalProjects] = useState(0)
  const [loading, setLoading] = useState(true)
  const [categoryLoading, setCategoryLoading] = useState(true)
  const [categoryProjectCounts, setCategoryProjectCounts] = useState({})
  const [errorMsg, setErrorMsg] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let isMounted = true

    async function fetchProjectCount() {
      const { count, error } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })

      if (!isMounted) return

      if (!error) {
        setTotalProjects(count || 0)
      } else {
        setErrorMsg(error.message)
      }
      setLoading(false)
    }

    async function fetchCategoryCounts() {
      // Supabase JS query builder has no .group()/groupBy() helper, so we fetch
      // the category column for every row and tally counts on the client instead.
      const { data, error } = await supabase
        .from('projects')
        .select('category')

      if (!isMounted) return

      if (!error && data) {
        const counts = data.reduce((acc, row) => {
          const key = row.category || 'Uncategorized'
          acc[key] = (acc[key] || 0) + 1
          return acc
        }, {})
        setCategoryProjectCounts(counts)
      } else if (error) {
        setErrorMsg(error.message)
      }
      setCategoryLoading(false)
    }

    fetchProjectCount()
    fetchCategoryCounts()

    return () => {
      isMounted = false
    }
  }, [refreshKey])

  useEffect(() => {
    // Keep the dashboard in sync automatically: whenever a project row is
    // inserted, updated, or deleted anywhere in the app, refetch the counts
    // here instead of relying on a full page reload.
    const channel = supabase
      .channel('dashboard-projects-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        () => {
          setLoading(true)
          setCategoryLoading(true)
          setRefreshKey((current) => current + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  function handleRefreshClick() {
    setLoading(true)
    setCategoryLoading(true)
    setRefreshKey((current) => current + 1)
  }

  const maxCategoryCount = Math.max(1, ...sidebarNav.map((group) => categoryProjectCounts[group.title] || 0))

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
      <section className="rounded-4xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-500">Live counts from your Supabase database.</p>
          <button
            type="button"
            onClick={handleRefreshClick}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
          >
            Refresh
          </button>
        </div>

        {errorMsg ? (
          <div className="mb-4 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        ) : null}

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
              <div className="space-y-4">
                {sidebarNav.map((group, groupIndex) => {
                  const color = COLORS[groupIndex % COLORS.length]
                  const count = categoryProjectCounts[group.title] || 0
                  const widthPercent = Math.max(4, (count / maxCategoryCount) * 100)

                  return (
                    <div key={group.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{group.title}</p>
                          <p className="text-xs text-slate-500">{group.items.length} sections defined</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-slate-900">{count}</span>
                          <span className="text-xs text-slate-500">projects</span>
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                        </div>
                      </div>

                      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${widthPercent}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              {totalProjects === 0 ? (
                <p className="mt-4 text-center text-sm text-slate-500">
                  No projects saved yet. Once projects are added, this chart will update automatically.
                </p>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}