"use client"

import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { Crown, Sparkles, Users, Star, ChevronLeft, ChevronRight, Rocket } from "lucide-react"

export default function HomePage() {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [bgColor, setBgColor] = useState(0)

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

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden transition-colors duration-1000 ease-in-out bg-gradient-to-br ${gradients[bgColor]}`}
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
            <Crown size={32} className="text-white" />
          </div>

          <h1 className="text-4xl md:text-5xl text-center mt-6 mb-2 font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500 tracking-tight">
            فوازير رمضان
          </h1>
          <p className="text-center text-indigo-500 mb-8 font-medium">تحدي الحروف والكلمات</p>

          <div className="space-y-6">
            <button
              onClick={() => navigate("/create")}
              className="group w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition duration-300 text-lg hover:scale-[1.02] transform active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden relative"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              <Rocket size={20} className="transition-transform group-hover:rotate-12" />
              <span className="rtl-text">إنشاء غرفة جديدة</span>
            </button>

            <button
              onClick={() => navigate("/join")}
              className="group w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition duration-300 text-lg hover:scale-[1.02] transform active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden relative"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              <Users size={20} className="transition-transform group-hover:rotate-12" />
              <span className="rtl-text">الانضمام إلى غرفة</span>
            </button>
          </div>

          <div className="mt-10 text-center">
            <p className="animate-pulse text-indigo-500 rtl-text">استعد للتحدي في أجواء رمضان!</p>
            <div className="mt-4 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center gap-2">
              <ChevronLeft size={16} className="text-pink-500" />
              <span>المبرمج فهد</span>
              <ChevronRight size={16} className="text-purple-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

