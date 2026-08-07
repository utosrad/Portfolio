"use client"

import { useEffect, useState } from "react"
import {
  profile,
  now,
  about,
  experience,
  education,
  recognition,
  projects,
  skills,
  languages,
  interests,
} from "../data/profile"
import type { Theme } from "../lib/terminal"

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
]

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[11px] leading-none px-2 py-1 rounded-full border"
      style={{ color: "var(--fg-dim)", borderColor: "var(--border)", background: "var(--bg-raise)" }}
    >
      {children}
    </span>
  )
}

function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 py-10 sm:py-14 border-t" style={{ borderColor: "var(--border)" }}>
      <h2
        className="font-mono text-xs uppercase tracking-[0.18em] mb-6"
        style={{ color: "var(--accent)" }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function DocView({
  onTerminal,
  theme,
  setTheme,
}: {
  onTerminal: () => void
  theme: Theme
  setTheme: (t: Theme) => void
}) {
  const [active, setActive] = useState("about")

  // Highlight the nav item for whichever section is on screen.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0.1, 0.5, 1] },
    )
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return (
    <div className="min-h-[100dvh]" style={{ background: "var(--bg)", color: "var(--fg)" }}>
      {/* Sticky nav */}
      <header
        className="sticky top-0 z-40 backdrop-blur-md border-b"
        style={{ background: "color-mix(in srgb, var(--bg) 82%, transparent)", borderColor: "var(--border)" }}
      >
        <div className="max-w-3xl mx-auto px-5 sm:px-6 h-14 flex items-center gap-4">
          <span className="font-mono text-sm font-semibold shrink-0" style={{ color: "var(--accent)" }}>
            darsot.ca
          </span>

          <nav className="hidden sm:flex gap-1 flex-1 justify-center">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-xs px-2.5 py-1.5 rounded-md transition-colors"
                style={{
                  color: active === s.id ? "var(--fg)" : "var(--fg-dim)",
                  background: active === s.id ? "var(--accent-soft)" : "transparent",
                }}
              >
                {s.label}
              </a>
            ))}
          </nav>

          <div className="flex-1 sm:hidden" />

          <button
            onClick={() => {
              const order = ["phosphor", "amber", "ice", "paper"] as Theme[]
              setTheme(order[(order.indexOf(theme) + 1) % order.length])
            }}
            aria-label="Change theme"
            title={`Theme: ${theme}`}
            className="text-xs w-8 h-8 rounded-md border shrink-0 hover:opacity-75 transition"
            style={{ borderColor: "var(--border)", color: "var(--fg-dim)" }}
          >
            ◐
          </button>

          <button
            onClick={onTerminal}
            className="font-mono text-xs px-3 py-1.5 rounded-md border shrink-0 hover:opacity-80 transition"
            style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
          >
            <span className="hidden sm:inline">Terminal</span>
            <span className="sm:hidden">$_</span>
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 sm:px-6 pb-24">
        {/* Hero */}
        <div className="pt-14 sm:pt-20 pb-4">
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight mb-3">{profile.name}</h1>
          <p className="text-base sm:text-lg mb-1" style={{ color: "var(--fg)" }}>
            {profile.title} · {experience[0].company}
          </p>
          <p className="text-sm mb-7" style={{ color: "var(--fg-dim)" }}>
            {profile.tagline}
          </p>

          <div className="flex flex-wrap gap-2">
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-4 py-2 rounded-lg font-medium transition hover:opacity-85"
              style={{ background: "var(--accent)", color: "var(--bg)" }}
            >
              Resume ↗
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="text-sm px-4 py-2 rounded-lg border transition hover:opacity-75"
              style={{ borderColor: "var(--border)", color: "var(--fg)" }}
            >
              Email
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-4 py-2 rounded-lg border transition hover:opacity-75"
              style={{ borderColor: "var(--border)", color: "var(--fg)" }}
            >
              GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-4 py-2 rounded-lg border transition hover:opacity-75"
              style={{ borderColor: "var(--border)", color: "var(--fg)" }}
            >
              LinkedIn
            </a>
          </div>
        </div>

        {/* Now */}
        <div
          className="mt-8 rounded-xl border p-5"
          style={{ borderColor: "var(--border)", background: "var(--bg-raise)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--accent)", boxShadow: "var(--glow)" }}
            />
            <span className="font-mono text-xs uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>
              Now
            </span>
            <span className="text-xs" style={{ color: "var(--fg-dim)" }}>
              {now.updated}
            </span>
          </div>
          <ul className="space-y-1.5">
            {now.items.map((i) => (
              <li key={i} className="text-sm flex gap-2.5">
                <span style={{ color: "var(--fg-dim)" }}>›</span>
                <span>{i}</span>
              </li>
            ))}
          </ul>
        </div>

        <Section id="about" title="About">
          <div className="space-y-4 text-[15px] leading-relaxed" style={{ color: "var(--fg)" }}>
            {about
              .join("\n")
              .split("\n\n")
              .filter(Boolean)
              .map((para, i) => (
                <p key={i}>{para.replace(/\n/g, " ")}</p>
              ))}
          </div>
        </Section>

        <Section id="experience" title="Experience">
          <div className="space-y-9">
            {experience.map((job) => (
              <article key={job.company}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-1">
                  <h3 className="font-semibold text-[15px]">{job.company}</h3>
                  <span className="font-mono text-xs" style={{ color: "var(--fg-dim)" }}>
                    {job.period}
                  </span>
                </div>
                <p className="text-sm mb-1" style={{ color: "var(--accent)" }}>
                  {job.role}
                </p>
                <p className="text-xs mb-3" style={{ color: "var(--fg-dim)" }}>
                  {job.location}
                  {job.note ? ` · ${job.note}` : ""}
                </p>
                <ul className="space-y-2">
                  {job.points.map((p, i) => (
                    <li key={i} className="text-sm flex gap-2.5 leading-relaxed">
                      <span aria-hidden style={{ color: "var(--fg-dim)" }} className="shrink-0">
                        ›
                      </span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                {job.stack && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {job.stack.map((s) => (
                      <Tag key={s}>{s}</Tag>
                    ))}
                  </div>
                )}

                {job.link && (
                  <a
                    href={job.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-sm font-mono underline underline-offset-4"
                    style={{ color: "var(--accent)" }}
                  >
                    {job.link.label} ↗
                  </a>
                )}
              </article>
            ))}
          </div>

          <div className="mt-9 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
            {education.map((e) => (
              <div key={e.degree} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <div>
                  <h3 className="font-semibold text-[15px]">{e.institution}</h3>
                  <p className="text-sm" style={{ color: "var(--accent)" }}>
                    {e.degree}
                  </p>
                </div>
                <span className="font-mono text-xs" style={{ color: "var(--fg-dim)" }}>
                  {e.period}
                </span>
              </div>
            ))}

            <ul className="mt-4 space-y-1">
              {recognition.map((r) => (
                <li key={r.title} className="text-sm flex flex-wrap gap-x-2">
                  <span style={{ color: "var(--accent)" }}>★</span>
                  <span>{r.title}</span>
                  <span style={{ color: "var(--fg-dim)" }}>
                    {[r.org, r.year].filter(Boolean).join(" · ")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section id="projects" title="Projects">
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((p) => {
              const href = p.live || p.repo
              const Wrapper = href ? "a" : "div"
              return (
                <Wrapper
                  key={p.slug}
                  {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group rounded-xl border p-4 flex flex-col transition hover:-translate-y-0.5"
                  style={{ borderColor: "var(--border)", background: "var(--bg-raise)" }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-semibold text-[15px] leading-snug">{p.name}</h3>
                    {href && (
                      <span
                        aria-hidden
                        className="text-xs opacity-0 group-hover:opacity-100 transition shrink-0"
                        style={{ color: "var(--accent)" }}
                      >
                        ↗
                      </span>
                    )}
                  </div>
                  {p.award && (
                    <p className="text-[11px] font-mono mb-1.5" style={{ color: "var(--accent)" }}>
                      ★ {p.award}
                    </p>
                  )}
                  <p className="text-sm mb-3 leading-relaxed flex-1" style={{ color: "var(--fg-dim)" }}>
                    {p.blurb}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tech.slice(0, 4).map((tech) => (
                      <Tag key={tech}>{tech}</Tag>
                    ))}
                  </div>
                  {p.live && (
                    <span className="mt-2.5 text-[11px] font-mono" style={{ color: "var(--accent)" }}>
                      live demo
                    </span>
                  )}
                </Wrapper>
              )
            })}
          </div>
        </Section>

        <Section id="skills" title="Skills">
          <div className="space-y-5">
            {skills.map((s) => (
              <div key={s.group}>
                <h3 className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: "var(--fg-dim)" }}>
                  {s.group}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {s.items.map((i) => (
                    <Tag key={i}>{i}</Tag>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: "var(--fg-dim)" }}>
                Languages
              </h3>
              <ul className="space-y-1">
                {languages.map((l) => (
                  <li key={l.name} className="text-sm">
                    <span className="font-medium">{l.name}</span>{" "}
                    <span style={{ color: "var(--fg-dim)" }}>— {l.level}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: "var(--fg-dim)" }}>
                Outside work
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {interests.map((i) => (
                  <Tag key={i}>{i}</Tag>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section id="contact" title="Contact">
          <p className="text-[15px] mb-5">
            Best way to reach me is email — I read everything.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={`mailto:${profile.email}`}
              className="text-sm px-4 py-2 rounded-lg font-medium transition hover:opacity-85"
              style={{ background: "var(--accent)", color: "var(--bg)" }}
            >
              {profile.email}
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-4 py-2 rounded-lg border transition hover:opacity-75"
              style={{ borderColor: "var(--border)" }}
            >
              GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-4 py-2 rounded-lg border transition hover:opacity-75"
              style={{ borderColor: "var(--border)" }}
            >
              LinkedIn
            </a>
          </div>
        </Section>

        <footer
          className="pt-8 border-t flex flex-wrap items-center justify-between gap-3 text-xs"
          style={{ borderColor: "var(--border)", color: "var(--fg-dim)" }}
        >
          <span className="font-mono">© {new Date().getFullYear()} Umar Darsot</span>
          <button onClick={onTerminal} className="font-mono hover:underline" style={{ color: "var(--accent)" }}>
            $ open terminal
          </button>
        </footer>
      </main>
    </div>
  )
}
