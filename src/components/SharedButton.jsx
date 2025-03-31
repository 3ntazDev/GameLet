"use client"

import { useState } from "react"
import { Clock, Zap } from "lucide-react"
import { Sparkles } from "lucide-react"

export default function SharedButton({ disabled, timer, onClick }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  return (
    <div className="flex flex-col items-center">
      <button
        className={`
          group w-64 h-16 text-xl font-bold rounded-full shadow-lg
          transition-all duration-300 transform rtl-text
          ${
            disabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-xl"
          }
          ${isHovered && !disabled ? "scale-105" : ""}
          ${isPressed && !disabled ? "scale-95" : ""}
          overflow-hidden relative
        `}
        disabled={disabled}
        onClick={() => {
          setIsPressed(true)
          onClick()
          setTimeout(() => setIsPressed(false), 200)
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          setIsPressed(false)
        }}
      >
        {!disabled && (
          <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
        )}

        {disabled ? (
          <div className="flex items-center justify-center gap-2">
            <Clock className="animate-pulse" size={20} />
            <span className="animate-pulse">{timer}</span>
            <span>ثوان متبقية...</span>
          </div>
        ) : (
          <div className="relative flex items-center justify-center gap-2">
            <Zap size={20} className="transition-transform group-hover:rotate-12" />
            <span className="relative z-10">اضغط للإجابة!</span>
            {isHovered && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full bg-white opacity-10 rounded-full animate-[ping_1s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
              </div>
            )}
          </div>
        )}
      </button>

      {disabled && (
        <div className="mt-3 text-indigo-500 animate-pulse rtl-text flex items-center gap-2 justify-center">
          <Sparkles size={16} />
          <span>استعد للسؤال التالي!</span>
          <Sparkles size={16} />
        </div>
      )}
    </div>
  )
}




