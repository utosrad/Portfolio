// Single source of truth for every piece of content on the site.
// Update this file and the terminal and the page metadata both follow.
//
// This file is also the write target of `npm run sync` — see scripts/sync.mjs,
// which re-derives it from .resume/resume.pdf and the GitHub API.

// ─── SYNC:START ──────────────────────────────────────────────────────────────
// Everything between these markers is rewritten by `npm run sync`, which
// re-derives it from .resume/resume.pdf and the GitHub API. Hand-edits here are
// safe until the next sync; anything you want to keep permanently goes below
// SYNC:END.

export const profile = {
  name: "Umar Darsot",
  handle: "umar",
  title: "Software Engineer",
  tagline: "I build.",
  location: "Waterloo, ON",
  email: "udarsot@gmail.com",
  github: "https://github.com/utosrad",
  githubUser: "utosrad",
  linkedin: "https://linkedin.com/in/umar-darsot",
  website: "https://darsot.ca",
  resume: "https://drive.google.com/file/d/1LNdyQsyrLO8bhq52GYOnjlwMl7TCzaeW/view?usp=sharing",
} as const

export const now = {
  updated: "August 2026",
  items: [
    "Back at Waterloo for the fall term.",
    "Building agent tooling — an MCP server that drives the iOS Simulator end to end.",
    "Chasing side projects that teach me something: delay contagion, forecast calibration.",
  ],
}

export const about = [
  "I'm a software engineer and a math co-op student at Waterloo.",
  "",
  "Most recently I led the mobile experience at Dapital, building a 0 to 1 iOS app in",
  "Swift and UIKit along with the real-time data layer underneath it — live prices for",
  "150+ pairs, and an interface that stays correct when things move fast.",
  "",
  "Before that: data and product work at Interac on the e-Transfer team, and document",
  "automation at Purolator.",
  "",
  "Outside of work I'm usually shipping something small and sharp — a flight delay model",
  "that took first at I4, an MCP server that lets an agent drive an iOS Simulator, a",
  "parametric Blender script that prints a wallet sized to my own phone.",
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
  {
    role: "Software Engineer",
    company: "Dapital",
    period: "Sep 2025 — May 2026",
    location: "New York City",
    note: "Social iOS brokerage for tokenized assets · pre-seed, alongside ex-Optiver and ex-Meta engineers",
    points: [
      "Built and launched a 0 to 1 iOS perpetual futures trading platform in Swift and UIKit, powered by Hyperliquid.",
      "Built the real-time data layer streaming live prices for 150+ crypto pairs over WebSockets and gRPC, refreshing charts, open positions and portfolio value across the app in under 80ms.",
      "Designed and built the perps candlestick chart, distilling the strongest interaction patterns from leading mobile trading apps into a single scrub-driven component that became the standard across the app.",
      "Owned the broader mobile trading experience: order entry, execution, portfolio updates and production reliability. Also built the web platform in Next.js.",
    ],
    stack: ["Swift", "UIKit", "SwiftUI", "Next.js", "WebSockets", "gRPC", "Hyperliquid"],
    link: { label: "Try it on TestFlight", href: "https://testflight.apple.com/join/JNBe8KVF" },
  },
  {
    role: "Product — Money Movement / e-Transfer",
    company: "Interac",
    period: "Jan 2026 — Apr 2026",
    location: "Toronto, ON",
    points: [
      "Built a cross-bank intelligence system mapping which banks 9M+ Canadians actually use by linking e-Transfer and debit activity, packaged as an analytics product Interac could sell back to those banks.",
      "Ran network analysis across millions of banking transactions, surfacing 10K+ risky account relationships and activity patterns invisible inside any single institution's data.",
      "Built an AI-powered market intelligence pipeline processing 40+ fintech sources biweekly through a multi-stage LLM workflow — adopted across the e-Transfer and Debit teams, saving 6+ hours weekly. Scraped Reddit, X, RedFlagDeals and news, deployed on Railway, delivered via Telegram and HTML email.",
    ],
  },
  {
    role: "Software Engineer, Data Science",
    company: "Purolator",
    period: "May 2025 — Aug 2025",
    location: "Toronto, ON",
    points: [
      "Built a document automation platform in Python, Flask and spaCy to extract and validate structured information from 50+ weekly operational reports.",
      "Modernized legacy internal systems into containerized cloud-ready services with Docker and CI/CD, improving deployment reliability through automated testing.",
      "Led data governance initiatives across the team.",
    ],
  },
]

export const education = [
  {
    degree: "Bachelor of Mathematics — Financial Analysis and Risk Management, Co-op",
    institution: "University of Waterloo",
    period: "Expected April 2029",
    location: "Waterloo, ON",
  },
]

