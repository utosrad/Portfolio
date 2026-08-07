#!/usr/bin/env node
/**
 * Re-derives the generated half of app/data/profile.ts from two sources of truth:
 *
 *   1. .resume/resume.pdf   — the resume, read as a real PDF (not scraped text)
 *   2. the GitHub API      — every non-fork repo on the account
 *
 * Claude reads both, merges them with the profile that's already on the site,
 * and returns a validated JSON object. Only the region between the SYNC:START
 * and SYNC:END markers is rewritten — philosophy, languages and interests are
 * hand-written and never touched.
 *
 *   node scripts/sync.mjs            # show the diff, write nothing
 *   node scripts/sync.mjs --write    # apply it
 *
 * Needs ANTHROPIC_API_KEY. GITHUB_TOKEN is optional (raises the rate limit and
 * lets it see private repos).
 */

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import Anthropic from "@anthropic-ai/sdk"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const PROFILE = path.join(ROOT, "app/data/profile.ts")
// Kept out of public/ and out of git — the site links to the hosted copy, so
// there's no reason to publish the file itself. Sync reads it locally.
const RESUME = path.join(ROOT, ".resume/resume.pdf")

const START = "// ─── SYNC:START"
const END = "// ─── SYNC:END"

const WRITE = process.argv.includes("--write")
const GH_USER = process.env.GITHUB_USER || "utosrad"

/* ------------------------------------------------------------------ */
/* Sources                                                             */
/* ------------------------------------------------------------------ */

async function readResume() {
  try {
    const buf = await fs.readFile(RESUME)
    return buf.toString("base64")
  } catch {
    console.error(`No resume at ${path.relative(ROOT, RESUME)}.`)
    console.error("Drop your latest resume PDF there and rerun. It stays local — gitignored and never served.")
    process.exit(1)
  }
}

async function gh(url) {
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "darsot-portfolio-sync",
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
  })
  if (!res.ok) throw new Error(`GitHub ${res.status} on ${url}: ${await res.text()}`)
  return res.json()
}

async function readGitHub() {
  const repos = await gh(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`)

  const useful = repos
    .filter((r) => !r.fork && !r.archived && r.name.toLowerCase() !== GH_USER.toLowerCase())
    .slice(0, 30)

  // A README's opening paragraphs say far more than a one-line description.
  const enriched = await Promise.all(
    useful.map(async (r) => {
      let readme = ""
      try {
        const res = await fetch(
          `https://raw.githubusercontent.com/${r.full_name}/${r.default_branch}/README.md`,
          { headers: { "User-Agent": "darsot-portfolio-sync" } },
        )
        if (res.ok) {
          readme = (await res.text())
            .replace(/^!\[.*$/gm, "") // badge lines carry no information
            .replace(/\n{3,}/g, "\n\n")
            .slice(0, 1800)
        }
      } catch {
        /* a missing README is not an error */
      }
      return {
        name: r.name,
        description: r.description,
        homepage: r.homepage || null,
        url: r.html_url,
        language: r.language,
        topics: r.topics ?? [],
        pushed_at: r.pushed_at?.slice(0, 10),
        readme,
      }
    }),
  )

  return enriched
}

/* ------------------------------------------------------------------ */
/* Schema — this is the contract Claude must return                    */
/* ------------------------------------------------------------------ */

