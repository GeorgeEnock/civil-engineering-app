import { useEffect, useState } from 'react'
import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes/AppRoutes.jsx"
import { supabase } from "./supabase.js"

function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function forceFreshLogin() {
      const splashStart = Date.now()
      const minimumSplashDuration = 5000 // 5 seconds

      // A password-reset email link lands here with "type=recovery" in the
      // URL. Supabase creates a temporary session from that link so the
      // user can set a new password. If we forcibly sign out on every load
      // (below), that recovery session gets destroyed before the user ever
      // gets a chance to use it - so we must skip the forced sign-out in
      // that one specific case.
      // A password-reset (or signup confirmation) email link lands here
      // with auth tokens in the URL, in one of several possible formats
      // depending on the Supabase auth flow configuration (implicit vs
      // PKCE). Checking broadly for any of these signals avoids forcibly
      // signing out and destroying a session Supabase is about to set up
      // from that link, before the page gets a chance to use it.
      const url = window.location.hash + window.location.search
      const looksLikeAuthLink =
        url.includes('type=recovery') ||
        url.includes('access_token') ||
        url.includes('code=') ||
        url.includes('token_hash')

      if (!looksLikeAuthLink) {
        // Belt-and-suspenders fix: even though the Supabase client is configured
        // with persistSession: false, this forcibly destroys any session that
        // could still be sitting around (e.g. leftover tokens written to
        // localStorage/sessionStorage by an older build of this app, before
        // persistSession: false was added, or by a cached/stale bundle).
        // This guarantees every fresh app load truly starts logged out.
        try {
          await supabase.auth.signOut()
        } catch {
          // ignore - there may simply be nothing to sign out of
        }

        // Manually sweep any leftover Supabase auth keys from both storages,
        // in case an old session token is still sitting there unused.
        try {
          Object.keys(localStorage)
            .filter((key) => key.startsWith('sb-'))
            .forEach((key) => localStorage.removeItem(key))

          Object.keys(sessionStorage)
            .filter((key) => key.startsWith('sb-'))
            .forEach((key) => sessionStorage.removeItem(key))
        } catch {
          // ignore - storage may be unavailable in some environments
        }
      }

      // Keep the splash screen (with the "Developed by George from Tanzania"
      // credit) visible for at least 5 seconds in total, even though the
      // sign-out/storage sweep above finishes almost instantly.
      const elapsed = Date.now() - splashStart
      const remaining = minimumSplashDuration - elapsed
      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining))
      }

      setReady(true)
    }

    forceFreshLogin()
  }, [])

  // Don't render any routes (including the protected ones) until the forced
  // sign-out / storage sweep above has completed, so there's no flash of
  // dashboard content before the redirect to /login kicks in.
  if (!ready) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-[#F59E0B] to-[#F97316] shadow-xl shadow-orange-500/30">
            <span className="text-3xl font-black tracking-tight text-slate-950">CP</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              CivilPro <span className="text-[#F59E0B]">Engineering</span>
            </h1>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Project Management Platform</p>
          </div>

          <div className="h-1 w-48 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-1/3 animate-[move-right_1.4s_ease-in-out_infinite] rounded-full bg-linear-to-r from-[#F59E0B] to-[#F97316]" />
          </div>

          <p className="text-base font-medium uppercase tracking-[0.18em] text-slate-300 sm:text-lg">
            Developed by George from Tanzania
          </p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App