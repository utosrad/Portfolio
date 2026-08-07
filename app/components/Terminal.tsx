"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { profile } from "../data/profile"
import {
  complete,
  run,
  welcome,
  type Entry,
  type Line,
  type Theme,
} from "../lib/terminal"

const QUICK = ["about", "now", "experience", "projects", "skills", "resume", "contact"]

/* ------------------------------------------------------------------ */
/* Line rendering                                                      */
/* ------------------------------------------------------------------ */

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = /^https?:/.test(href)
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="underline underline-offset-4 decoration-[var(--border)] hover:decoration-current transition-colors"
      style={{ color: "var(--accent-2)" }}
    >
      {children}
    </a>
  )
}

/** Turns bare URLs inside body copy into real links. */
function linkify(text: string) {
  const parts = text.split(/(https?:\/\/[^\s)]+)/g)
  if (parts.length === 1) return text
  return parts.map((p, i) =>
    /^https?:\/\//.test(p) ? <ExternalLink key={i} href={p}>{p}</ExternalLink> : <span key={i}>{p}</span>,
  )
}

function LineView({ line }: { line: Line }) {
  switch (line.k) {
    case "blank":
      return <div className="h-3" />

    case "rule":
      return <div className="my-3 border-t" style={{ borderColor: "var(--border)" }} />

    case "head":
      return (
        <div
          className="text-[15px] sm:text-base font-semibold tracking-tight mb-1"
          style={{ color: "var(--accent)", textShadow: "var(--glow)" }}
        >
          {line.t}
        </div>
      )

    case "sub":
      return (
        <div className="font-semibold mt-1" style={{ color: "var(--fg)" }}>
          {line.t}
        </div>
      )

    case "text":
      return <div style={{ color: "var(--fg)" }}>{linkify(line.t)}</div>

    case "dim":
      return <div style={{ color: "var(--fg-dim)" }}>{linkify(line.t)}</div>

    case "quote":
      return (
        <div
          className="italic pl-3 border-l-2 my-1"
          style={{ color: "var(--warn)", borderColor: "var(--accent-soft)" }}
        >
          {line.t}
        </div>
      )

    case "bullet":
      return (
        <div className="flex gap-2.5">
          <span aria-hidden style={{ color: "var(--accent)" }} className="select-none shrink-0">
            ›
          </span>
          <span style={{ color: "var(--fg)" }}>{linkify(line.t)}</span>
        </div>
      )

    case "kv":
      return (
        <div className="flex flex-col sm:flex-row sm:gap-3">
          <span
            className="shrink-0 sm:w-40 font-medium"
            style={{ color: "var(--accent)" }}
          >
            {line.key}
          </span>
          <span style={{ color: "var(--fg-dim)" }}>{line.val}</span>
        </div>
      )

    case "link":
      return (
        <div className="flex gap-2 items-baseline flex-wrap">
          <span aria-hidden style={{ color: "var(--fg-dim)" }} className="select-none">
            ↗
          </span>
          <ExternalLink href={line.href}>{line.label}</ExternalLink>
          {line.note && (
            <span className="text-xs" style={{ color: "var(--fg-dim)" }}>
              {line.note}
            </span>
          )}
        </div>
      )

    case "tags":
      return (
        <div className="flex flex-wrap gap-1.5 my-1">
          {line.items.map((it) => (
            <span
              key={it}
              className="text-[11px] leading-none px-2 py-1 rounded-full border"
              style={{
                color: "var(--fg-dim)",
                borderColor: "var(--border)",
                background: "var(--bg-raise)",
              }}
            >
              {it}
            </span>
          ))}
        </div>
      )

    case "ok":
      return <div style={{ color: "var(--accent)" }}>{line.t}</div>

    case "err":
      return <div style={{ color: "var(--err)" }}>{line.t}</div>
  }
}

/* ------------------------------------------------------------------ */
/* Terminal                                                            */
/* ------------------------------------------------------------------ */

