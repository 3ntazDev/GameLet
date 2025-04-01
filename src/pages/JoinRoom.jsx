"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState("")
  const [userName, setUserName] = useState("")
  const [team, setTeam] = useState("red")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const joinRoom = () => {
    if (!userName.trim()) {
      setError("Please enter your name")
      return
    }

    if (!roomCode.trim()) {
      setError("Please enter a room code")
      return
    }

    // Check if room exists in localStorage
    const roomData = localStorage.getItem(`room_${roomCode}`)

    if (!roomData) {
      setError("Room not found")
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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-semibold mb-8">Join a Room</h1>
      <input
        type="text"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md mb-4 w-64"
        placeholder="Room Code"
      />
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md mb-4 w-64"
        placeholder="Enter your name"
      />
      <div className="flex gap-4 mb-4">
        <button
          className={`px-6 py-3 text-lg font-medium text-white rounded-md transition duration-300 ${
            team === "red" ? "bg-red-600 ring-2 ring-offset-2 ring-red-600" : "bg-red-500 hover:bg-red-600"
          }`}
          onClick={() => setTeam("red")}
        >
          Red Team
        </button>
        <button
          className={`px-6 py-3 text-lg font-medium text-white rounded-md transition duration-300 ${
            team === "blue" ? "bg-blue-600 ring-2 ring-offset-2 ring-blue-600" : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={() => setTeam("blue")}
        >
          Blue Team
        </button>
      </div>
      <button
        className="px-6 py-3 text-lg font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition duration-300 w-64"
        onClick={joinRoom}
      >
        Join Room
      </button>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  )
}

