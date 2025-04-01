"use client"

import { useNavigate } from "react-router-dom"
import { Trophy, Users, Sparkles } from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 flex flex-col items-center justify-center p-4 font-sans" dir="rtl">
      <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-500/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/30 rounded-full blur-3xl"></div>
        
        <div className="relative">
          <h1 className="text-4xl font-bold text-center mb-2 text-white">
            <Sparkles className="inline-block mr-2 text-yellow-300 animate-pulse" size={28} />
            مسابقة الحروف
          </h1>
          <p className="text-center text-white/70 mb-8">أهلاً بك في تحدي الحروف الممتع</p>
          
          <div className="space-y-4">
            <button
              onClick={() => navigate("/create")}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 flex items-center justify-center group"
            >
              <Trophy className="ml-2 group-hover:rotate-12 transition-transform duration-300" />
              <span>إنشاء غرفة</span>
            </button>
            
            <button
              onClick={() => navigate("/join")}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold rounded-xl shadow-lg hover:from-red-700 hover:to-red-900 transition-all duration-300 flex items-center justify-center group"
            >
              <Users className="ml-2 group-hover:scale-110 transition-transform duration-300" />
              <span>الانضمام لغرفة</span>
            </button>
          </div>
          
          <div className="mt-8 text-center text-white/50 text-xs">
            <p>تم التطوير بواسطة المبرمج فهد</p>
          </div>
        </div>
      </div>
    </div>
  )
}

