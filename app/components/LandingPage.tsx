"use client"

import { useState, useEffect } from "react"

interface LandingPageProps {
  onEnter: () => void
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  const [currentLetter, setCurrentLetter] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [showPrompt, setShowPrompt] = useState(false)
  const [animationPhase, setAnimationPhase] = useState(0) // 0: typewriter, 1: shine, 2: glow, 3: pulse, 4: wave
  const [isMounted, setIsMounted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorTrail, setCursorTrail] = useState<Array<{x: number, y: number, char: string, id: number}>>([])

  // Complete "Umar Darsot" ASCII art with space
  const fullNameASCII = [
    "██╗░░░██╗███╗░░░███╗░█████╗░██████╗░     ██████╗░░█████╗░██████╗░██████╗░██████╗░███████╗░█████╗░████████╗",
    "██║░░░██║████╗░████║██╔══██╗██╔══██╗     ██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗╚══██╔══╝",
    "██║░░░██║██╔████╔██║███████║██████╔╝     ██║░░██║██║░░██║██║░░██║██║░░██║██║░░██║█████╗░░██║░░╚═╝░░░██║░░░",
    "██║░░░██║██║╚██╔╝██║██╔══██║██╔══██╗     ██║░░██║██║░░██║██║░░██║██║░░██║██║░░██║██╔══╝░░██║░░██╗░░░██║░░░",
    "╚██████╔╝██║░╚═╝░██║██║░░██║██║░░██║     ██████╔╝╚█████╔╝██████╔╝██████╔╝██████╔╝███████╗╚█████╔╝░░░██║░░░",
    "░╚═════╝░╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝░░╚═╝     ╚═════╝░░╚════╝░╚═════╝░╚═════╝░╚═════╝░╚══════╝░╚════╝░░░░╚═╝░░░"
  ]

  // Individual letter animations for typewriter effect
  const letterAnimations = [
    // U
    [
      "██╗░░░██╗",
      "██║░░░██║", 
      "██║░░░██║",
      "██║░░░██║",
      "╚██████╔╝",
      "░╚═════╝░"
    ],
    // M
    [
      "███╗░░░███╗",
      "████╗░████║",
      "██╔████╔██║",
      "██║╚██╔╝██║",
      "██║░╚═╝░██║",
      "╚═╝░░░░░╚═╝"
    ],
    // A
    [
      "░█████╗░",
      "██╔══██╗",
      "███████║",
      "██╔══██║",
      "██║░░██║",
      "╚═╝░░╚═╝"
    ],
    // R
    [
      "██████╗░",
      "██╔══██╗",
      "██████╔╝",
      "██╔══██╗",
      "██║░░██║",
      "╚═╝░░╚═╝"
    ],
    // Space
    [
      "░░░░░░",
      "░░░░░░",
      "░░░░░░",
      "░░░░░░",
      "░░░░░░",
      "░░░░░░"
    ],
    // D
    [
      "██████╗░",
      "██╔══██╗",
      "██║░░██║",
      "██║░░██║",
      "██████╔╝",
      "╚═════╝░"
    ],
    // A
    [
      "░█████╗░",
      "██╔══██╗",
      "███████║",
      "██╔══██║",
      "██║░░██║",
      "╚═╝░░╚═╝"
    ],
    // R
    [
      "██████╗░",
      "██╔══██╗",
      "██████╔╝",
      "██╔══██╗",
      "██║░░██║",
      "╚═╝░░╚═╝"
    ],
    // S
    [
      "░██████╗",
      "██╔════╝",
      "╚█████╗░",
      "░╚═══██╗",
      "██████╔╝",
      "╚═════╝░"
    ],
    // O
    [
      "░█████╗░",
      "██╔══██╗",
      "██║░░██║",
      "██║░░██║",
      "╚█████╔╝",
      "░╚════╝░"
    ],
    // T
    [
      "████████╗",
      "╚══██╔══╝",
      "░░░██║░░░",
      "░░░██║░░░",
      "░░░██║░░░",
      "░░░╚═╝░░░"
    ]
  ]

