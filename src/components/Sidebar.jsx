import { NavLink } from 'react-router-dom'
import { sidebarNav } from '../data/sidebarNav.js'
import { useProjectCounts } from '../hooks/useProjectCounts.js'

export default function Sidebar() {
  const { sectionCounts } = useProjectCounts()

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-18 max-h-[calc(100vh-4.5rem)] overflow-y-auto rounded-4xl border border-slate-800/70 bg-slate-950/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        {sidebarNav.map((group) => {
          // The main title's total is the sum of all its subsection counts,
          // so "Construction 24" always matches School 2 + Apartment 15 + ...
          const groupTotal = group.items.reduce(
            (sum, item) => sum + (sectionCounts[item.label] || 0),
            0
          )

          return (
            <div key={group.title} className="mb-10 border-b border-slate-800/60 pb-8 last:mb-0 last:border-none last:pb-0">
              <div className="flex items-center justify-between gap-3">
                <NavLink
                  to={group.path}
                  end
                  className={({ isActive }) =>
                    `text-xl font-bold tracking-tight transition ${
                      isActive ? 'text-[#F59E0B]' : 'text-white hover:text-[#F59E0B]'
                    }`
                  }
                >
                  {group.title}
                </NavLink>
                <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#F59E0B]/15 px-3 py-1 text-sm font-bold text-[#F59E0B]">
                  {groupTotal}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">{group.description}</p>
              <div className="mt-5 space-y-2">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center justify-between gap-3 rounded-3xl border px-4 py-2.5 text-sm font-normal transition ${
                        isActive
                          ? 'border-[#F59E0B] bg-[#F59E0B]/10 text-white'
                          : 'border-transparent text-slate-400 hover:border-slate-700/80 hover:bg-slate-900/80 hover:text-white'
                      }`
                    }
                  >
                    <span>{item.label}</span>
                    <span className="shrink-0 rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-400">
                      {sectionCounts[item.label] || 0}
                    </span>
                  </NavLink>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}