import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { sidebarNav } from '../data/sidebarNav.js'
import { supabase } from '../supabase.js'
import { uploadToCloudinary } from '../utils/cloudinary.js'

const defaultForm = {
  title: '',
  location: '',
  description: '',
  photoUrl: '',
  videoUrl: '',
}

export default function Projects() {
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [form, setForm] = useState(defaultForm) // Form data for new or edited project
  const [files, setFiles] = useState({ photo: null, video: null })
  const [selectedCategory, setSelectedCategory] = useState(sidebarNav[0].title)
  const [selectedSection, setSelectedSection] = useState(sidebarNav[0].items[0].label)
  const [projectSaved, setProjectSaved] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [sharedProject, setSharedProject] = useState(null) // For displaying a project via shared link
  const [editingProject, setEditingProject] = useState(null) // For editing an existing project
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSharedProject = async () => {
      const id = new URLSearchParams(location.search).get('project')
      if (id) {
        const { data, error: fetchError } = await supabase.from('projects').select('*').eq('id', id).single()
        if (!fetchError && data) {
          setSharedProject(data)
          // If we're viewing a shared project, also prepare for editing if the user decides to
          setEditingProject(data)
          setForm({ title: data.title, location: data.location, description: data.description, photoUrl: data.photo_url || '', videoUrl: data.video_url || '' })
          setSelectedCategory(data.category)
          setSelectedSection(data.section)
        }
      }
    }
    fetchSharedProject()
  }, [location.search])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleFileChange(event) {
    const { name, files } = event.target
    if (!files?.length) return
    setFiles((prev) => ({ ...prev, [name === 'photoUrl' ? 'photo' : 'video']: files[0] }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (!form.title.trim() || !form.description.trim()) return
    
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('You must be signed in to post a project.')

      // 1. Upload media to Cloudinary
      const photoUrl = files.photo ? await uploadToCloudinary(files.photo, 'image') : form.photoUrl
      const videoUrl = files.video ? await uploadToCloudinary(files.video, 'video') : form.videoUrl
      
      if (editingProject) {
        // Update existing project
        const { data, error: dbError } = await supabase.from('projects').update({
          title: form.title,
          location: form.location,
          description: form.description,
          category: selectedCategory,
          section: selectedSection,
          photo_url: photoUrl,
          video_url: videoUrl,
        }).eq('id', editingProject.id).select().single()

        if (dbError) throw dbError
        setProjectSaved(true) // Indicate update was successful
        setShareUrl(`${window.location.origin}/projects?project=${data.id}`)
      } else {
        // Create new project
        const { data, error: dbError } = await supabase.from('projects').insert([{
          title: form.title,
          location: form.location,
          description: form.description,
          category: selectedCategory,
          section: selectedSection,
          photo_url: photoUrl,
          video_url: videoUrl,
          user_id: session.user.id
        }]).select().single()

        if (dbError) throw dbError
        setProjectSaved(true)
        setShareUrl(`${window.location.origin}/projects?project=${data.id}`)
      }

      // Reset form and editing state
      setForm(defaultForm)
      setFiles({ photo: null, video: null })
      setEditingProject(null)
      setSharedProject(null) // Clear shared project view after edit/save

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session || session.user.id !== editingProject?.user_id) {
        throw new Error('You are not authorized to delete this project.')
      }
      const { error: dbError } = await supabase.from('projects').delete().eq('id', projectId)
      if (dbError) throw dbError
      navigate('/projects') // Redirect after deletion
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (sharedProject) {
    return (
      <div className="space-y-8">
        <section className="rounded-4xl border border-slate-800/70 bg-slate-950/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-8">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Shared Project</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">{sharedProject.title}</h1>
            <p className="mt-2 text-slate-400">
              Category: {sharedProject.category} · Section: {sharedProject.section}
            </p>
          </div>

          <div className="space-y-6 text-slate-300">
            {sharedProject.location ? (
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Location</p>
                <p className="mt-2 text-white">{sharedProject.location}</p>
              </div>
            ) : null}

            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Description</p>
              <p className="mt-2 text-slate-300 whitespace-pre-line">{sharedProject.description}</p>
            </div>

            {sharedProject.photo_url ? (
              <img src={sharedProject.photo_url} alt={sharedProject.title} className="rounded-3xl border border-slate-800/70" />
            ) : null}

            {sharedProject.video_url ? (
              <div className="rounded-3xl border border-slate-800/70 p-4">
                <video controls src={sharedProject.video_url} className="w-full rounded-3xl" />
              </div>
            ) : null}

            {/* Action buttons for owner */}
            {editingProject && (
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setSharedProject(null) // Hide shared project view to show form
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-[#F59E0B] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#d98f00]"
                >
                  Edit Project
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteProject(editingProject.id)}
                  className="inline-flex items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 px-6 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
                >
                  Delete Project
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
      <section className="rounded-4xl border border-slate-800/70 bg-slate-950/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-8">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
            {editingProject ? 'Edit Project' : 'Projects'}
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white">
            {editingProject ? 'Update your civil engineering work' : 'Post your civil engineering work'}
          </h1>
          <p className="mt-2 text-slate-400">Choose a category and its section, then upload your project details so others can view with a shared link.</p>
          {editingProject && (
            <button type="button" onClick={() => { setEditingProject(null); setForm(defaultForm); setFiles({ photo: null, video: null }); setProjectSaved(false); setError('') }} className="mt-4 inline-block text-sm font-semibold text-[#F59E0B] hover:underline">
              ← Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-700/80 bg-slate-950 p-4">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Category</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {sidebarNav.map((category) => (
                  <button
                    key={category.title}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(category.title)
                      setSelectedSection(category.items?.[0]?.label || '')
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      selectedCategory === category.title
                        ? 'bg-[#F59E0B] text-slate-950'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {category.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-700/80 bg-slate-950 p-4">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Section</p>
              <div className="mt-4 grid gap-2">
                {sidebarNav.find((item) => item.title === selectedCategory)?.items.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => setSelectedSection(item.label)}
                    className={`w-full rounded-2xl px-4 py-3 text-left text-sm transition ${
                      selectedSection === item.label
                        ? 'border border-[#F59E0B] bg-[#F59E0B]/10 text-white'
                        : 'border border-slate-700/80 bg-slate-950 text-slate-300 hover:border-slate-600 hover:bg-slate-900'
                    }`}
                  >
                    <span className="block font-semibold">{item.label}</span>
                    <span className="block text-xs text-slate-500">{item.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-300">
              Project title
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Project name"
                className="w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-[#F59E0B]"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              Location
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Site or city"
                className="w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-[#F59E0B]"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm text-slate-300">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe the civil engineering work or project"
              className="w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-[#F59E0B]"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            Photo URL or upload from device (optional)
            <input
              name="photoUrl"
              value={form.photoUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-[#F59E0B]"
            />
            <input
              type="file"
              name="photoUrl"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition file:cursor-pointer file:rounded-full file:border-0 file:bg-[#0f172a] file:px-4 file:py-2 file:text-slate-200 file:transition focus:border-[#F59E0B]"
            />
            <p className="text-xs text-slate-500">Upload an image from your device instead of pasting a URL.</p>
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            Video URL or upload from device (optional)
            <input
              name="videoUrl"
              value={form.videoUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-[#F59E0B]"
            />
            <input
              type="file"
              name="videoUrl"
              accept="video/*"
              onChange={handleFileChange}
              className="w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition file:cursor-pointer file:rounded-full file:border-0 file:bg-[#0f172a] file:px-4 file:py-2 file:text-slate-200 file:transition focus:border-[#F59E0B]"
            />
            <p className="text-xs text-slate-500">Upload a video file from your device instead of pasting a URL.</p>
          </label>

          {error ? (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
          ) : null}

          {projectSaved ? (
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-200">
              <p className="font-semibold text-emerald-200">Project saved successfully.</p>
                <p className="mt-2 text-xs text-slate-300">
                Share this link with others:
                <a className="break-all text-[#F59E0B] underline" href={shareUrl}>{shareUrl}</a>
              </p>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full bg-[#F59E0B] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#d98f00] disabled:opacity-50"
          >
            {loading ? 'Uploading & Saving...' : editingProject ? 'Update Project Post' : 'Save Project Post'}
          </button>
        </form>
      </section>
    </div>
  )
}
