import { NavLink } from 'react-router-dom'
import { sidebarNav } from '../data/sidebarNav.js'

export default function Sidebar() {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-[4.5rem] max-h-[calc(100vh-4.5rem)] overflow-y-auto rounded-4xl border border-slate-800/70 bg-slate-950/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        {sidebarNav.map((group) => (
          <div key={group.title} className="mb-8 last:mb-0">
            <NavLink
              to={group.path}
              end
              className={({ isActive }) =>
                `text-xs uppercase tracking-[0.32em] transition ${
                  isActive ? 'text-white' : 'text-slate-500 hover:text-white'
                }`
              }
            >
              {group.title}
            </NavLink>
            <p className="mt-2 text-sm leading-6 text-slate-400">{group.description}</p>
            <div className="mt-5 space-y-2">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `block rounded-3xl border px-4 py-3 text-sm transition ${
                      isActive
                        ? 'border-[#F59E0B] bg-[#F59E0B]/10 text-white'
                        : 'border-transparent text-slate-300 hover:border-slate-700/80 hover:bg-slate-900/80 hover:text-white'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
