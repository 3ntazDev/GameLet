"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function CreateRoom() {
  const [userName, setUserName] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const createRoom = () => {
    if (!userName.trim()) {
      alert("Please enter your name")
      return
    }

    setLoading(true)

    // Generate a random 4-digit room code
    const roomCode = Math.floor(1000 + Math.random() * 9000).toString()

    // Initialize the letter grid with default values (all letters, no colors)
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-semibold mb-8">Create a New Room</h1>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md mb-4 w-64"
        placeholder="Enter your name"
      />
      <button
        className="px-6 py-3 text-lg font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition duration-300"
        onClick={createRoom}
        disabled={loading}
      >
        {loading ? "Creating Room..." : "Create Room"}
      </button>
    </div>
  )
}

