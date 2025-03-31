"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import LetterGrid from "../components/LetterGrid"
import SharedButton from "../components/SharedButton"
import { Crown, Sparkles, Star, Palette, CheckCircle, ArrowLeft } from "lucide-react"

export default function AdminPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedLetter, setSelectedLetter] = useState(null)
  const [selectedTeam, setSelectedTeam] = useState("red")
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
    // Load room data from localStorage
    const roomData = localStorage.getItem(`room_${roomId}`)

    if (!roomData) {
      alert("الغرفة غير موجودة")
      navigate("/")
      return
    }

    setRoom(JSON.parse(roomData))
    setLoading(false)

    // Cycle through background colors
    const interval = setInterval(() => {
      setBgColor((prev) => (prev + 1) % gradients.length)
    }, 5000)

    // Set up interval to check for updates and update other clients
    const updateInterval = setInterval(() => {
      const updatedRoomData = localStorage.getItem(`room_${roomId}`)
      if (updatedRoomData) {
        const parsedRoom = JSON.parse(updatedRoomData)
        // Only update if there's a change
        if (JSON.stringify(parsedRoom) !== JSON.stringify(room)) {
          setRoom(parsedRoom)
        }
      }
    }, 1000)

    setTimeout(() => {
      setMounted(true)
    }, 100)

    return () => {
      clearInterval(interval)
      clearInterval(updateInterval)
    }
  }, [roomId, navigate])

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter)

    // Add sound effect
    const audio = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-game-click-1114.mp3")
    audio.play()
  }

  const handleTeamSelect = (team) => {
    setSelectedTeam(team)

    // Add sound effect
    const audio = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3")
    audio.play()
  }

  const handleColorChange = () => {
    if (!selectedLetter) return

    const updatedLetterGrid = room.letterGrid.map((item) => {
      if (item.letter === selectedLetter) {
        return { ...item, color: selectedTeam }
      }
      return item
    })

    const updatedRoom = {
      ...room,
      letterGrid: updatedLetterGrid,
      lastUpdate: new Date().toISOString(),
    }
    localStorage.setItem(`room_${roomId}`, JSON.stringify(updatedRoom))
    setRoom(updatedRoom)
    setSelectedLetter(null)

    // Add sound effect
    const audio = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-positive-interface-beep-221.mp3")
    audio.play()
  }

  const handleButtonClick = () => {
    // Update button state in localStorage
    const updatedRoom = {
      ...room,
      buttonDisabled: true,
      buttonTimer: 5,
      lastButtonClickTime: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
    }
    localStorage.setItem(`room_${roomId}`, JSON.stringify(updatedRoom))
    setRoom(updatedRoom)

    // Add sound effect
    const audio = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3")
    audio.play()

    // Start countdown
    let timeLeft = 5
    const countdownInterval = setInterval(() => {
      timeLeft -= 1

      if (timeLeft <= 0) {
        clearInterval(countdownInterval)
        const finalRoom = {
          ...updatedRoom,
          buttonDisabled: false,
          buttonTimer: 0,
          lastUpdate: new Date().toISOString(),
        }
        localStorage.setItem(`room_${roomId}`, JSON.stringify(finalRoom))
        setRoom(finalRoom)

        // Add sound effect when timer ends
        const endAudio = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-arcade-bonus-alert-767.mp3")
        endAudio.play()
      } else {
        const countingRoom = {
          ...updatedRoom,
          buttonTimer: timeLeft,
          lastUpdate: new Date().toISOString(),
        }
        localStorage.setItem(`room_${roomId}`, JSON.stringify(countingRoom))
        setRoom(countingRoom)
      }
    }, 1000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-2xl font-bold text-indigo-600 animate-pulse rtl-text flex items-center gap-3">
          <Sparkles className="animate-spin" />
          <span>جاري تحميل اللعبة...</span>
          <Sparkles className="animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen p-4 pb-20 transition-colors duration-1000 ease-in-out bg-gradient-to-br ${gradients[bgColor]}`}
    >
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-pink-400 animate-bounce">
        <Star size={24} fill="currentColor" />
      </div>
      <div className="absolute top-20 right-20 text-purple-400 animate-pulse">
        <Sparkles size={28} />
      </div>

      <div
        className={`bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl max-w-4xl mx-auto p-6 transition-all duration-1000 transform ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} border border-indigo-100`}
      >
        <div className="relative">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-500 rtl-text flex items-center gap-2">
              <Crown className="text-indigo-500" size={24} />
              <span>لوحة تحكم المشرف</span>
            </h1>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full font-bold shadow-md rtl-text flex items-center gap-2">
              <span>رمز الغرفة:</span>
              <span className="font-bold bg-white/20 px-2 py-1 rounded-lg">{roomId}</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-500 rtl-text flex items-center justify-center gap-2">
              <Sparkles size={20} />
              <span>شبكة الحروف</span>
              <Sparkles size={20} />
            </h2>
            <LetterGrid
              letters={room.letterGrid}
              onLetterClick={handleLetterClick}
              selectedLetter={selectedLetter}
              isAdmin={true}
            />
          </div>

          {selectedLetter && (
            <div className="mb-8 p-6 border-2 border-indigo-200 rounded-xl bg-white/50 shadow-md transition-all duration-300 animate-[fadeIn_0.5s_ease-in-out]">
              <h3 className="font-bold mb-4 text-center rtl-text flex items-center justify-center gap-2">
                <span>الحرف المختار:</span>
                <span className="text-3xl text-indigo-600 bg-indigo-100 w-12 h-12 flex items-center justify-center rounded-lg">
                  {selectedLetter}
                </span>
              </h3>
              <div className="flex flex-wrap gap-4 justify-center mb-4">
                <button
                  className={`group px-6 py-3 rounded-xl font-bold transition-all duration-300 rtl-text transform hover:scale-105 active:scale-95 flex items-center gap-2 overflow-hidden relative ${
                    selectedTeam === "red"
                      ? "bg-gradient-to-r from-red-500 to-rose-500 text-white ring-4 ring-red-200 shadow-lg"
                      : "bg-red-100 text-red-600 hover:bg-red-200"
                  }`}
                  onClick={() => handleTeamSelect("red")}
                >
                  {selectedTeam === "red" && (
                    <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                  )}
                  <div className="w-3 h-3 rounded-full bg-red-500 ring-2 ring-white"></div>
                  <span>الفريق الأحمر</span>
                </button>
                <button
                  className={`group px-6 py-3 rounded-xl font-bold transition-all duration-300 rtl-text transform hover:scale-105 active:scale-95 flex items-center gap-2 overflow-hidden relative ${
                    selectedTeam === "blue"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white ring-4 ring-blue-200 shadow-lg"
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  }`}
                  onClick={() => handleTeamSelect("blue")}
                >
                  {selectedTeam === "blue" && (
                    <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                  )}
                  <div className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-white"></div>
                  <span>الفريق الأزرق</span>
                </button>
                <button
                  className={`group px-6 py-3 rounded-xl font-bold transition-all duration-300 rtl-text transform hover:scale-105 active:scale-95 flex items-center gap-2 overflow-hidden relative ${
                    selectedTeam === "none"
                      ? "bg-gradient-to-r from-gray-500 to-gray-600 text-white ring-4 ring-gray-200 shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => handleTeamSelect("none")}
                >
                  {selectedTeam === "none" && (
                    <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                  )}
                  <div className="w-3 h-3 rounded-full bg-gray-500 ring-2 ring-white"></div>
                  <span>إزالة اللون</span>
                </button>
              </div>
              <button
                className="group w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition duration-300 rtl-text transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 overflow-hidden relative"
                onClick={handleColorChange}
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                <Palette size={20} className="transition-transform group-hover:rotate-12" />
                <span>تطبيق اللون</span>
                <CheckCircle size={20} className="transition-transform group-hover:rotate-12" />
              </button>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <SharedButton disabled={room.buttonDisabled} timer={room.buttonTimer} onClick={handleButtonClick} />
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300 rtl-text flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft size={16} />
              <span>العودة للصفحة الرئيسية</span>
            </button>
          </div>

          <div className="mt-4 text-center text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
            المبرمج فهد
          </div>
        </div>
      </div>
    </div>
  )
}


