import { useEffect, useState, useId } from 'react'
import { supabase } from '../supabase.js'

// Fetches how many projects exist per category (main sidebar section, e.g.
// "Construction") and per individual section (sub-item, e.g. "School"), and
// keeps both counts live via a Supabase realtime subscription so they update
// automatically as projects are added or deleted anywhere in the app.
export function useProjectCounts() {
  const [categoryCounts, setCategoryCounts] = useState({})
  const [sectionCounts, setSectionCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  // This hook can be used by multiple components at the same time (e.g. the
  // desktop Sidebar and the mobile Navbar are both mounted simultaneously).
  // Supabase realtime channel names must be unique - reusing the same name
  // across multiple subscriptions throws "cannot add callbacks after
  // subscribe()" and crashes the app. React's useId() gives each hook
  // instance a stable, unique id without calling impure functions (like
  // Math.random()) during render.
  const instanceId = useId()
  const channelName = `sidebar-project-counts-${instanceId}`

  useEffect(() => {
    let isMounted = true

    async function fetchCounts() {
      const { data, error } = await supabase
        .from('projects')
        .select('category, section')

      if (!isMounted) return

      if (!error && data) {
        const byCategory = {}
        const bySection = {}

        data.forEach((row) => {
          if (row.category) {
            byCategory[row.category] = (byCategory[row.category] || 0) + 1
          }
          if (row.section) {
            bySection[row.section] = (bySection[row.section] || 0) + 1
          }
        })

        setCategoryCounts(byCategory)
        setSectionCounts(bySection)
      }
      setLoading(false)
    }

    fetchCounts()

    return () => {
      isMounted = false
    }
  }, [refreshKey])

  useEffect(() => {
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        () => {
          setRefreshKey((current) => current + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [channelName])

  return { categoryCounts, sectionCounts, loading }
}