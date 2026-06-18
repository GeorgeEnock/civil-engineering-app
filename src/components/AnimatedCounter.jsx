import { useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export default function AnimatedCounter({ value, label }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1600
    const increment = Math.ceil(value / (duration / 16))
    const frame = () => {
      start += increment
      if (start >= value) {
        setCount(value)
        return
      }
      setCount(start)
      requestAnimationFrame(frame)
    }
    frame()
  }, [inView, value])

  return (
    <div ref={ref} className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
      <p className="text-4xl font-semibold tracking-tight text-[#0F172A]">
        {count.toLocaleString()}
      </p>
      <p className="mt-3 text-sm uppercase tracking-[0.22em] text-slate-500">
        {label}
      </p>
    </div>
  )
}
