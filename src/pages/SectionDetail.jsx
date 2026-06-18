import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { sidebarNav } from '../data/sidebarNav.js'
import { supabase } from '../supabase.js'
import ProjectCard from '../components/ProjectCard.jsx'

export default function SectionDetail() {
  const { section, item } = useParams()
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  const group = sidebarNav.find((group) => group.path === `/${section}`)
  const detail = group?.items.find((entry) => entry.path === `/${section}/${item}`)

  useEffect(() => {
    async function fetchProjects() {
      if (!detail) return
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      const currentUserId = session?.user?.id

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('section', detail.label)
        .order('created_at', { ascending: false })

      if (!error) {
        // Add an isOwner flag to each project for conditional rendering of edit/delete buttons
        const projectsWithOwnership = data.map(project => ({
          ...project,
          isOwner: project.user_id === currentUserId
        }))
        setProjects(projectsWithOwnership)
      }
      setLoading(false)
    }
    fetchProjects()
  }, [detail])

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      // Re-check ownership before deleting
      const projectToDelete = projects.find(p => p.id === projectId)
      if (!session || session.user.id !== projectToDelete?.user_id) {
        throw new Error('You are not authorized to delete this project.')
      }
      const { error: dbError } = await supabase.from('projects').delete().eq('id', projectId)
      if (dbError) throw dbError
      setProjects(prev => prev.filter(p => p.id !== projectId)) // Optimistic update
    } catch (err) {
      console.error('Error deleting project:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditProject = (projectId) => {
    navigate(`/projects?project=${projectId}`)
  }

  if (!group || !detail) {
    return (
      <div className="rounded-4xl border border-slate-800/70 bg-slate-950/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <h1 className="text-2xl font-semibold text-white">Section not found</h1>
        <p className="mt-3 text-slate-400">The requested sidebar item does not exist or is not categorized correctly.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section className="rounded-4xl border border-slate-800/70 bg-slate-950/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">{group.title}</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">{detail.label}</h1>
            <p className="mt-3 max-w-2xl text-slate-400">{detail.description}</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300">
            {group.title} · Detail view
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Project Gallery</h2>
          <span className="text-sm text-slate-500">{projects.length} results</span>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-72 animate-pulse rounded-3xl bg-slate-900" />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => ( // project now includes isOwner
              <ProjectCard key={project.id} project={project} onEdit={handleEditProject} onDelete={handleDeleteProject} isOwner={project.isOwner} />
            ))}
          </div>
        ) : (
          <div className="rounded-4xl border border-dashed border-slate-800 p-12 text-center">
            <p className="text-slate-500">No projects posted in this section yet.</p>
            <Link to="/projects" className="mt-4 inline-block text-sm font-semibold text-[#F59E0B] hover:underline">
              Post the first project
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
