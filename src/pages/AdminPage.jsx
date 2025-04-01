"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import LetterGrid from "../components/LetterGrid"
import SharedButton from "../components/SharedButton"

export default function AdminPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedLetter, setSelectedLetter] = useState(null)
  const [selectedTeam, setSelectedTeam] = useState("red")

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
          <h1 className="text-2xl font-bold">Admin Room: {roomId}</h1>
          <div className="text-sm bg-gray-200 px-3 py-1 rounded-full">
            Room Code: <span className="font-bold">{roomId}</span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Letter Grid</h2>
          <LetterGrid
            letters={room.letterGrid}
            onLetterClick={handleLetterClick}
            selectedLetter={selectedLetter}
            isAdmin={true}
          />
        </div>

        {selectedLetter && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium mb-2">
              Selected Letter: <span className="font-bold text-xl">{selectedLetter}</span>
            </h3>
            <div className="flex gap-4 mb-3">
              <button
                className={`px-4 py-2 rounded-md ${
                  selectedTeam === "red"
                    ? "bg-red-600 text-white ring-2 ring-offset-2 ring-red-600"
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                }`}
                onClick={() => handleTeamSelect("red")}
              >
                Red Team
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  selectedTeam === "blue"
                    ? "bg-blue-600 text-white ring-2 ring-offset-2 ring-blue-600"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                }`}
                onClick={() => handleTeamSelect("blue")}
              >
                Blue Team
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  selectedTeam === "none"
                    ? "bg-gray-600 text-white ring-2 ring-offset-2 ring-gray-600"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => handleTeamSelect("none")}
              >
                Clear
              </button>
            </div>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              onClick={handleColorChange}
            >
              Apply Color
            </button>
          </div>
        )}

        <div className="mt-8">
          <SharedButton disabled={room.buttonDisabled} timer={room.buttonTimer} onClick={handleButtonClick} />
        </div>
      </div>
    </div>
  )
}

