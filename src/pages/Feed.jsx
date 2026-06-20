import { useEffect, useState } from 'react'
import { Copy, Check, MapPin, Clock } from 'lucide-react'
import { supabase } from '../supabase.js'

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]
  for (const [label, secondsInUnit] of units) {
    const value = Math.floor(seconds / secondsInUnit)
    if (value >= 1) return `${value} ${label}${value > 1 ? 's' : ''} ago`
  }
  return 'Just now'
}

function getYouTubeEmbedUrl(url) {
  try {
    const parsed = new URL(url)
    let videoId = ''

    if (parsed.hostname.includes('youtu.be')) {
      videoId = parsed.pathname.slice(1)
    } else if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname === '/watch') {
        videoId = parsed.searchParams.get('v') || ''
      } else if (parsed.pathname.startsWith('/embed/')) {
        videoId = parsed.pathname.split('/embed/')[1]
      } else if (parsed.pathname.startsWith('/shorts/')) {
        videoId = parsed.pathname.split('/shorts/')[1]
      }
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null
  } catch {
    return null
  }
}

function PostMedia({ project }) {
  if (project.video_url) {
    const youTubeEmbedUrl = getYouTubeEmbedUrl(project.video_url)

    if (youTubeEmbedUrl) {
      return (
        <div className="aspect-video w-full bg-black">
          <iframe
            src={youTubeEmbedUrl}
            title={project.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      )
    }

    return (
      <video
        controls
        playsInline
        preload="auto"
        poster={project.photo_url || undefined}
        src={project.video_url}
        className="w-full max-h-128 bg-black object-contain"
      >
        Your browser does not support video playback.
      </video>
    )
  }

  if (project.photo_url) {
    return (
      <img
        src={project.photo_url}
        alt={project.title}
        className="w-full max-h-128 object-cover"
        loading="lazy"
      />
    )
  }

  return null
}

function PostCard({ project }) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `${window.location.origin}/projects?project=${project.id}`
  const initials = (project.category || 'CP').slice(0, 2).toUpperCase()

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API may be unavailable; fail silently
    }
  }

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-900/60 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#F59E0B] to-[#F97316] text-sm font-bold text-slate-950">
            {initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{project.title}</p>
            <p className="text-xs text-slate-500">
              {project.category} · {project.section}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock className="h-3.5 w-3.5" />
          {timeAgo(project.created_at)}
        </div>
      </div>

      <PostMedia project={project} />

      <div className="space-y-3 px-5 py-4">
        {project.location ? (
          <div className="flex items-center gap-1.5 text-sm text-slate-400">
            <MapPin className="h-4 w-4 text-[#F59E0B]" />
            {project.location}
          </div>
        ) : null}

        {project.description ? (
          <p className="text-sm leading-6 text-slate-300">{project.description}</p>
        ) : null}

        <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 px-3 py-2">
          <span className="flex-1 truncate text-xs text-slate-500" title={shareUrl}>
            {shareUrl}
          </span>
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-900 p-1.5 text-slate-400 transition hover:border-[#F59E0B] hover:text-[#F59E0B]"
            aria-label="Copy share link"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </article>
  )
}

export default function Feed() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let isMounted = true

    async function fetchProjects() {
      setLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (!isMounted) return

      if (error) {
        setErrorMsg(error.message)
      } else {
        setProjects(data || [])
      }
      setLoading(false)
    }

    fetchProjects()

    const channel = supabase
      .channel('feed-projects-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, fetchProjects)
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Project Feed</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Latest Posts</h1>
        <p className="mt-2 text-sm text-slate-400">Every project posted across all categories, newest first.</p>
      </div>

      {errorMsg ? (
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMsg}
        </div>
      ) : null}

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-96 animate-pulse rounded-3xl bg-slate-900" />
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="space-y-6">
          {projects.map((project) => (
            <PostCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-800 p-12 text-center text-slate-500">
          No projects have been posted yet.
        </div>
      )}
    </div>
  )
}