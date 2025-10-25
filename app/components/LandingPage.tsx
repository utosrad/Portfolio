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
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)

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

  // Handle hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Initialize audio context
  useEffect(() => {
    if (!isMounted) return
    
    const initAudio = async () => {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
        setAudioContext(ctx)
        console.log('Audio context created:', ctx.state)
        
        // Test if audio works by playing a silent tone
        const testOscillator = ctx.createOscillator()
        const testGain = ctx.createGain()
        testGain.gain.setValueAtTime(0, ctx.currentTime)
        testOscillator.connect(testGain)
        testGain.connect(ctx.destination)
        testOscillator.start()
        testOscillator.stop(ctx.currentTime + 0.1)
        console.log('Audio test completed')
      } catch (error) {
        console.log('Audio not supported:', error)
      }
    }
    
    initAudio()
  }, [isMounted])



  // Show prompt after a delay
  useEffect(() => {
    if (!isMounted) return
    
    const timer = setTimeout(() => {
      setShowPrompt(true)
    }, 4000) // Show prompt after typewriter completes
    return () => clearTimeout(timer)
  }, [isMounted])

  // Play musical note for each letter
  const playNote = async (letterIndex: number) => {
    console.log('🎵 playNote called with index:', letterIndex)
    console.log('🎵 Audio context state:', audioContext?.state)
    console.log('🎵 Musical notes length:', musicalNotes.length)
    
    if (letterIndex >= musicalNotes.length) {
      console.log('❌ Letter index out of range')
      return
    }
    
    if (!audioContext) {
      console.log('❌ No audio context available')
      return
    }
    
    try {
      // Resume audio context if suspended (this handles first user interaction)
      if (audioContext.state === 'suspended') {
        console.log('🔄 Resuming suspended audio context...')
        await audioContext.resume()
        console.log('✅ Audio context resumed, new state:', audioContext.state)
      }
      
      const note = musicalNotes[letterIndex]
      console.log('🎼 Playing note:', note.name, 'at frequency:', note.note)
      
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(note.note, audioContext.currentTime)
      oscillator.type = 'sine'
      
      // Make the note louder for testing
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
      
      console.log('✅ Note played successfully')
    } catch (error) {
      console.log('❌ Audio playback failed:', error)
    }
  }

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


  // Handle Enter key and click anywhere
  useEffect(() => {
    if (!isMounted) return
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setIsVisible(false)
        setTimeout(() => onEnter(), 500) // Small delay for smooth transition
      }
    }

    const handleClick = () => {
      setIsVisible(false)
      setTimeout(() => onEnter(), 500) // Small delay for smooth transition
    }

    window.addEventListener("keydown", handleKeyPress)
    window.addEventListener("click", handleClick)
    
    return () => {
      window.removeEventListener("keydown", handleKeyPress)
      window.removeEventListener("click", handleClick)
    }
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
              <div 
                key={letterIndex} 
                className="text-center hover:transform hover:-translate-y-2 transition-transform duration-200 cursor-pointer"
                onMouseEnter={() => {
                  console.log('🎯 Hovering over letter index:', letterIndex)
                  playNote(letterIndex)
                }}
              >
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
                onMouseEnter={() => {
                  // Play a random note when hovering over the full ASCII art
                  const randomIndex = Math.floor(Math.random() * musicalNotes.length)
                  playNote(randomIndex)
                }}
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
          <span className="animate-pulse text-lg">Press ENTER or click anywhere to access terminal</span>
          <span className="animate-pulse text-green-400 text-xl">█</span>
        </div>
      )}


    </div>
  )
}