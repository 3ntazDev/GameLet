"use client"

import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import supabase from "../supabaseClient"

export default function Winner() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const winningTeam = searchParams.get("team")
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if current player is admin
    const checkAdmin = async () => {
      const playerName = localStorage.getItem("playerName")
      if (playerName) {
        const { data } = await supabase.from("players").select("is_admin").eq("name", playerName).single()

        if (data) {
          setIsAdmin(data.is_admin)
        }
      }
    }

    checkAdmin()
  }, [])

  const resetGame = async () => {
    if (!isAdmin) return

    try {
      // Get room code from localStorage
      const roomCode = localStorage.getItem("roomCode")
      if (!roomCode) return

      // Reset game state
      await supabase
        .from("games")
        .update({
          grid: Array(3).fill(Array(3).fill(null)),
          selected_letter: null,
          turn_active: false,
        })
        .eq("room_code", roomCode)

      // Navigate back to room
      navigate(`/room/${roomCode}`)
    } catch (err) {
      console.error("Error resetting game:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6">Game Over!</h1>

        <div className={`p-8 rounded-lg mb-6 ${winningTeam === "red" ? "bg-red-100" : "bg-blue-100"}`}>
          <h2 className="text-2xl font-bold mb-2">{winningTeam === "red" ? "Red Team Wins!" : "Blue Team Wins!"}</h2>
          <p className="text-lg">Congratulations!</p>
        </div>

        {isAdmin && (
          <button
            onClick={resetGame}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300"
          >
            Play Again
          </button>
        )}

        <button
          onClick={() => navigate("/")}
          className="w-full mt-4 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition duration-300"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}


