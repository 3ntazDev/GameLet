"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserCircle, ArrowLeft, Crown, Loader2 } from "lucide-react"

export default function CreateRoom() {
  const [userName, setUserName] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const createRoom = () => {
    if (!userName.trim()) {
      alert("الرجاء إدخال اسمك")
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
    }

    // Save to localStorage
    localStorage.setItem(`room_${roomCode}`, JSON.stringify(roomData))

    setTimeout(() => {
      setLoading(false)
      navigate(`/admin/${roomCode}`)
    }, 1000)
  }

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-900 to-indigo-800 p-4"
      dir="rtl"
    >
      <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft />
        </button>

        <div className="flex items-center justify-center mb-6">
          <Crown className="text-yellow-400 ml-2 animate-pulse" size={28} />
          <h1 className="text-3xl font-bold text-white">إنشاء غرفة جديدة</h1>
        </div>

        <div className="relative mb-6">
          <UserCircle className="absolute right-3 top-3 text-white/50" />
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="px-4 py-3 pr-10 bg-white/10 border border-white/20 text-white rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/50 transition-all"
            placeholder="اسمك"
          />
        </div>

        <button
          className="w-full py-4 bg-gradient-to-r from-green-600 to-green-800 text-white font-semibold rounded-xl shadow-lg hover:from-green-700 hover:to-green-900 transition-all duration-300 flex items-center justify-center"
          onClick={createRoom}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="ml-2 animate-spin" />
              جاري إنشاء الغرفة...
            </>
          ) : (
            <>
              <Crown className="ml-2" />
              إنشاء الغرفة
            </>
          )}
        </button>

        <div className="mt-8 text-center text-white/50 text-xs">
          <p>تم التطوير بواسطة المبرمج فهد</p>
        </div>
      </div>
    </div>
  )
}

