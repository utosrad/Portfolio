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
  const [easterEggs, setEasterEggs] = useState<Array<{id: number, x: number, y: number, revealed: boolean, fact: string}>>([])
  const [showFact, setShowFact] = useState<{fact: string, x: number, y: number} | null>(null)

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

  // Musical notes for each letter
  const musicalNotes = [
    { letter: 'U', note: 261.63, name: 'C4' }, // C
    { letter: 'M', note: 293.66, name: 'D4' }, // D
    { letter: 'A', note: 329.63, name: 'E4' }, // E
    { letter: 'R', note: 349.23, name: 'F4' }, // F
    { letter: 'D', note: 392.00, name: 'G4' }, // G
    { letter: 'A', note: 440.00, name: 'A4' }, // A
    { letter: 'R', note: 493.88, name: 'B4' }, // B
    { letter: 'S', note: 523.25, name: 'C5' }, // C5
    { letter: 'O', note: 587.33, name: 'D5' }, // D5
    { letter: 'T', note: 659.25, name: 'E5' }  // E5
  ]

  // Star-themed fun facts
  const starFacts = [
    "⭐ I once stayed up for 48 hours debugging a neural network!",
    "🌟 My favorite programming language is Python, but I'm fluent in JavaScript too!",
    "✨ I believe the best code is written at 3 AM with coffee in hand!",
    "⭐ I've contributed to open-source projects that have over 10,000 stars on GitHub!",
    "🌟 My dream is to build an AI that can write better code than me!",
    "✨ I once fixed a bug that had been causing issues for 6 months in just 10 minutes!",
    "⭐ I'm passionate about making technology accessible to everyone!",
    "🌟 I love solving problems that others think are impossible!",
    "✨ My favorite algorithm is the Fast Fourier Transform - it's pure magic!",
    "⭐ I believe in the power of collaboration and open-source development!"
  ]

  // Handle hydration
  useEffect(() => {
    setIsMounted(true)
    
    // Initialize easter eggs with star positions
    const eggs = starFacts.map((fact, index) => ({
      id: index,
      x: Math.random() * 80 + 10, // 10-90% of screen width
      y: Math.random() * 60 + 20,  // 20-80% of screen height
      revealed: false,
      fact: fact
    }))
    setEasterEggs(eggs)
  }, [])


  // Show prompt after a delay
  useEffect(() => {
    if (!isMounted) return
    
    const timer = setTimeout(() => {
      setShowPrompt(true)
    }, 4000) // Show prompt after typewriter completes
    return () => clearTimeout(timer)
  }, [isMounted])

  // Play musical note for each letter
  const playNote = (letterIndex: number) => {
    if (letterIndex < musicalNotes.length) {
      const note = musicalNotes[letterIndex]
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(note.note, audioContext.currentTime)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    }
  }

  // Typewriter effect with musical notes
  useEffect(() => {
    if (!isMounted) return
    
    const typewriterInterval = setInterval(() => {
      setCurrentLetter((prev) => {
        if (prev < letterAnimations.length - 1) {
          const nextLetter = prev + 1
          // Play musical note for the new letter
          playNote(nextLetter)
          return nextLetter
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

  // Handle easter egg clicks
  const handleEasterEggClick = (eggId: number, x: number, y: number) => {
    const egg = easterEggs.find(e => e.id === eggId)
    if (egg && !egg.revealed) {
      setEasterEggs(prev => prev.map(e => 
        e.id === eggId ? { ...e, revealed: true } : e
      ))
      setShowFact({ fact: egg.fact, x, y })
      
      // Hide fact after 4 seconds
      setTimeout(() => setShowFact(null), 4000)
    }
  }

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

      {/* Star-themed Easter Eggs */}
      {easterEggs.map((egg) => (
        <div
          key={egg.id}
          className="absolute cursor-pointer text-yellow-400 text-2xl animate-pulse hover:scale-150 transition-transform duration-200"
          style={{
            left: `${egg.x}%`,
            top: `${egg.y}%`,
            transform: 'translate(-50%, -50%)',
            opacity: egg.revealed ? 0.3 : 0.8
          }}
          onClick={() => handleEasterEggClick(egg.id, egg.x, egg.y)}
        >
          {egg.revealed ? '✨' : '⭐'}
        </div>
      ))}

      {/* Fun Fact Display */}
      {showFact && (
        <div
          className="absolute bg-black bg-opacity-80 border border-yellow-400 rounded-lg p-4 text-yellow-300 text-sm max-w-xs z-50 animate-fade-in"
          style={{
            left: `${showFact.x}%`,
            top: `${showFact.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {showFact.fact}
        </div>
      )}

    </div>
  )
}