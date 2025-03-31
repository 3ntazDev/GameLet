"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function CreateRoom() {
  const [userName, setUserName] = useState("")
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setMounted(true)
  }, [])

  const createRoom = () => {
    if (!userName.trim()) {
      // Add shake animation to input
      const input = document.getElementById("username-input")
      input.classList.add("animate-shake")
      setTimeout(() => input.classList.remove("animate-shake"), 500)
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-50 to-purple-50">
      <div
        className={`bg-white rounded-3xl shadow-lg p-8 w-full max-w-md transition-all duration-1000 transform ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} border-2 border-purple-100`}
      >
        <div className="relative">
          <h1 className="text-3xl text-center mb-8 font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 rtl">
            إنشاء غرفة جديدة
          </h1>

          <div className="mb-6">
            <label className="block text-purple-700 font-medium mb-2 rtl">اسمك</label>
            <input
              id="username-input"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-3 bg-purple-50 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all duration-300 outline-none rtl"
              placeholder="أدخل اسمك"
            />
          </div>

          <button
            className={`w-full py-4 font-bold rounded-xl text-white text-lg transition-all duration-300 rtl transform hover:scale-105 active:scale-95 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:shadow-lg"
            }`}
            onClick={createRoom}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                جاري إنشاء الغرفة...
              </div>
            ) : (
              "إنشاء الغرفة"
            )}
          </button>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-purple-600 hover:text-purple-800 transition-colors duration-300 rtl"
            >
              ← العودة للصفحة الرئيسية
            </button>
          </div>

          <p className="mt-8 text-center font-bold text-purple-600">المبرمج فهد</p>
        </div>
      </div>
    </div>
  )
}

