"use client"

import { useNavigate } from "react-router-dom"

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Letter Competition</h1>
        <div className="space-y-4">
          <button
            onClick={() => navigate("/create")}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Create Room
          </button>
          <button
            onClick={() => navigate("/join")}
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  )
}