const strArr = { type: "array", items: { type: "string" } }

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["profile", "now", "about", "experience", "education", "recognition", "projects", "skills"],
  properties: {
    profile: {
      type: "object",
      additionalProperties: false,
      required: ["name", "handle", "title", "tagline", "location", "email", "github", "githubUser", "linkedin", "website", "resume"],
      properties: {
        name: { type: "string" },
        handle: { type: "string" },
        title: { type: "string" },
        tagline: { type: "string", description: "One line, lowercase-feeling, no marketing adjectives." },
        location: { type: "string" },
        email: { type: "string" },
        github: { type: "string" },
        githubUser: { type: "string" },
        linkedin: { type: "string" },
        website: { type: "string" },
        resume: { type: "string" },
      },
    },
    now: {
      type: "object",
      additionalProperties: false,
      required: ["updated", "items"],
      properties: {
        updated: { type: "string", description: 'Month and year, e.g. "August 2026".' },
        items: { ...strArr, description: "2-4 sentences about what he is actively building." },
      },
    },
    about: { ...strArr, description: "Prose lines. An empty string is a paragraph break. Keep lines under ~95 chars." },
    experience: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["role", "company", "period", "location", "points"],
        properties: {
          role: { type: "string" },
          company: { type: "string" },
          period: { type: "string" },
          location: { type: "string" },
          note: { type: "string" },
          points: strArr,
          stack: strArr,
          link: {
            type: "object",
            additionalProperties: false,
            required: ["label", "href"],
            properties: { label: { type: "string" }, href: { type: "string" } },
          },
        },
      },
    },
    education: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["degree", "institution", "period", "location"],
        properties: {
          degree: { type: "string" },
          institution: { type: "string" },
          period: { type: "string" },
          location: { type: "string" },
        },
      },
    },
    recognition: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "org", "year"],
        properties: { title: { type: "string" }, org: { type: "string" }, year: { type: "string" } },
      },
    },
    projects: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["slug", "name", "blurb", "tech", "year"],
        properties: {
          slug: { type: "string", description: "kebab-case, stable across syncs" },
          name: { type: "string" },
          blurb: { type: "string", description: "One sentence. What it does, concretely." },
          detail: { type: "string" },
          tech: strArr,
          repo: { type: "string" },
          live: { type: "string" },
          year: { type: "string" },
          featured: { type: "boolean" },
          award: { type: "string" },
        },
      },
    },
    skills: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["group", "items"],
        properties: { group: { type: "string" }, items: strArr },
      },
    },
  },
}

/* ------------------------------------------------------------------ */
/* Prompt                                                              */
/* ------------------------------------------------------------------ */

const SYSTEM = `You maintain the content layer of a personal engineering portfolio at darsot.ca.

You are given three inputs: the owner's current resume as a PDF, a dump of his public
GitHub repositories, and the profile data the site is currently serving. Produce the
updated profile data.

The resume is authoritative for employment: roles, companies, dates, locations, and the
substance of what he did. If the resume and the current site disagree about a job, the
resume wins. GitHub is authoritative for what projects exist and where they live.

Rules:

- Never invent a fact. Every claim must trace to the resume, a repo, or the existing
  profile. If the resume dropped something, drop it — do not carry it forward on a hunch.
- Preserve existing project slugs so permalinks stay valid. New projects get new slugs.
- Keep the existing voice: plain, specific, understated. State what a thing does rather
  than how impressive it is. No "passionate", no "cutting-edge", no "leveraging".
- Metrics stay exactly as written. Do not round, restate or embellish a number.
- Order experience with the current role first, then reverse-chronologically.
- Mark 4-5 projects featured: the ones that are most technically interesting or that
  carry an award, not simply the newest.
- Keep 'about' lines under about 95 characters — they render in a fixed-width terminal.
- Carry forward anything in the current profile that the resume and GitHub don't cover
  but that is still true (personal site links, location, handle).`

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */

const j = (v) => JSON.stringify(v, null, 2)

