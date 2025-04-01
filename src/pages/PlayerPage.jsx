"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { User, Home } from "lucide-react"
import LetterGrid from "../components/LetterGrid" 
import SharedButton from "../components/SharedButton"

export default function PlayerPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [playerName, setPlayerName] = useState("لاعب")
  const [lastClickedUser, setLastClickedUser] = useState(null)

  useEffect(() => {
    // Get player name from localStorage or session
    const storedName = localStorage.getItem("playerName")
    if (storedName) {
      setPlayerName(storedName)
    }

    // Load room data from localStorage
    const roomData = localStorage.getItem(`room_${roomId}`)

    if (!roomData) {
      alert("الغرفة غير موجودة")
      navigate("/")
      return
    }

    setRoom(JSON.parse(roomData))
    setLoading(false)

    // Set up interval to check for updates
    const interval = setInterval(() => {
      const updatedRoomData = localStorage.getItem(`room_${roomId}`)
      if (updatedRoomData) {
        const parsedData = JSON.parse(updatedRoomData)
        setRoom(parsedData)
        if (parsedData.lastClickedUser && parsedData.lastClickedUser !== lastClickedUser) {
          setLastClickedUser(parsedData.lastClickedUser)
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [roomId, navigate, lastClickedUser])

  const handleButtonClick = () => {
    // Update button state in localStorage
    const updatedRoom = {
      ...room,
      buttonDisabled: true,
      buttonTimer: 5,
      lastButtonClickTime: new Date().toISOString(),
      lastClickedUser: playerName, // Store the player name who clicked
    }
    localStorage.setItem(`room_${roomId}`, JSON.stringify(updatedRoom))
    setRoom(updatedRoom)
    setLastClickedUser(playerName)

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
        }
        localStorage.setItem(`room_${roomId}`, JSON.stringify(finalRoom))
        setRoom(finalRoom)
      } else {
        const countingRoom = {
          ...updatedRoom,
          buttonTimer: timeLeft,
        }
        localStorage.setItem(`room_${roomId}`, JSON.stringify(countingRoom))
        setRoom(countingRoom)
      }
    }, 1000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 to-indigo-800">
        <div className="text-white text-xl">جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 p-4" dir="rtl">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <User className="text-blue-400 ml-2" />
            <h1 className="text-2xl font-bold text-white">صفحة اللاعب</h1>
          </div>

          <button
            onClick={() => navigate("/")}
            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <Home size={18} />
          </button>
        </div>

        <div className="flex items-center justify-center mb-6 bg-white/5 p-3 rounded-xl border border-white/10">
          <div className="text-white">
            رمز الغرفة: <span className="font-bold">{roomId}</span>
          </div>
        </div>

        {lastClickedUser && (
          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-xl border border-yellow-500/30 text-center animate-bounce">
            <p className="text-white text-lg">
              <span className="font-bold">{lastClickedUser}</span> ضغط على الزر!
            </p>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 text-white">شبكة الحروف</h2>
          <LetterGrid letters={room.letterGrid} isAdmin={false} />
        </div>

        <div className="mt-8">
          <SharedButton
            disabled={room.buttonDisabled}
            timer={room.buttonTimer}
            onClick={handleButtonClick}
            userName={playerName}
          />
        </div>

        <div className="mt-8 text-center text-white/50 text-xs">
          <p>تم التطوير بواسطة المبرمج فهد</p>
        </div>
      </div>
    </div>
  )
}