export const recognition = [
  { title: "1st place — I4 Hackathon", org: "Waterloo", year: "2026" },
  { title: "4th place — Geesehacks", org: "Waterloo", year: "2025" },
  { title: "Member", org: "Waterloo Blockchain", year: "" },
]

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
  {
    slug: "delay-contagion",
    name: "Flight Delay Contagion",
    blurb: "Ranks flights by how much lateness they propagate downstream, not by how late they are.",
    detail:
      "XGBoost delay model with epidemic network modelling and a MILP gate optimizer, visualised as a D3 contagion graph. Ships with the out-of-sample validation showing where the model stops generalizing.",
    tech: ["XGBoost", "MILP", "D3.js", "Python"],
    repo: "https://github.com/utosrad/delay-contagion",
    year: "2026",
    featured: true,
    award: "1st place · I4 Hackathon Waterloo 2026",
  },
  {
    slug: "eve",
    name: "Project EVE",
    blurb: "Multimodal conversational AI that lip-reads silent video and speaks back.",
    detail:
      "End-to-end system pairing AV-HuBERT lip-reading with Tacotron 2 and HiFi-GAN speech synthesis, plus GPT-4 dialogue using dynamic memory buffers and semantic retrieval for context-aware conversation.",
    tech: ["AV-HuBERT", "Tacotron 2", "HiFi-GAN", "PyTorch", "GPT-4"],
    year: "2025",
    featured: true,
  },
  {
    slug: "claude-app-flow",
    name: "Claude App Flow",
    blurb: "iOS simulator QA tooling as an MCP server, so an agent can drive and verify an app.",
    detail:
      "Tap, swipe, type, screenshot and read the accessibility tree, backed by Facebook idb — no human in the loop.",
    tech: ["MCP", "JavaScript", "Facebook idb", "iOS Simulator"],
    repo: "https://github.com/utosrad/claude-app-flow",
    year: "2026",
    featured: true,
  },
  {
    slug: "ufc",
    name: "UFC Fight Outcome Model",
    blurb: "Ensemble classifiers trained on 5,000+ fights, behind a live prediction dashboard.",
    detail:
      "Random Forest, XGBoost and neural nets with cross-validation and ROC-AUC evaluation under class imbalance. 66% accuracy on title fights, tested through mid-2025. Deployed behind a Flask API with a real-time analytics dashboard.",
    tech: ["scikit-learn", "XGBoost", "Flask", "Pandas"],
    repo: "https://github.com/utosrad/UFC_Prediction_Model",
    year: "2025",
    featured: true,
  },
  {
    slug: "job-bot",
    name: "Job Application Pipeline",
    blurb: "Automates ATS submissions end to end — resume generation, form filling, tracking.",
    detail:
      "Pulls listings, tailors a resume per posting via API, fills Greenhouse, Lever and Ashby forms with Playwright, and tracks everything through Google Sheets and Telegram.",
    tech: ["Bun", "TypeScript", "Playwright", "Postgres", "Railway"],
    repo: "https://github.com/utosrad/job-bot",
    year: "2026",
  },
  {
    slug: "weather-edge",
    name: "Weather Edge",
    blurb: "Fair-value pricing and fractional Kelly sizing for Polymarket temperature markets.",
    detail:
      "Sigma is calibrated against realised forecast error rather than assumed, so the edge estimate degrades honestly when the forecast is bad.",
    tech: ["Python", "NumPy", "Polymarket API", "Kelly criterion"],
    repo: "https://github.com/utosrad/weather-edge",
    year: "2026",
  },
  {
    slug: "wallet",
    name: "Parametric Print Wallet",
    blurb: "Blender/bpy script that generates a custom TPU phone and transit card wallet.",
    detail: "Fully parametric — change the phone dimensions and the printable geometry regenerates.",
    tech: ["Blender", "bpy", "Python", "3D printing"],
    year: "2026",
  },
  {
    slug: "chopshop",
    name: "ChopShop",
    blurb: "Splits 3D models too big for the print bed into printable chunks with dovetail joints.",
    detail:
      "Computes cut planes, generates interlocking dovetails so pieces snap together, and estimates print time and filament per chunk.",
    tech: ["FastAPI", "trimesh", "React", "Three.js"],
    repo: "https://github.com/utosrad/chopshop",
    year: "2026",
  },
  {
    slug: "sentiment-bot",
    name: "Market Intelligence Bot",
    blurb: "Scans Reddit, X, RedFlagDeals and news for Canadian fintech signals, then mails a digest.",
    tech: ["Python", "LLM pipeline", "Telegram API", "Railway"],
    repo: "https://github.com/utosrad/teams-sentiment-bot",
    year: "2026",
  },
  {
    slug: "esg",
    name: "ESG Investment Screener",
    blurb: "Screens 315 S&P 500 companies by ESG risk, sector and market cap.",
    tech: ["Python", "Streamlit", "Pandas"],
    repo: "https://github.com/utosrad/ESG-Investment-Screener",
    live: "https://esg-investment-screener.streamlit.app/",
    year: "2025",
  },
  {
    slug: "churn",
    name: "Churn Predictor",
    blurb: "Keras MLP on Telco churn — 77.9% test accuracy, 47.3% recall on the churn class.",
    detail: "The class imbalance problem is written up honestly rather than hidden behind the accuracy number.",
    tech: ["TensorFlow", "Keras", "scikit-learn"],
    repo: "https://github.com/utosrad/Churn-Predictor",
    year: "2025",
  },
]

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "Ruby", "Swift", "SQL"] },
  {
    group: "Backend & Data",
    items: ["Ruby on Rails", "FastAPI", "Flask", "Node.js", "Postgres", "MySQL", "BigQuery", "gRPC", "WebSockets", "REST APIs"],
  },
  {
    group: "Frontend, Mobile & Infra",
    items: ["Swift", "UIKit", "SwiftUI", "React", "Next.js", "Tailwind", "Docker", "CI/CD", "Railway", "Git", "Linux"],
  },
  {
    group: "ML & Data",
    items: ["PyTorch", "TensorFlow", "scikit-learn", "XGBoost", "spaCy", "NumPy", "Pandas", "LLM tooling", "MCP"],
  },
]

// ─── SYNC:END ────────────────────────────────────────────────────────────────
// Below is hand-written and never touched by the sync script.

export const languages = [
  { name: "English", level: "Native" },
  { name: "Gujarati", level: "Native" },
  { name: "French", level: "Full working proficiency · Ontario French Diploma" },
]

export const interests = [
  "Toronto Maple Leafs & Blue Jays",
  "Formula 1",
  "UFC",
  "Pick-up basketball",
  "Stargazing & telescopes",
  "Fantasy sports analytics",
]
