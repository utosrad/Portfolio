"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { profile, experience } from "../data/profile"

/** "UMAR DARSOT" split per glyph so each can be animated and sounded. */
const GLYPHS: { ch: string; art: string[] }[] = [
  { ch: "U", art: ["██╗░░░██╗", "██║░░░██║", "██║░░░██║", "██║░░░██║", "╚██████╔╝", "░╚═════╝░"] },
  { ch: "M", art: ["███╗░░░███╗", "████╗░████║", "██╔████╔██║", "██║╚██╔╝██║", "██║░╚═╝░██║", "╚═╝░░░░░╚═╝"] },
  { ch: "A", art: ["░█████╗░", "██╔══██╗", "███████║", "██╔══██║", "██║░░██║", "╚═╝░░╚═╝"] },
  { ch: "R", art: ["██████╗░", "██╔══██╗", "██████╔╝", "██╔══██╗", "██║░░██║", "╚═╝░░╚═╝"] },
  { ch: " ", art: ["░░░", "░░░", "░░░", "░░░", "░░░", "░░░"] },
  { ch: "D", art: ["██████╗░", "██╔══██╗", "██║░░██║", "██║░░██║", "██████╔╝", "╚═════╝░"] },
  { ch: "A", art: ["░█████╗░", "██╔══██╗", "███████║", "██╔══██║", "██║░░██║", "╚═╝░░╚═╝"] },
  { ch: "R", art: ["██████╗░", "██╔══██╗", "██████╔╝", "██╔══██╗", "██║░░██║", "╚═╝░░╚═╝"] },
  { ch: "S", art: ["░██████╗", "██╔════╝", "╚█████╗░", "░╚═══██╗", "██████╔╝", "╚═════╝░"] },
  { ch: "O", art: ["░█████╗░", "██╔══██╗", "██║░░██║", "██║░░██║", "╚█████╔╝", "░╚════╝░"] },
  { ch: "T", art: ["████████╗", "╚══██╔══╝", "░░░██║░░░", "░░░██║░░░", "░░░██║░░░", "░░░╚═╝░░░"] },
]

// C major pentatonic — any hover order sounds intentional rather than random.
const SCALE = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0, 987.77]

export default function Landing({ onEnter }: { onEnter: () => void }) {
  const [revealed, setRevealed] = useState(0)
  const [done, setDone] = useState(false)
  const [muted, setMuted] = useState(true)
  const ctxRef = useRef<AudioContext | null>(null)

  // Reveal the name one glyph at a time, then show the call to action.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      setRevealed(GLYPHS.length)
      setDone(true)
      return
    }
    let i = 0
    const id = setInterval(() => {
      i += 1
      setRevealed(i)
      if (i >= GLYPHS.length) {
        clearInterval(id)
        setDone(true)
      }
    }, 90)
    return () => clearInterval(id)
  }, [])

  // Enter / Space / click all get you in. No forced waiting.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        onEnter()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onEnter])

  const note = useCallback(
    (i: number) => {
      if (muted) return
      try {
        if (!ctxRef.current) {
          ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        }
        const ctx = ctxRef.current
        if (ctx.state === "suspended") void ctx.resume()

        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = "triangle"
        osc.frequency.setValueAtTime(SCALE[i % SCALE.length], ctx.currentTime)
        gain.gain.setValueAtTime(0.0001, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.01)
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 0.45)
      } catch {
        /* audio is a nicety; never let it break the page */
      }
    },
    [muted],
  )

  return (
    <div
      className="relative h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden px-4 crt"
      style={{ background: "var(--bg)" }}
    >
      {/* Name */}
      <div className="w-full max-w-5xl overflow-x-auto no-scrollbar">
        <div className="flex justify-center gap-[2px] sm:gap-1 min-w-min mx-auto font-mono">
          {GLYPHS.slice(0, revealed).map((g, i) => (
            <div
              key={i}
              onMouseEnter={() => note(i)}
              onTouchStart={() => note(i)}
              className={`animate-fade-up cursor-default transition-transform duration-200 hover:-translate-y-1.5 ${
                done ? "sweep" : ""
              }`}
              style={{ color: done ? undefined : "var(--accent)", animationDelay: `${i * 20}ms` }}
            >
              {g.art.map((line, j) => (
                <div key={j} className="text-[7px] sm:text-[10px] md:text-xs leading-[1.05] whitespace-pre">
                  {line}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Subtitle */}
      <div className="mt-7 text-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
        <p className="font-mono text-sm sm:text-base" style={{ color: "var(--fg)" }}>
          {profile.title} · {experience[0].company}
        </p>
        <p className="font-mono text-xs sm:text-sm mt-1.5" style={{ color: "var(--fg-dim)" }}>
          {profile.tagline}
        </p>
      </div>

      {/* Entry */}
      <div
        className={`mt-10 flex flex-col items-center gap-3 transition-opacity duration-500 ${
          done ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={onEnter}
          className="font-mono text-sm px-6 py-3 rounded-lg border transition hover:opacity-80 min-h-[44px]"
          style={{
            borderColor: "var(--accent)",
            color: "var(--accent)",
            background: "var(--accent-soft)",
            boxShadow: "var(--glow)",
          }}
        >
          <span className="cursor-blink">█</span> Enter terminal
        </button>
        <p className="font-mono text-[11px]" style={{ color: "var(--fg-dim)" }}>
          or press <kbd className="px-1 rounded border" style={{ borderColor: "var(--border)" }}>Enter</kbd>
        </p>
      </div>

      {/* Sound toggle — off by default so nothing plays unasked */}
      <button
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "Enable hover sounds" : "Mute hover sounds"}
        title={muted ? "Sound off — click to play notes on hover" : "Sound on"}
        className="absolute bottom-5 right-5 font-mono text-xs px-2.5 py-1.5 rounded-md border transition hover:opacity-75 z-40"
        style={{ borderColor: "var(--border)", color: "var(--fg-dim)" }}
      >
        {muted ? "♪ off" : "♪ on"}
      </button>
    </div>
  )
}
