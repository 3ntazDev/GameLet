"use client"

import { motion } from "framer-motion"

export default function LetterGrid({ letters, onLetterClick, selectedLetter, isAdmin }) {
  // Create a hexagonal grid layout
  // We'll organize the letters in a honeycomb pattern

  // Define the structure of our hexagonal grid
  // This represents the pattern shown in the image
  const gridStructure = [
    { type: "red", count: 2, letters: false },
    { type: "green", count: 5, letters: false },
    { type: "mixed", count: 7, pattern: ["red", "letter", "letter", "letter", "letter", "letter", "red"] },
    { type: "mixed", count: 7, pattern: ["red", "letter", "letter", "letter", "letter", "letter", "red"] },
    { type: "mixed", count: 7, pattern: ["red", "letter", "letter", "letter", "letter", "letter", "red"] },
    { type: "mixed", count: 7, pattern: ["red", "letter", "letter", "letter", "letter", "letter", "red"] },
    { type: "mixed", count: 7, pattern: ["red", "letter", "letter", "letter", "letter", "letter", "red"] },
    { type: "green", count: 5, letters: false },
  ]

  // Create a subset of letters to use in our grid
  const lettersToUse = letters.slice(0, 25)
  let letterIndex = 0

  return (
    <div className="flex flex-col items-center justify-center max-w-2xl mx-auto">
      {gridStructure.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`flex ${rowIndex % 2 === 1 ? "mr-4" : ""} justify-center`}
          style={{ marginTop: rowIndex > 0 ? "-10px" : "0" }}
        >
          {row.type === "red" &&
            Array(row.count)
              .fill(0)
              .map((_, i) => <Hexagon key={i} color="red" />)}

          {row.type === "green" &&
            Array(row.count)
              .fill(0)
              .map((_, i) => <Hexagon key={i} color="green" />)}

          {row.type === "mixed" &&
            row.pattern.map((cellType, cellIndex) => {
              if (cellType === "red") {
                return <Hexagon key={cellIndex} color="red" />
              }
              if (cellType === "green") {
                return <Hexagon key={cellIndex} color="green" />
              }

              // For letter cells
              const currentLetter = lettersToUse[letterIndex]
              letterIndex++

              return (
                <Hexagon
                  key={cellIndex}
                  color={currentLetter?.color || "none"}
                  letter={currentLetter?.letter}
                  isSelected={selectedLetter === currentLetter?.letter}
                  onClick={() => isAdmin && onLetterClick && onLetterClick(currentLetter?.letter)}
                  isAdmin={isAdmin}
                />
              )
            })}
        </div>
      ))}
    </div>
  )
}

// Hexagon component for individual cells
function Hexagon({ color, letter, isSelected, onClick, isAdmin }) {
  const bgColor =
    color === "red"
      ? "bg-gradient-to-br from-red-600 to-red-800"
      : color === "green"
        ? "bg-gradient-to-br from-green-700 to-green-900"
        : color === "blue"
          ? "bg-gradient-to-br from-blue-500 to-blue-700"
          : "bg-gradient-to-br from-yellow-50 to-amber-100 text-black"

  const hexagonStyle = {
    width: "50px",
    height: "58px",
    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
    margin: "0 -5px",
  }

  return (
    <motion.button
      style={hexagonStyle}
      whileHover={isAdmin && letter ? { scale: 1.05 } : {}}
      whileTap={isAdmin && letter ? { scale: 0.95 } : {}}
      className={`
        ${bgColor}
        flex items-center justify-center font-bold text-xl
        transition-all duration-300
        ${isSelected ? "ring-2 ring-yellow-400 ring-offset-2 ring-offset-purple-900" : ""}
      `}
      onClick={onClick}
      disabled={!isAdmin || !letter}
    >
      {letter}
    </motion.button>
  )
}

