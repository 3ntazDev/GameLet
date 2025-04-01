"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import LetterGrid from "../components/LetterGrid"
import SharedButton from "../components/SharedButton"

export default function PlayerPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load room data from localStorage
    const roomData = localStorage.getItem(`room_${roomId}`)

    if (!roomData) {
      alert("Room not found")
      navigate("/")
      return
    }

    setRoom(JSON.parse(roomData))
    setLoading(false)

    // Set up interval to check for updates
    const interval = setInterval(() => {
      const updatedRoomData = localStorage.getItem(`room_${roomId}`)
      if (updatedRoomData) {
        setRoom(JSON.parse(updatedRoomData))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [roomId, navigate])

  const handleButtonClick = () => {
    // Update button state in localStorage
    const updatedRoom = {
      ...room,
      buttonDisabled: true,
      buttonTimer: 5,
      lastButtonClickTime: new Date().toISOString(),
    }
    localStorage.setItem(`room_${roomId}`, JSON.stringify(updatedRoom))
    setRoom(updatedRoom)

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
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Player View</h1>
          <div className="text-sm bg-gray-200 px-3 py-1 rounded-full">
            Room: <span className="font-bold">{roomId}</span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Letter Grid</h2>
          <LetterGrid letters={room.letterGrid} isAdmin={false} />
        </div>

        <div className="mt-8">
          <SharedButton disabled={room.buttonDisabled} timer={room.buttonTimer} onClick={handleButtonClick} />
        </div>
      </div>
    </div>
  )
}

