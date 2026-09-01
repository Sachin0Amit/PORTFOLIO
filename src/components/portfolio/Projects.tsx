"use client"

import { ExternalLink, FlaskConical, Github } from "lucide-react"
import SectionHeading from "./SectionHeading"
import Reveal from "./Reveal"
import { PROJECTS } from "@/lib/portfolio-data"

export default function Projects() {
  return (
    <section id="projects" className="relative overflow-hidden py-24 sm:py-32">
      {/* Ambient layers */}
      <div className="star-field absolute inset-0 opacity-35" aria-hidden="true" />
      <div
        className="absolute -left-24 top-20 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -right-24 bottom-16 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="projects"
          title={
            <>
              My <span className="text-gradient">Projects</span>
            </>
          }
          description="Things I've built and concepts I'm exploring."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, i) => {
            const isHere = project.highlight === "You are here"

            return (
              <Reveal key={project.title} delay={i * 0.12}>
                <article className="glass group flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:border-fuchsia-400/40">
                  {/* image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={project.image}
                      alt={`${project.title} project preview`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                      aria-hidden="true"
                    />
                    <span className="chip absolute left-3 top-3 backdrop-blur-md">
                      {project.category}
                    </span>
                    <span
                      className={`chip absolute right-3 top-3 backdrop-blur-md ${
                        isHere ? "border-amber-300/40 text-amber-300" : ""
                      }`}
                    >
                      {project.highlight}
                    </span>
                  </div>

                  {/* body */}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-lg font-semibold transition-colors group-hover:text-fuchsia-300">
                      {project.title}
                    </h3>
                    <p className="mt-0.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      {project.subtitle}
                    </p>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {project.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.tech.map((tech) => (
                        <span key={tech} className="chip px-2.5 py-1 text-[10px]">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="my-4 h-px w-full bg-white/10" aria-hidden="true" />

                    <div className="mt-auto flex gap-2">
                      <a
                        href="#"
                        aria-label={`${project.title} source code`}
                        className="glass focus-visible:ring-2 focus-visible:ring-fuchsia-400/60 flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 hover:border-fuchsia-400/50 hover:text-fuchsia-300 focus-visible:outline-none"
                      >
                        <Github className="h-4 w-4" aria-hidden="true" />
                      </a>
                      <a
                        href="#"
                        aria-label={`${project.title} live preview`}
                        className="glass focus-visible:ring-2 focus-visible:ring-fuchsia-400/60 flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 hover:border-fuchsia-400/50 hover:text-fuchsia-300 focus-visible:outline-none"
                      >
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>

        {/* footer note */}
        <Reveal delay={0.2} className="mt-10">
          <p className="flex items-center justify-center gap-2 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <FlaskConical className="h-4 w-4 text-amber-300" aria-hidden="true" />
            More experiments launching soon — the lab never sleeps
          </p>
        </Reveal>
      </div>
    </section>
  )
}
