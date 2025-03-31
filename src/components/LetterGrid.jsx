"use client"

import { useState, useEffect } from "react"
import { Sparkles } from "lucide-react"

export default function LetterGrid({ letters, onLetterClick, selectedLetter, isAdmin }) {
  const [animatedLetters, setAnimatedLetters] = useState([])

  useEffect(() => {
    // Animate letters appearing one by one
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimatedLetters((prev) => {
          if (prev.length >= letters.length) {
            clearInterval(interval)
            return prev
          }
          return [...prev, prev.length]
        })
      }, 50)

      return () => clearInterval(interval)
    }, 300)

    return () => clearTimeout(timer)
  }, [letters.length])

  // Create a grid layout for the letters
  const rows = []
  const lettersPerRow = 7

  for (let i = 0; i < letters.length; i += lettersPerRow) {
    rows.push(letters.slice(i, i + lettersPerRow))
  }

  return (
    <div className="grid gap-3 rtl-text">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-wrap gap-3 justify-center">
          {row.map((item, colIndex) => {
            const index = rowIndex * lettersPerRow + colIndex
            const isAnimated = animatedLetters.includes(index)

            return (
              <button
                key={item.letter}
                className={`
                  relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-xl sm:text-2xl font-bold rounded-lg
                  transition-all duration-300 shadow-md
                  ${item.color === "red" ? "bg-gradient-to-br from-red-500 to-rose-600 text-white hover:shadow-rose-200/50" : ""}
                  ${item.color === "blue" ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:shadow-blue-200/50" : ""}
                  ${item.color === "none" ? "bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-800 hover:from-indigo-200 hover:to-purple-200" : ""}
                  ${selectedLetter === item.letter ? "ring-4 ring-purple-400 animate-[pulse_1.5s_infinite]" : ""}
                  ${isAdmin ? "hover:shadow-lg cursor-pointer transform hover:scale-110 active:scale-95" : "cursor-default"}
                  ${isAnimated ? "opacity-100 scale-100" : "opacity-0 scale-50"}
                `}
                style={{ transitionDelay: `${index * 50}ms` }}
                onClick={() => isAdmin && onLetterClick && onLetterClick(item.letter)}
                disabled={!isAdmin}
              >
                {item.letter}
                {selectedLetter === item.letter && (
                  <div className="absolute -top-1 -right-1 text-yellow-400">
                    <Sparkles size={14} />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

