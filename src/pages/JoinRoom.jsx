"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserCircle, Hash, ArrowLeft, Shield, ShieldCheck } from "lucide-react"

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState("")
  const [userName, setUserName] = useState("")
  const [team, setTeam] = useState("red")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const joinRoom = () => {
    if (!userName.trim()) {
      setError("الرجاء إدخال اسمك")
      return
    }

    if (!roomCode.trim()) {
      setError("الرجاء إدخال رمز الغرفة")
      return
    }

    // Check if room exists in localStorage
    const roomData = localStorage.getItem(`room_${roomCode}`)

    if (!roomData) {
      setError("الغرفة غير موجودة")
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
    navigate(`/player/${roomCode}`)
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

        <h1 className="text-3xl font-bold mb-8 text-white text-center">الانضمام للغرفة</h1>

        <div className="space-y-5">
          <div className="relative">
            <Hash className="absolute right-3 top-3 text-white/50" />
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="px-4 py-3 pr-10 bg-white/10 border border-white/20 text-white rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/50 transition-all"
              placeholder="رمز الغرفة"
            />
          </div>

          <div className="relative">
            <UserCircle className="absolute right-3 top-3 text-white/50" />
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="px-4 py-3 pr-10 bg-white/10 border border-white/20 text-white rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/50 transition-all"
              placeholder="اسمك"
            />
          </div>

          <div className="flex gap-4 mb-4">
            <button
              className={`flex-1 py-3 px-4 rounded-xl text-white font-medium transition-all duration-300 flex items-center justify-center ${
                team === "red"
                  ? "bg-gradient-to-r from-red-600 to-red-800 shadow-lg shadow-red-600/20"
                  : "bg-red-500/30 hover:bg-red-500/50"
              }`}
              onClick={() => setTeam("red")}
            >
              <Shield className={`ml-2 ${team === "red" ? "animate-pulse" : ""}`} />
              الفريق الأحمر
            </button>
            <button
              className={`flex-1 py-3 px-4 rounded-xl text-white font-medium transition-all duration-300 flex items-center justify-center ${
                team === "blue"
                  ? "bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg shadow-blue-600/20"
                  : "bg-blue-500/30 hover:bg-blue-500/50"
              }`}
              onClick={() => setTeam("blue")}
            >
              <Shield className={`ml-2 ${team === "blue" ? "animate-pulse" : ""}`} />
              الفريق الأزرق
            </button>
          </div>

          <button
            className="w-full py-4 bg-gradient-to-r from-green-600 to-green-800 text-white font-semibold rounded-xl shadow-lg hover:from-green-700 hover:to-green-900 transition-all duration-300 flex items-center justify-center group"
            onClick={joinRoom}
          >
            <ShieldCheck className="ml-2 group-hover:scale-110 transition-transform duration-300" />
            انضمام للغرفة
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-white text-center animate-pulse">
              {error}
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-white/50 text-xs">
          <p>تم التطوير بواسطة المبرمج فهد</p>
        </div>
      </div>
    </div>
  )
}