function render(d) {
  const job = (job) => {
    const lines = [
      `  {`,
      `    role: ${j(job.role)},`,
      `    company: ${j(job.company)},`,
      `    period: ${j(job.period)},`,
      `    location: ${j(job.location)},`,
    ]
    if (job.note) lines.push(`    note: ${j(job.note)},`)
    lines.push(`    points: [`, ...job.points.map((p) => `      ${j(p)},`), `    ],`)
    if (job.stack?.length) lines.push(`    stack: ${j(job.stack)},`)
    if (job.link) lines.push(`    link: { label: ${j(job.link.label)}, href: ${j(job.link.href)} },`)
    lines.push(`  },`)
    return lines.join("\n")
  }

  const project = (p) => {
    const lines = [`  {`, `    slug: ${j(p.slug)},`, `    name: ${j(p.name)},`, `    blurb: ${j(p.blurb)},`]
    if (p.detail) lines.push(`    detail: ${j(p.detail)},`)
    lines.push(`    tech: ${j(p.tech)},`)
    if (p.repo) lines.push(`    repo: ${j(p.repo)},`)
    if (p.live) lines.push(`    live: ${j(p.live)},`)
    lines.push(`    year: ${j(p.year)},`)
    if (p.featured) lines.push(`    featured: true,`)
    if (p.award) lines.push(`    award: ${j(p.award)},`)
    lines.push(`  },`)
    return lines.join("\n")
  }

  return `${START} ──────────────────────────────────────────────────────────────
// Everything between these markers is rewritten by \`npm run sync\`, which
// re-derives it from .resume/resume.pdf and the GitHub API. Hand-edits here are
// safe until the next sync; anything you want to keep permanently goes below
// SYNC:END.

export const profile = ${j(d.profile)} as const

export const now = {
  updated: ${j(d.now.updated)},
  items: [
${d.now.items.map((i) => `    ${j(i)},`).join("\n")}
  ],
}

export const about = [
${d.about.map((l) => `  ${j(l)},`).join("\n")}
]

export type Job = {
  role: string
  company: string
  period: string
  location: string
  note?: string
  points: string[]
  stack?: string[]
  link?: { label: string; href: string }
}

export const experience: Job[] = [
${d.experience.map(job).join("\n")}
]

export const education = ${j(d.education)}

export const recognition = ${j(d.recognition)}

export type Project = {
  slug: string
  name: string
  blurb: string
  detail?: string
  tech: string[]
  repo?: string
  live?: string
  year: string
  featured?: boolean
  award?: string
}

export const projects: Project[] = [
${d.projects.map(project).join("\n")}
]

export const skills: { group: string; items: string[] }[] = ${j(d.skills)}

${END} ────────────────────────────────────────────────────────────────`
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY is not set.")
    process.exit(1)
  }

  const current = await fs.readFile(PROFILE, "utf8")
  const startAt = current.indexOf(START)
  const endAt = current.indexOf(END)
  if (startAt === -1 || endAt === -1) {
    console.error("Could not find the SYNC:START / SYNC:END markers in profile.ts.")
    process.exit(1)
  }
  // Replace from START through the end of the END marker's own line.
  const endOfBlock = current.indexOf("\n", endAt)
  const generatedNow = current.slice(startAt, endOfBlock)

  console.log("Reading resume…")
  const resume = await readResume()

  console.log("Reading GitHub…")
  const repos = await readGitHub()
  console.log(`  ${repos.length} repos`)

  const client = new Anthropic()

  console.log("Asking Claude to merge…")
  const stream = client.messages.stream({
    model: "claude-opus-5",
    max_tokens: 32000,
    system: SYSTEM,
    output_config: { format: { type: "json_schema", schema: SCHEMA } },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: { type: "base64", media_type: "application/pdf", data: resume },
          },
          {
            type: "text",
            text: `Above is the current resume.

<github_repos>
${JSON.stringify(repos, null, 1)}
</github_repos>

<current_profile_source>
${generatedNow}
</current_profile_source>

Return the updated profile data.`,
          },
        ],
      },
    ],
  })

  stream.on("text", () => process.stdout.write("."))
  const message = await stream.finalMessage()
  process.stdout.write("\n")

  if (message.stop_reason === "refusal") {
    console.error("Request was declined:", message.stop_details)
    process.exit(1)
  }
  if (message.stop_reason === "max_tokens") {
    console.error("Response was truncated — raise max_tokens and retry.")
    process.exit(1)
  }

  const text = message.content.find((b) => b.type === "text")?.text
  if (!text) {
    console.error("No text block in the response.")
    process.exit(1)
  }

  const data = JSON.parse(text)
  const next = current.slice(0, startAt) + render(data) + current.slice(endOfBlock)

  if (next === current) {
    console.log("Already up to date — nothing changed.")
    return
  }

  const summary = [
    `${data.experience.length} roles`,
    `${data.projects.length} projects (${data.projects.filter((p) => p.featured).length} featured)`,
    `${data.skills.length} skill groups`,
  ].join(" · ")

  if (!WRITE) {
    const preview = path.join(ROOT, "profile.synced.ts")
    await fs.writeFile(preview, next)
    console.log(`\nDry run. ${summary}`)
    console.log(`Wrote ${path.relative(ROOT, preview)} — diff it, then rerun with --write.`)
    console.log(`  git diff --no-index app/data/profile.ts profile.synced.ts`)
    return
  }

  await fs.writeFile(PROFILE, next)
  console.log(`\nUpdated app/data/profile.ts. ${summary}`)
  console.log("Run `npm run build` before deploying.")
}

// Only run when invoked directly, so the renderer can be imported and tested.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

export { render, SCHEMA }
