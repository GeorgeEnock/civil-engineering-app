import { motion } from 'framer-motion'

export default function ProjectCard({ project, onEdit, onDelete, isOwner }) {
  const { title, location, category, photo_url, created_at } = project

  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
    >
      <div
        className="relative h-56"
        style={{
          backgroundColor: '#0f172a',
        }}
      >
        {photo_url ? (
          <img src={photo_url} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-slate-900 to-slate-800" />
        )}
        <div className="absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <p className="text-sm uppercase tracking-[0.24em] text-[#F59E0B]">{category}</p>
          <h3 className="mt-3 text-2xl font-semibold">{title}</h3>
          {location && <p className="mt-2 text-sm text-slate-200">{location}</p>}
        </div>
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span className="font-semibold text-slate-900">Posted</span>
          <span>{new Date(created_at).toLocaleDateString()}</span>
        </div>
        <button className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 mb-2">
          View Details
        </button>
        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(project.id)}
              className="flex-1 rounded-3xl border border-[#F59E0B]/20 bg-[#F59E0B]/10 px-4 py-3 text-sm font-semibold text-[#F59E0B] transition hover:bg-[#F59E0B]/20"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="flex-1 rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </motion.article>
  )
}