export default function Terminal({
  onExit,
  onGui,
  theme,
  setTheme,
}: {
  onExit: () => void
  onGui: () => void
  theme: Theme
  setTheme: (t: Theme) => void
}) {
  const [entries, setEntries] = useState<Entry[]>([{ input: null, lines: welcome() }])
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const [candidates, setCandidates] = useState<string[]>([])
  const [maximized, setMaximized] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const prompt = `${profile.handle}@darsot.ca:~$`

  // Ghost text: the part of the completion the user hasn't typed yet.
  const ghost = useMemo(() => {
    if (!input.trim() || input.endsWith(" ")) return ""
    const { completion } = complete(input)
    return completion.startsWith(input) ? completion.slice(input.length) : ""
  }, [input])

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ block: "end" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [entries, scrollToBottom])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const submit = useCallback(
    (raw: string) => {
      const cmd = raw.trim()
      setCandidates([])

      if (cmd) setHistory((h) => [...h, cmd])
      setHistIdx(-1)
      setInput("")

      // `history` needs the component's own state, so it's resolved here.
      if (cmd.toLowerCase() === "history") {
        setEntries((e) => [
          ...e,
          {
            input: cmd,
            lines: history.length
              ? history.map((h, i) => ({ k: "kv" as const, key: String(i + 1), val: h }))
              : [{ k: "dim" as const, t: "No history yet." }],
          },
        ])
        return
      }

      const res = run(cmd)

      if (res.clear) {
        setEntries([])
        return
      }
      if (res.view === "landing") return onExit()
      if (res.view === "doc") return onGui()
      if (res.theme) setTheme(res.theme as Theme)
      if (res.openUrl) window.open(res.openUrl, "_blank", "noopener,noreferrer")

      setEntries((e) => [...e, { input: cmd, lines: res.lines ?? [] }])
    },
    [history, onExit, onGui, setTheme],
  )

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Tab / → accept completion
    if (e.key === "Tab") {
      e.preventDefault()
      const { completion, candidates: cands } = complete(input)
      if (completion !== input) {
        setInput(completion)
        setCandidates([])
      } else if (cands.length > 1) {
        setCandidates(cands)
      }
      return
    }

    if (e.key === "ArrowRight" && ghost && inputRef.current?.selectionStart === input.length) {
      e.preventDefault()
      setInput(input + ghost)
      return
    }

    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (!history.length) return
      const next = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1)
      setHistIdx(next)
      setInput(history[next])
      return
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (histIdx < 0) return
      const next = histIdx + 1
      if (next >= history.length) {
        setHistIdx(-1)
        setInput("")
      } else {
        setHistIdx(next)
        setInput(history[next])
      }
      return
    }

    if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault()
      setEntries([])
      return
    }

    if (e.ctrlKey && e.key.toLowerCase() === "c") {
      e.preventDefault()
      setEntries((en) => [...en, { input: input + "^C", lines: [] }])
      setInput("")
      return
    }

    if (e.key === "Escape") {
      setCandidates([])
      setInput("")
    }
  }

  return (
    <div
      className="h-[100dvh] w-full flex flex-col p-0 sm:p-4 md:p-6"
      style={{ background: "var(--bg)" }}
    >
      <div
        className={`relative flex flex-col flex-1 min-h-0 overflow-hidden sm:rounded-xl border transition-[max-width,margin] duration-300 crt ${
          maximized ? "max-w-none" : "max-w-5xl"
        } w-full mx-auto`}
        style={{
          borderColor: "var(--border)",
          background: "var(--bg)",
          boxShadow: "0 24px 70px -20px #000000a0",
        }}
      >
        {/* Window chrome — the buttons actually do things */}
        <div
          className="flex items-center gap-3 px-4 h-11 shrink-0 border-b select-none"
          style={{ background: "var(--chrome)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={onExit}
              aria-label="Back to landing page"
              title="Back to landing"
              className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-125 transition"
            />
            <button
              onClick={onGui}
              aria-label="Switch to readable page view"
              title="Readable view"
              className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-125 transition"
            />
            <button
              onClick={() => setMaximized((m) => !m)}
              aria-label="Toggle wide layout"
              title="Toggle width"
              className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-125 transition"
            />
          </div>

          <div
            className="flex-1 text-center text-xs truncate"
            style={{ color: "var(--fg-dim)" }}
          >
            {profile.handle}@darsot.ca — {entries.length} {entries.length === 1 ? "entry" : "entries"}
          </div>

          <button
            onClick={onGui}
            className="text-xs px-2 py-1 rounded border hover:opacity-80 transition"
            style={{ color: "var(--fg-dim)", borderColor: "var(--border)" }}
          >
            Readable view
          </button>
        </div>

        {/* Scrollback */}
        <div
          ref={scrollRef}
          onClick={(e) => {
            // Don't steal focus when the user is selecting text or clicking a link
            if (window.getSelection()?.toString()) return
            if ((e.target as HTMLElement).closest("a,button")) return
            inputRef.current?.focus()
          }}
          className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4 font-mono text-[13px] sm:text-sm leading-relaxed cursor-text"
        >
          {entries.map((entry, i) => (
            <div key={i} className="mb-3 animate-fade-up">
              {entry.input !== null && (
                <div className="flex gap-2 flex-wrap mb-1">
                  <span style={{ color: "var(--accent)" }} className="select-none shrink-0">
                    {prompt}
                  </span>
                  <span style={{ color: "var(--fg)" }}>{entry.input}</span>
                </div>
              )}
              {entry.lines.map((line, j) => (
                <LineView key={j} line={line} />
              ))}
            </div>
          ))}

          {candidates.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {candidates.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setInput(c)
                    setCandidates([])
                    inputRef.current?.focus()
                  }}
                  className="text-xs px-2 py-1 rounded border hover:opacity-80 transition"
                  style={{ borderColor: "var(--border)", color: "var(--fg-dim)" }}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* Prompt */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              submit(input)
            }}
            className="flex gap-2 items-baseline"
          >
            <label htmlFor="term-input" className="sr-only">
              Terminal command
            </label>
            <span style={{ color: "var(--accent)" }} className="select-none shrink-0">
              {prompt}
            </span>

            <div className="relative flex-1 min-w-0">
              {/* Ghost completion sits underneath the real input, same metrics */}
              <div
                aria-hidden
                className="absolute inset-0 whitespace-pre pointer-events-none overflow-hidden"
              >
                <span className="invisible">{input}</span>
                <span style={{ color: "var(--fg-dim)" }}>{ghost}</span>
              </div>
              <input
                id="term-input"
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  setCandidates([])
                }}
                onKeyDown={onKeyDown}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                enterKeyHint="go"
                className="relative w-full bg-transparent outline-none border-none p-0 m-0"
                style={{ color: "var(--fg)", caretColor: "var(--accent)" }}
              />
            </div>
          </form>

          <div ref={bottomRef} />
        </div>

        {/* Quick commands */}
        <div
          className="shrink-0 border-t px-3 sm:px-5 py-2.5 flex gap-2 overflow-x-auto"
          style={{ background: "var(--chrome)", borderColor: "var(--border)" }}
        >
          {QUICK.map((c) => (
            <button
              key={c}
              onClick={() => {
                submit(c)
                inputRef.current?.focus()
              }}
              className="text-xs px-2.5 py-1 rounded-md border whitespace-nowrap hover:opacity-75 transition"
              style={{
                borderColor: "var(--border)",
                color: "var(--fg-dim)",
                background: "var(--bg-raise)",
              }}
            >
              {c}
            </button>
          ))}
          <span className="flex-1" />
          <button
            onClick={() => {
              const order = ["phosphor", "amber", "ice", "paper"] as Theme[]
              setTheme(order[(order.indexOf(theme) + 1) % order.length])
            }}
            title="Cycle theme"
            className="text-xs px-2.5 py-1 rounded-md border whitespace-nowrap hover:opacity-75 transition"
            style={{ borderColor: "var(--border)", color: "var(--fg-dim)" }}
          >
            ◐ {theme}
          </button>
        </div>
      </div>
    </div>
  )
}
