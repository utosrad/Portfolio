"use client"

import { useEffect, useState } from "react"
import Landing from "./components/Landing"
import Terminal from "./components/Terminal"
import { THEMES, type Theme } from "./lib/terminal"

type View = "landing" | "terminal"

export default function Page() {
  const [view, setView] = useState<View>("landing")
  const [theme, setTheme] = useState<Theme>("phosphor")
  const [ready, setReady] = useState(false)

  // Restore the visitor's theme, and honour ?view=terminal for direct links.
  useEffect(() => {
    // Validate rather than cast: a stale value from a removed theme would set
    // data-theme to something with no matching CSS, and break the cycle button.
    const saved = localStorage.getItem("theme")
    if (saved && (THEMES as readonly string[]).includes(saved)) setTheme(saved as Theme)

    if (new URLSearchParams(window.location.search).get("view") === "terminal") {
      setView("terminal")
    }

    setReady(true)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    if (ready) localStorage.setItem("theme", theme)
  }, [theme, ready])

  if (view === "terminal") {
    return <Terminal onExit={() => setView("landing")} theme={theme} setTheme={setTheme} />
  }

  return <Landing onEnter={() => setView("terminal")} />
}
