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

/**
 * Typed output lines. The old terminal inferred styling from string content
 * (does it contain "=", does it start with an emoji), which made colours
 * unpredictable. Each line now declares what it is.
 */
export type Line =
  | { k: "blank" }
  | { k: "text"; t: string }
  | { k: "dim"; t: string }
  | { k: "head"; t: string }
  | { k: "sub"; t: string }
  | { k: "bullet"; t: string }
  | { k: "kv"; key: string; val: string }
  | { k: "link"; label: string; href: string; note?: string }
  | { k: "tags"; items: string[] }
  | { k: "err"; t: string }
  | { k: "ok"; t: string }

export type Entry = { input: string | null; lines: Line[] }

export type CommandResult = {
  lines?: Line[]
  clear?: boolean
  theme?: string
  view?: "landing"
  openUrl?: string
}

const B: Line = { k: "blank" }
const t = (s: string): Line => ({ k: "text", t: s })
const dim = (s: string): Line => ({ k: "dim", t: s })
const head = (s: string): Line => ({ k: "head", t: s })
const sub = (s: string): Line => ({ k: "sub", t: s })
const li = (s: string): Line => ({ k: "bullet", t: s })
const kv = (key: string, val: string): Line => ({ k: "kv", key, val })
const link = (label: string, href: string, note?: string): Line => ({ k: "link", label, href, note })

export const THEMES = ["phosphor", "amber", "ice", "paper"] as const
export type Theme = (typeof THEMES)[number]

/** Commands offered to tab-completion, in the order they appear in `help`. */
export const COMMANDS = [
  "help",
  "about",
  "now",
  "experience",
  "projects",
  "skills",
  "education",
  "awards",
  "resume",
  "contact",
  "languages",
  "interests",
  "neofetch",
  "theme",
  "open",
  "clear",
  "history",
  "whoami",
  "ls",
  "cat",
  "sudo",
  "exit",
]

const HELP: { cmd: string; desc: string }[] = [
  { cmd: "about", desc: "who I am and what I work on" },
  { cmd: "now", desc: "what I'm building this month" },
  { cmd: "experience", desc: "where I've worked" },
  { cmd: "projects", desc: "things I've built (try: projects --all)" },
  { cmd: "skills", desc: "languages, frameworks, tools" },
  { cmd: "education", desc: "school and recognition" },
  { cmd: "resume", desc: "view my resume" },
  { cmd: "contact", desc: "how to reach me" },
  { cmd: "open <name>", desc: "open a project, repo or link" },
  { cmd: "theme <name>", desc: "phosphor · amber · ice · paper" },
  { cmd: "clear", desc: "clear the screen  (ctrl+l)" },
]

function projectLines(p: (typeof projects)[number]): Line[] {
  const out: Line[] = [sub(`${p.name}  ·  ${p.year}`), t(p.blurb)]
  if (p.award) out.push({ k: "ok", t: `★ ${p.award}` })
  if (p.detail) out.push(dim(p.detail))
  out.push({ k: "tags", items: p.tech })
  if (p.live) out.push(link("live demo", p.live))
  if (p.repo) out.push(link("source", p.repo))
  out.push(B)
  return out
}

function findProject(q: string) {
  const ql = q.toLowerCase()
  const n = ql.replace(/[^a-z0-9]/g, "")

  // Exact matches win outright, so a later project's slug can't be beaten by an
  // earlier project's name happening to contain it.
  const exact = projects.find(
    (p) => p.slug === ql || p.slug.replace(/-/g, "") === n || p.name.toLowerCase().replace(/[^a-z0-9]/g, "") === n,
  )
  if (exact) return exact

  // Substring matching needs enough characters to mean something — without this
  // `open e` matched the first project with an "e" in its name.
  if (ql.length < 3) return undefined
  return projects.find((p) => p.name.toLowerCase().includes(ql) || p.slug.includes(ql))
}

export function welcome(): Line[] {
  return [
    head(profile.name),
    t(`${profile.title} · ${profile.location}`),
    B,
    dim(profile.tagline),
    B,
    t("Type a command, or press Tab to autocomplete."),
    dim("New here? Start with `about`, then `experience` or `projects`."),
    B,
  ]
}

