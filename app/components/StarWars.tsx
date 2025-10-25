"use client"

import { useState, useEffect } from "react"

interface StarWarsProps {
  onClose: () => void
}

export default function StarWars({ onClose }: StarWarsProps) {
  const [currentLine, setCurrentLine] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const starWarsText = [
    "A long time ago in a galaxy far,",
    "far away...",
    "",
    "",
    "STAR WARS",
    "",
    "Episode IV",
    "A NEW HOPE",
    "",
    "It is a period of civil war.",
    "Rebel spaceships, striking",
    "from a hidden base, have won",
    "their first victory against",
    "the evil Galactic Empire.",
    "",
    "During the battle, Rebel",
    "spies managed to steal secret",
    "plans to the Empire's",
    "ultimate weapon, the DEATH",
    "STAR, an armored space",
    "station with enough power to",
    "destroy an entire planet.",
    "",
    "Pursued by the Empire's",
    "sinister agents, Princess",
    "Leia races home aboard her",
    "starship, custodian of the",
    "stolen plans that can save",
    "her people and restore",
    "freedom to the galaxy....",
    "",
    "",
    "Press any key to continue..."
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine(prev => {
        if (prev < starWarsText.length - 1) {
          return prev + 1
        } else {
          clearInterval(interval)
          return prev
        }
      })
    }, 800) // Each line appears every 800ms

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleKeyPress = () => {
      setIsVisible(false)
      setTimeout(() => onClose(), 500)
    }

    window.addEventListener("keydown", handleKeyPress)
    window.addEventListener("click", handleKeyPress)
    
    return () => {
      window.removeEventListener("keydown", handleKeyPress)
      window.removeEventListener("click", handleKeyPress)
    }
  }, [onClose])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black text-yellow-400 font-mono flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Star Wars text */}
      <div className="relative z-10 text-center max-w-2xl px-8">
        {starWarsText.slice(0, currentLine + 1).map((line, index) => (
          <div
            key={index}
            className={`mb-2 text-lg leading-relaxed ${
              index === 4 ? 'text-6xl font-bold mb-8' : // STAR WARS title
              index === 6 ? 'text-3xl font-bold mb-4' : // Episode IV
              index === 7 ? 'text-2xl font-bold mb-8' : // A NEW HOPE
              index === 0 || index === 1 ? 'text-2xl mb-4' : // Opening lines
              'text-lg'
            }`}
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Instructions */}
      {currentLine >= starWarsText.length - 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-yellow-300 text-sm animate-pulse">
          Press any key or click to return to terminal
        </div>
      )}
    </div>
  )
}
