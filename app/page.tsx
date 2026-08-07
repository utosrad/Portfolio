"use client"

import { useEffect, useState } from "react"
import Landing from "./components/Landing"
import Terminal from "./components/Terminal"
import DocView from "./components/DocView"
import type { Theme } from "./lib/terminal"

type View = "landing" | "terminal" | "doc"

export default function Page() {
  const [view, setView] = useState<View>("landing")
  const [theme, setTheme] = useState<Theme>("phosphor")
  const [ready, setReady] = useState(false)

  // Restore the visitor's theme, and honour ?view= for direct links.
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null
    if (saved) setTheme(saved)

    const param = new URLSearchParams(window.location.search).get("view")
    if (param === "doc" || param === "gui") setView("doc")
    else if (param === "terminal") setView("terminal")

    setReady(true)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    if (ready) localStorage.setItem("theme", theme)
  }, [theme, ready])

  // Keep the URL shareable as the visitor moves between views.
  useEffect(() => {
    if (!ready) return
    const url = new URL(window.location.href)
    if (view === "doc") url.searchParams.set("view", "doc")
    else url.searchParams.delete("view")
    window.history.replaceState(null, "", url)
  }, [view, ready])

  if (view === "doc") {
    return <DocView onTerminal={() => setView("terminal")} theme={theme} setTheme={setTheme} />
  }

  if (view === "terminal") {
    return (
      <Terminal
        onExit={() => setView("landing")}
        onGui={() => setView("doc")}
        theme={theme}
        setTheme={setTheme}
      />
    )
  }

  return <Landing onEnter={() => setView("terminal")} />
}
