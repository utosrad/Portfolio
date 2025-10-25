"use client"

import { useState, useEffect } from "react"

interface LandingPageProps {
  onEnter: () => void
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [showPrompt, setShowPrompt] = useState(false)

  // ASCII art frames for animation
  const asciiFrames = [
    // Frame 1 - U
    [
      "██╗   ██╗███╗   ███╗ █████╗ ██████╗ ",
      "██║   ██║████╗ ████║██╔══██╗██╔══██╗",
      "██║   ██║██╔████╔██║███████║██████╔╝",
      "██║   ██║██║╚██╔╝██║██╔══██║██╔══██╗",
      "╚██████╔╝██║ ╚═╝ ██║██║  ██║██║  ██║",
      " ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝"
    ],
    // Frame 2 - D
    [
      "██████╗  █████╗ ██████╗ ███████╗ ██████╗ ███████╗",
      "██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔═══██╗██╔════╝",
      "██║  ██║███████║██║  ██║███████╗██║   ██║███████╗",
      "██║  ██║██╔══██║██║  ██║╚════██║██║   ██║╚════██║",
      "██████╔╝██║  ██║██████╔╝███████║╚██████╔╝███████║",
      "╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝ ╚══════╝"
    ],
    // Frame 3 - A
    [
      " █████╗ ██████╗ ██████╗ ███████╗██████╗ ███████╗",
      "██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔════╝",
      "███████║██████╔╝██║  ██║███████╗██║  ██║███████╗",
      "██╔══██║██╔══██╗██║  ██║╚════██║██║  ██║╚════██║",
      "██║  ██║██║  ██║██████╔╝███████║██████╔╝███████║",
      "╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚═════╝ ╚══════╝"
    ]
  ]

  // Show prompt after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPrompt(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  // Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % asciiFrames.length)
    }, 2000) // Change frame every 2 seconds

    return () => clearInterval(interval)
  }, [])

  // Handle Enter key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setIsVisible(false)
        setTimeout(() => onEnter(), 500) // Small delay for smooth transition
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [onEnter])

  if (!isVisible) return null

  return (
    <div className="h-screen bg-black text-green-400 font-mono flex flex-col items-center justify-center overflow-hidden relative">
      {/* Animated ASCII Art */}
      <div className="mb-8 transform transition-all duration-1000">
        {asciiFrames[currentFrame].map((line, index) => (
          <div 
            key={index} 
            className="text-center text-green-400 text-sm leading-tight animate-pulse"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Subtitle */}
      <div className="mb-12 text-center animate-fade-in">
        <div className="text-green-300 text-lg mb-2 animate-bounce-slow">
          Machine Learning Researcher & Data Scientist
        </div>
        <div className="text-green-500 text-sm">
          Interactive Terminal Portfolio
        </div>
      </div>

      {/* Cursor Prompt */}
      {showPrompt && (
        <div className="flex items-center space-x-2 text-green-400 animate-fade-in">
          <span className="animate-pulse text-green-400">█</span>
          <span className="animate-pulse">Press ENTER to access terminal</span>
          <span className="animate-pulse text-green-400">█</span>
        </div>
      )}

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-500 opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Matrix-style rain effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute text-green-500 opacity-20 text-xs animate-matrix-rain"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            {String.fromCharCode(0x30A0 + Math.random() * 96)}
          </div>
        ))}
      </div>
    </div>
  )
}
