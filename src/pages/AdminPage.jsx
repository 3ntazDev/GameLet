"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Crown, Copy, Home, CheckCircle } from "lucide-react"
import LetterGrid from "../components/LetterGrid" 
import SharedButton from "../components/SharedButton"

export default function AdminPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedLetter, setSelectedLetter] = useState(null)
  const [selectedTeam, setSelectedTeam] = useState("red")
  const [lastClickedUser, setLastClickedUser] = useState(null)
  const [copied, setCopied] = useState(false)

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

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter)
  }

  const handleTeamSelect = (team) => {
    setSelectedTeam(team)
  }

  const handleColorChange = () => {
    if (!selectedLetter) return

    const updatedLetterGrid = room.letterGrid.map((item) => {
      if (item.letter === selectedLetter) {
        return { ...item, color: selectedTeam }
      }
      return item
    })

    const updatedRoom = { ...room, letterGrid: updatedLetterGrid }
    localStorage.setItem(`room_${roomId}`, JSON.stringify(updatedRoom))
    setRoom(updatedRoom)
    setSelectedLetter(null)
  }

  const handleButtonClick = () => {
    // Update button state in localStorage
    const updatedRoom = {
      ...room,
      buttonDisabled: true,
      buttonTimer: 5,
      lastButtonClickTime: new Date().toISOString(),
      lastClickedUser: room.admin, // Admin clicked the button
    }
    localStorage.setItem(`room_${roomId}`, JSON.stringify(updatedRoom))
    setRoom(updatedRoom)
    setLastClickedUser(room.admin)

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

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
            <Crown className="text-yellow-400 ml-2 animate-pulse" />
            <h1 className="text-2xl font-bold text-white">لوحة المشرف</h1>
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
            رمز الغرفة: <span className="font-bold text-xl">{roomId}</span>
          </div>
          <button
            onClick={copyRoomCode}
            className="mr-3 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white"
            title="نسخ الرمز"
          >
            {copied ? <CheckCircle size={18} className="text-green-400" /> : <Copy size={18} />}
          </button>
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
          <div className="flex justify-center py-4">
            <LetterGrid
              letters={room.letterGrid}
              onLetterClick={handleLetterClick}
              selectedLetter={selectedLetter}
              isAdmin={true}
            />
          </div>
        </div>

        {selectedLetter && (
          <div className="mb-6 p-4 bg-white/5 border border-white/20 rounded-xl">
            <h3 className="font-medium mb-4 text-white text-center">
              الحرف المختار:{" "}
              <span className="font-bold text-2xl bg-white/10 px-3 py-1 rounded-lg ml-2">{selectedLetter}</span>
            </h3>
            <div className="flex gap-4 mb-5 justify-center flex-wrap">
              <button
                className={`px-5 py-3 rounded-xl transition-all duration-300 flex items-center ${
                  selectedTeam === "red"
                    ? "bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg shadow-red-600/20"
                    : "bg-red-500/30 text-white hover:bg-red-500/50"
                }`}
                onClick={() => handleTeamSelect("red")}
              >
                الفريق الأحمر
              </button>
              <button
                className={`px-5 py-3 rounded-xl transition-all duration-300 flex items-center ${
                  selectedTeam === "blue"
                    ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg shadow-blue-600/20"
                    : "bg-blue-500/30 text-white hover:bg-blue-500/50"
                }`}
                onClick={() => handleTeamSelect("blue")}
              >
                الفريق الأزرق
              </button>
              <button
                className={`px-5 py-3 rounded-xl transition-all duration-300 flex items-center ${
                  selectedTeam === "none"
                    ? "bg-gradient-to-r from-gray-600 to-gray-800 text-white shadow-lg shadow-gray-600/20"
                    : "bg-gray-500/30 text-white hover:bg-gray-500/50"
                }`}
                onClick={() => handleTeamSelect("none")}
              >
                إزالة
              </button>
            </div>
            <div className="text-center">
              <button
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl hover:from-green-700 hover:to-green-900 transition-all duration-300 shadow-lg shadow-green-600/20"
                onClick={handleColorChange}
              >
                تطبيق اللون
              </button>
            </div>
          </div>
        )}

        <div className="mt-8">
          <SharedButton
            disabled={room.buttonDisabled}
            timer={room.buttonTimer}
            onClick={handleButtonClick}
            userName={room.admin}
          />
        </div>

        <div className="mt-8 text-center text-white/50 text-xs">
          <p>تم التطوير بواسطة المبرمج فهد</p>
        </div>
      </div>
    </div>
  )
}

