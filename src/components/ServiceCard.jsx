import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'

function buildIconName(icon) {
  return icon
    .split(/[-_]/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('')
}

export default function ServiceCard({ title, description, icon }) {
  const iconName = buildIconName(icon)
  const Icon = Icons[iconName]

  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
    >
      <div className="p-6">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-[#F59E0B]/10 text-[#F59E0B] shadow-sm">
          {Icon ? <Icon className="h-7 w-7" /> : null}
        </div>
        <h3 className="mt-6 text-xl font-semibold tracking-tight text-[#0F172A]">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
      </div>
      <div className="border-t border-slate-100 bg-slate-50 p-4 transition-colors duration-300 group-hover:bg-[#F59E0B]/10">
        <span className="text-sm font-semibold text-[#0F172A]">Explore service</span>
      </div>
    </motion.article>
  )
}
