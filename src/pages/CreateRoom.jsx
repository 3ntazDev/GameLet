"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Loader2, Sparkles, Star, UserPlus, Crown } from "lucide-react"

export default function CreateRoom() {
  const [userName, setUserName] = useState("")
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [bgColor, setBgColor] = useState(0)
  const navigate = useNavigate()

  // Array of gradient backgrounds to cycle through
  const gradients = [
    "from-rose-100 via-violet-100 to-indigo-100",
    "from-amber-100 via-orange-100 to-rose-100",
    "from-teal-100 via-emerald-100 to-cyan-100",
    "from-sky-100 via-indigo-100 to-purple-100",
  ]

  useEffect(() => {
    setMounted(true)

    // Cycle through background colors
    const interval = setInterval(() => {
      setBgColor((prev) => (prev + 1) % gradients.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const createRoom = () => {
    if (!userName.trim()) {
      // Add shake animation to input
      const input = document.getElementById("username-input")
      input.classList.add("animate-[shake_0.5s_ease-in-out]")
      setTimeout(() => input.classList.remove("animate-[shake_0.5s_ease-in-out]"), 500)
      return
    }

    setLoading(true)

    // Generate a random 4-digit room code
    const roomCode = Math.floor(1000 + Math.random() * 9000).toString()

    // Initialize the letter grid with default values (all letters, no colors)
    const alphabet = "أبتثجحخدذرزسشصضطظعغفقكلمنهوي".split("")
    const letterGrid = alphabet.map((letter) => ({
      letter,
      color: "none", // none, red, or blue
    }))

    // Store room data in localStorage
    const roomData = {
      id: roomCode,
      admin: userName,
      created: new Date().toISOString(),
      letterGrid,
      buttonDisabled: false,
      buttonTimer: 0,
      lastUpdate: new Date().toISOString(),
    }

    // Save to localStorage
    localStorage.setItem(`room_${roomCode}`, JSON.stringify(roomData))

    // Add loading animation
    setTimeout(() => {
      setLoading(false)
      navigate(`/admin/${roomCode}`)
    }, 1500)
  }

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen p-4 transition-colors duration-1000 ease-in-out bg-gradient-to-br ${gradients[bgColor]}`}
    >
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-pink-400 animate-bounce">
        <Star size={24} fill="currentColor" />
      </div>
      <div className="absolute top-20 right-20 text-purple-400 animate-pulse">
        <Sparkles size={28} />
      </div>
      <div className="absolute bottom-10 left-20 text-amber-400 animate-bounce delay-300">
        <Star size={20} fill="currentColor" />
      </div>
      <div className="absolute bottom-20 right-10 text-teal-400 animate-pulse delay-500">
        <Sparkles size={24} />
      </div>

      <div
        className={`bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md transition-all duration-1000 transform ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} border border-indigo-100`}
      >
        <div className="relative">
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-full shadow-lg">
            <UserPlus size={32} className="text-white" />
          </div>

          <h1 className="text-3xl text-center mt-6 mb-8 font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500 rtl-text">
            إنشاء غرفة جديدة
          </h1>

          <div className="mb-6">
            <label className="block text-indigo-700 font-medium mb-2 rtl-text">اسمك</label>
            <div className="relative">
              <input
                id="username-input"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition-all duration-300 outline-none rtl-text pr-10"
                placeholder="أدخل اسمك"
              />
              <Crown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={20} />
            </div>
          </div>

          <button
            className={`group w-full py-4 font-bold rounded-xl text-white text-lg transition-all duration-300 rtl-text transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden relative ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg"
            }`}
            onClick={createRoom}
            disabled={loading}
          >
            {!loading && (
              <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
            )}

            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="animate-spin h-5 w-5 text-white" />
                <span>جاري إنشاء الغرفة...</span>
              </div>
            ) : (
              <>
                <Sparkles size={20} className="transition-transform group-hover:rotate-12" />
                <span>إنشاء الغرفة</span>
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300 rtl-text flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft size={16} />
              <span>العودة للصفحة الرئيسية</span>
            </button>
          </div>

          <div className="mt-8 text-center text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
            المبرمج فهد
          </div>
        </div>
      </div>
    </div>
  )
}