  // Handle hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Mouse tracking and cursor trail
  useEffect(() => {
    if (!isMounted) return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      
      // Add character to trail
      const chars = ['0', '1', '█', '░', '▓', '▒', '■', '□', '●', '○']
      const randomChar = chars[Math.floor(Math.random() * chars.length)]
      
      setCursorTrail(prev => {
        const newTrail = [...prev, {
          x: e.clientX,
          y: e.clientY,
          char: randomChar,
          id: Date.now() + Math.random()
        }]
        
        // Keep only last 50 characters
        return newTrail.slice(-50)
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMounted])

  // Clean up old trail characters
  useEffect(() => {
    if (!isMounted) return

    const cleanupInterval = setInterval(() => {
      setCursorTrail(prev => prev.filter(item => Date.now() - item.id < 5000))
    }, 100)

    return () => clearInterval(cleanupInterval)
  }, [isMounted])

  // Show prompt after a delay
  useEffect(() => {
    if (!isMounted) return
    
    const timer = setTimeout(() => {
      setShowPrompt(true)
    }, 4000) // Show prompt after typewriter completes
    return () => clearTimeout(timer)
  }, [isMounted])

  // Typewriter effect
  useEffect(() => {
    if (!isMounted) return
    
    const typewriterInterval = setInterval(() => {
      setCurrentLetter((prev) => {
        if (prev < letterAnimations.length - 1) {
          return prev + 1
        } else {
          // Start animation phases after typewriter completes
          setAnimationPhase(1)
          clearInterval(typewriterInterval)
          return prev
        }
      })
    }, 300) // Each letter appears every 300ms

    return () => clearInterval(typewriterInterval)
  }, [isMounted])

  // Animation phase cycling
  useEffect(() => {
    if (!isMounted || animationPhase <= 0) return
    
    const phaseInterval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 5) // Cycle through phases 1-4
    }, 3000) // Change phase every 3 seconds

    return () => clearInterval(phaseInterval)
  }, [animationPhase, isMounted])

  // Handle Enter key
  useEffect(() => {
    if (!isMounted) return
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setIsVisible(false)
        setTimeout(() => onEnter(), 500) // Small delay for smooth transition
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [onEnter, isMounted])

  if (!isVisible) return null
  
  // Show loading state during hydration
  if (!isMounted) {
    return (
      <div className="h-screen bg-black text-green-400 font-mono flex flex-col items-center justify-center overflow-hidden relative">
        <div className="text-center">
          <div className="text-green-400 text-lg mb-4">Loading...</div>
          <div className="animate-pulse">█</div>
        </div>
      </div>
    )
  }

  const getAnimationClass = () => {
    switch (animationPhase) {
      case 1: return "animate-shine"
      case 2: return "animate-glow"
      case 3: return "animate-pulse-slow"
      case 4: return "animate-wave"
      default: return ""
    }
  }

  return (
    <div className="h-screen bg-black text-green-400 font-mono flex flex-col items-center justify-center overflow-hidden relative">
      {/* Animated ASCII Art */}
      <div className="mb-8 transform transition-all duration-1000 relative">
        {currentLetter < letterAnimations.length ? (
          // Typewriter effect - show letters once with hover effects
          <div className="flex justify-center space-x-2">
            {letterAnimations.slice(0, currentLetter + 1).map((letter, letterIndex) => (
              <div key={letterIndex} className="text-center hover:transform hover:-translate-y-2 transition-transform duration-200 cursor-pointer">
                {letter.map((line, lineIndex) => (
                  <div 
                    key={lineIndex} 
                    className="text-green-400 text-xs leading-tight animate-fade-in"
                    style={{ animationDelay: `${lineIndex * 0.05}s` }}
                  >
                    {line}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          // Full name with complex animations and hover effects
          <div className={`text-center ${getAnimationClass()} hover:transform hover:-translate-y-1 transition-transform duration-200 cursor-pointer`}>
            {fullNameASCII.map((line, index) => (
              <div 
                key={index} 
                className="text-green-400 text-xs leading-tight"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {line}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subtitle without animations */}
      <div className="mb-12 text-center">
        <div className="text-green-300 text-lg mb-2">
          Machine Learning Researcher & Data Scientist
        </div>
        <div className="text-green-500 text-sm">
          Interactive Terminal Portfolio
        </div>
      </div>

      {/* Enhanced Cursor Prompt */}
      {showPrompt && (
        <div className="flex items-center space-x-2 text-green-400 animate-fade-in">
          <span className="animate-pulse text-green-400 text-xl">█</span>
          <span className="animate-pulse text-lg">Press ENTER to access terminal</span>
          <span className="animate-pulse text-green-400 text-xl">█</span>
        </div>
      )}

      {/* Enhanced floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-500 opacity-40 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Cursor trail effect */}
      <div className="absolute inset-0 pointer-events-none">
        {cursorTrail.map((item) => (
          <div
            key={item.id}
            className="absolute text-green-400 text-sm font-mono animate-fade-in"
            style={{
              left: item.x,
              top: item.y,
              transform: 'translate(-50%, -50%)',
              opacity: 0.8,
              zIndex: 1000
            }}
          >
            {item.char}
          </div>
        ))}
      </div>

      {/* Holographic grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="w-full h-full bg-gradient-to-br from-transparent via-green-400/5 to-transparent"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Matrix-style rain effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-green-500 opacity-30 text-xs animate-matrix-rain"
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

      {/* Glowing orbs effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-green-400 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

    </div>
  )
}