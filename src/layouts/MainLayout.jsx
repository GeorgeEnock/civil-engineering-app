import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import { Outlet } from 'react-router-dom'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100">
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8 xl:px-10">
        <Sidebar />
        <div className="overflow-hidden rounded-4xl border border-slate-200/70 bg-white text-slate-950 shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
          <div className="min-h-[calc(100vh-4.5rem)] bg-white text-slate-950">
            <div className="px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
