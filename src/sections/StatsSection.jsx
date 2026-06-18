import SectionHeading from '../components/SectionHeading'
import AnimatedCounter from '../components/AnimatedCounter'
import { stats } from '../data/homeData'

export default function StatsSection() {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Performance"
          title="Trusted metrics that reflect our engineering scale and impact."
          description="Realized outcomes, active delivery, and the team strength behind every civil infrastructure program."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <AnimatedCounter key={item.label} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
