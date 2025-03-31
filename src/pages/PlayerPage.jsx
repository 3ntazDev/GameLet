"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Users, Sparkles, Star, KeyRound, UserCircle, AlertCircle } from "lucide-react"

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState("")
  const [userName, setUserName] = useState("")
  const [team, setTeam] = useState("red")
  const [error, setError] = useState("")
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

  const joinRoom = () => {
    setError("")

    if (!userName.trim()) {
      setError("الرجاء إدخال اسمك")
      // Add shake animation to input
      const input = document.getElementById("username-input")
      input.classList.add("animate-[shake_0.5s_ease-in-out]")
      setTimeout(() => input.classList.remove("animate-[shake_0.5s_ease-in-out]"), 500)
      return
    }

    if (!roomCode.trim()) {
      setError("الرجاء إدخال رمز الغرفة")
      // Add shake animation to input
      const input = document.getElementById("roomcode-input")
      input.classList.add("animate-[shake_0.5s_ease-in-out]")
      setTimeout(() => input.classList.remove("animate-[shake_0.5s_ease-in-out]"), 500)
      return
    }

    // Check if room exists in localStorage
    const roomData = localStorage.getItem(`room_${roomCode}`)

    if (!roomData) {
      setError("الغرفة غير موجودة! تأكد من الرمز وحاول مرة أخرى.")
      return
    }

    // Room exists, add player to the room
    const room = JSON.parse(roomData)

    // Add player to room (in a real app, you'd store this in a database)
    const player = {
      name: userName,
      team,
      joinedAt: new Date().toISOString(),
    }

    // In a real app, you'd update the room with the new player
    // For this demo, we'll just navigate to the player page

    // Add joining animation
    const card = document.querySelector(".card-animate")
    card.classList.add("scale-95", "opacity-0")

    setTimeout(() => {
      navigate(`/player/${roomCode}`)
    }, 500)
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
        className={`card-animate bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md transition-all duration-1000 transform ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} border border-indigo-100`}
      >
        <div className="relative">
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-pink-500 to-rose-600 p-4 rounded-full shadow-lg">
            <Users size={32} className="text-white" />
          </div>

          <h1 className="text-3xl text-center mt-6 mb-8 font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-500 rtl-text">
            الانضمام إلى غرفة
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-r-4 border-red-500 rounded-lg flex items-center gap-2 rtl-text">
              <AlertCircle size={20} className="text-red-500 min-w-[20px]" />
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-indigo-700 font-medium mb-2 rtl-text">رمز الغرفة</label>
            <div className="relative">
              <input
                id="roomcode-input"
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition-all duration-300 outline-none rtl-text pr-10"
                placeholder="أدخل رمز الغرفة المكون من 4 أرقام"
              />
              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={20} />
            </div>
          </div>

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
              <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={20} />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-indigo-700 font-medium mb-2 rtl-text">اختر فريقك</label>
            <div className="flex gap-4">
              <button
                className={`group flex-1 py-3 rounded-xl font-bold transition-all duration-300 rtl-text transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden relative ${
                  team === "red"
                    ? "bg-gradient-to-r from-red-500 to-rose-500 text-white ring-4 ring-red-200 shadow-lg"
                    : "bg-red-100 text-red-600 hover:bg-red-200"
                }`}
                onClick={() => setTeam("red")}
              >
                {team === "red" && (
                  <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                )}
                <span>الفريق الأحمر</span>
              </button>
              <button
                className={`group flex-1 py-3 rounded-xl font-bold transition-all duration-300 rtl-text transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden relative ${
                  team === "blue"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white ring-4 ring-blue-200 shadow-lg"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                }`}
                onClick={() => setTeam("blue")}
              >
                {team === "blue" && (
                  <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                )}
                <span>الفريق الأزرق</span>
              </button>
            </div>
          </div>

          <button
            className="group w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition duration-300 text-lg rtl-text transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden relative"
            onClick={joinRoom}
          >
            <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
            <Sparkles size={20} className="transition-transform group-hover:rotate-12" />
            <span>انضم للغرفة</span>
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

