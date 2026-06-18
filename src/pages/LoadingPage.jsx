export default function LoadingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="flex flex-col items-center gap-6 rounded-4xl border border-white/10 bg-slate-950/80 p-10 shadow-[0_25px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-900/90 shadow-lg shadow-slate-950/30">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-[#F59E0B] to-[#F97316] shadow-inner shadow-orange-500/40">
            <span className="text-3xl font-black tracking-tight text-slate-950">CP</span>
          </div>
        </div>
        <div className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">CivilPro</p>
          <h1 className="text-3xl font-semibold">Loading...</h1>
          <p className="max-w-sm text-sm text-slate-400">Please wait while we load the application.</p>
        </div>
        <div className="relative h-2 w-72 overflow-hidden rounded-full bg-slate-800/90">
          <div className="absolute inset-y-0 left-0 w-2/5 animate-[move-right_1.6s_ease-in-out_infinite] rounded-full bg-linear-to-r from-[#F59E0B] to-[#F97316]" />
        </div>
      </div>
    </div>
  );
}