export function run(raw: string): CommandResult {
  const trimmed = raw.trim()
  const args = trimmed.split(/\s+/)
  const cmd = (args[0] || "").toLowerCase()
  const arg = args.slice(1).join(" ")

  switch (cmd) {
    case "":
      return { lines: [] }

    case "help":
    case "?":
    case "man":
      return {
        lines: [
          head("Commands"),
          B,
          ...HELP.map((h) => kv(h.cmd, h.desc)),
          B,
          dim("Tab completes · ↑ ↓ walks history · ctrl+l clears"),
          B,
        ],
      }

    case "clear":
    case "cls":
      return { clear: true }

    case "about":
    case "bio":
      return { lines: [head("About"), B, ...about.map((l) => (l ? t(l) : B)), B] }

    case "now":
      return {
        lines: [
          head("Now"),
          dim(`Updated ${now.updated}`),
          B,
          ...now.items.map((i) => li(i)),
          B,
        ],
      }

    case "experience":
    case "work":
    case "xp":
      return {
        lines: [
          head("Experience"),
          B,
          ...experience.flatMap((job): Line[] => [
            sub(`${job.company} — ${job.role}`),
            t(`${job.period} · ${job.location}`),
            ...(job.note ? [dim(job.note)] : []),
            B,
            ...job.points.map((p) => li(p)),
            ...(job.stack ? [{ k: "tags" as const, items: job.stack }] : []),
            ...(job.link ? [link(job.link.label, job.link.href)] : []),
            B,
          ]),
        ],
      }

    case "projects":
    case "work-samples": {
      const all = arg === "--all" || arg === "-a" || arg === "all"
      const list = all ? projects : projects.filter((p) => p.featured)
      return {
        lines: [
          head("Projects"),
          dim(
            all
              ? `All ${projects.length}. Run \`open <name>\` to jump to one.`
              : `${list.length} featured of ${projects.length}. Run \`projects --all\` for the rest.`,
          ),
          B,
          ...list.flatMap((p) => projectLines(p)),
        ],
      }
    }

    case "skills":
    case "stack":
      return {
        lines: [
          head("Skills"),
          B,
          ...skills.flatMap((s): Line[] => [sub(s.group), { k: "tags", items: s.items }, B]),
        ],
      }

    case "education":
    case "school":
      return {
        lines: [
          head("Education"),
          B,
          ...education.flatMap((e): Line[] => [
            sub(e.institution),
            t(e.degree),
            dim(`${e.period} · ${e.location}`),
            B,
          ]),
          sub("Recognition"),
          ...recognition.map((r) => kv(r.title, [r.org, r.year].filter(Boolean).join(" · "))),
          B,
        ],
      }

    case "awards":
    case "recognition":
      return {
        lines: [
          head("Recognition"),
          B,
          ...recognition.map((r) => kv(r.title, [r.org, r.year].filter(Boolean).join(" · "))),
          B,
        ],
      }

    case "resume":
    case "cv":
      return {
        lines: [
          head("Resume"),
          B,
          link("View my resume", profile.resume, "opens in a new tab"),
          B,
          dim("Or read it here: `experience`, `projects`, `skills`, `education`."),
          B,
        ],
      }

    case "contact":
    case "email":
      return {
        lines: [
          head("Contact"),
          B,
          link(profile.email, `mailto:${profile.email}`, "email"),
          link("github.com/" + profile.githubUser, profile.github, "github"),
          link("linkedin.com/in/darsot", profile.linkedin, "linkedin"),
          B,
          t("Best way to reach me is email. I read everything."),
          B,
        ],
      }

    case "languages":
      return {
        lines: [head("Languages"), B, ...languages.map((l) => kv(l.name, l.level)), B],
      }

    case "interests":
    case "hobbies":
      return { lines: [head("Interests"), B, ...interests.map((i) => li(i)), B] }

    case "theme": {
      const name = arg.toLowerCase() as Theme
      if (!arg) {
        return {
          lines: [
            head("Themes"),
            B,
            ...THEMES.map((th) => kv(th, th === "paper" ? "light mode" : "dark")),
            B,
            dim("Usage: theme amber"),
            B,
          ],
        }
      }
      if (!THEMES.includes(name)) {
        return { lines: [{ k: "err", t: `theme: unknown theme '${arg}'` }, dim(`Available: ${THEMES.join(", ")}`), B] }
      }
      return { theme: name, lines: [{ k: "ok", t: `Theme set to ${name}.` }, B] }
    }

    case "exit":
    case "quit":
      return { view: "landing" }

    case "open": {
      if (!arg) return { lines: [{ k: "err", t: "open: what should I open?" }, dim("Try: open weather-edge · open github · open resume"), B] }
      const shortcuts: Record<string, string> = {
        github: profile.github,
        gh: profile.github,
        linkedin: profile.linkedin,
        li: profile.linkedin,
        resume: profile.resume,
        cv: profile.resume,
        email: `mailto:${profile.email}`,
        site: profile.website,
      }
      const key = arg.toLowerCase()
      if (shortcuts[key]) return { openUrl: shortcuts[key], lines: [{ k: "ok", t: `Opening ${key}…` }, B] }

      const p = findProject(arg)
      if (p) {
        const url = p.live || p.repo
        if (!url) return { lines: [t(`${p.name} has no public link yet.`), dim(p.detail || p.blurb), B] }
        return { openUrl: url, lines: [{ k: "ok", t: `Opening ${p.name}…` }, B] }
      }
      if (/^https?:\/\//.test(arg)) return { openUrl: arg, lines: [{ k: "ok", t: `Opening ${arg}…` }, B] }
      return {
        lines: [
          { k: "err", t: `open: no match for '${arg}'` },
          dim("Known: " + projects.map((p) => p.slug).join(", ")),
          B,
        ],
      }
    }

    case "whoami":
      return { lines: [t(profile.handle), B] }

    case "ls": {
      return {
        lines: [
          { k: "tags", items: ["about", "now", "experience", "projects", "skills", "education", "awards", "contact"] },
          dim("resume.pdf"),
          B,
        ],
      }
    }

    case "cat": {
      if (!arg) return { lines: [{ k: "err", t: "cat: missing operand" }, B] }
      if (arg === "resume.pdf" || arg === "resume") return run("resume")
      const READABLE = ["about", "now", "experience", "projects", "skills", "education", "awards", "contact", "languages", "interests"]
      const file = arg.replace(/\.txt$/, "")
      if (READABLE.includes(file)) return run(file)
      return { lines: [{ k: "err", t: `cat: ${arg}: no such file` }, B] }
    }

    case "neofetch": {
      const art = [
        "       ▄▄▄▄▄▄▄       ",
        "    ▄█████████████▄   ",
        "  ▄███▀         ▀███▄ ",
        " ███▀   ▄█████▄   ▀███",
        "███    ███   ███    ██",
        "███    ███   ███    ██",
        " ███▄   ▀█████▀   ▄███",
        "  ▀███▄         ▄███▀ ",
        "    ▀█████████████▀   ",
        "       ▀▀▀▀▀▀▀       ",
      ]
      const info: Line[] = [
        sub(`${profile.handle}@darsot.ca`),
        dim("─".repeat(28)),
        kv("Role", profile.title),
        kv("Recent", experience[0]?.company ?? "—"),
        kv("School", "University of Waterloo"),
        kv("Location", profile.location),
        kv("Projects", `${projects.length} public`),
        kv("Languages", skills[0]?.items.slice(0, 4).join(", ") ?? "—"),
        kv("Shell", "darsot-term 2.0"),
        kv("Uptime", "since 2005"),
      ]
      return { lines: [B, ...art.map((a) => dim(a)), B, ...info, B] }
    }

    case "sudo":
      return {
        lines: [
          { k: "err", t: `${profile.handle} is not in the sudoers file. This incident will be reported.` },
          B,
        ],
      }

    case "history":
      return { lines: [] } // handled by the component, which owns history state

    default: {
      const guess = didYouMean(cmd)
      return {
        lines: [
          { k: "err", t: `command not found: ${cmd}` },
          dim(guess ? `Did you mean \`${guess}\`?` : "Type `help` to see what's available."),
          B,
        ],
      }
    }
  }
}

/** Cheap edit-distance suggestion so typos are recoverable. */
function didYouMean(input: string): string | null {
  if (input.length < 2) return null
  let best: string | null = null
  // Scale tolerance to the word being matched, so a 1-char input doesn't
  // "nearly match" every short command.
  let bestScore = Infinity
  for (const c of COMMANDS) {
    const d = distance(input, c)
    if (d < bestScore && d <= Math.max(2, Math.ceil(c.length / 3))) {
      bestScore = d
      best = c
    }
  }
  return best
}

function distance(a: string, b: string): number {
  const m: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  )
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      m[i][j] = Math.min(
        m[i - 1][j] + 1,
        m[i][j - 1] + 1,
        m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
  return m[a.length][b.length]
}

/** Longest-common-prefix completion, plus the candidate list for display. */
export function complete(input: string): { completion: string; candidates: string[] } {
  const parts = input.split(/\s+/)
  if (parts.length > 1) {
    // completing an argument
    const base = parts[0].toLowerCase()
    const frag = parts[parts.length - 1].toLowerCase()
    let pool: string[] = []
    if (base === "open") pool = [...projects.map((p) => p.slug), "github", "linkedin", "resume", "email"]
    else if (base === "theme") pool = [...THEMES]
    const cands = pool.filter((c) => c.startsWith(frag))
    if (!cands.length) return { completion: input, candidates: [] }
    const pre = commonPrefix(cands)
    return { completion: [...parts.slice(0, -1), pre].join(" "), candidates: cands }
  }
  const frag = parts[0].toLowerCase()
  if (!frag) return { completion: input, candidates: [] }
  const cands = COMMANDS.filter((c) => c.startsWith(frag))
  if (!cands.length) return { completion: input, candidates: [] }
  return { completion: commonPrefix(cands), candidates: cands }
}

function commonPrefix(list: string[]): string {
  if (!list.length) return ""
  let pre = list[0]
  for (const s of list) {
    while (!s.startsWith(pre)) pre = pre.slice(0, -1)
  }
  return pre
}
