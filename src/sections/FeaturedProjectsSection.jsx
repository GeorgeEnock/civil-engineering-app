import SectionHeading from '../components/SectionHeading'
import ProjectCard from '../components/ProjectCard'
import { featuredProjects } from '../data/homeData'

export default function FeaturedProjectsSection() {
  return (
    <section id="projects" className="bg-[#F8FAFC] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Projects that demonstrate our engineered delivery and construction excellence."
          description="Each project combines precision design, field coordination, and data-driven execution to deliver resilient infrastructure."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </div>
    </section>
  )
}
