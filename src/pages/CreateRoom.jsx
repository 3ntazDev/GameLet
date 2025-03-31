import React, { useState } from 'react';
import supabase from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const CreateRoom = () => {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createRoom = async () => {
    if (!userName) {
      alert("يرجى إدخال اسمك");
      return;
    }

    setLoading(true);
    const roomCode = Math.floor(1000 + Math.random() * 9000).toString();

    const initialGrid = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""]
    ];

    const gameState = {
      grid: initialGrid,
      selected_letter: "",
      turn_active: false,
      winner: ""
    };

    const { data: gameStateData, error: gameStateError } = await supabase
      .from('game_state')
      .insert([gameState])
      .select()
      .single();

    if (gameStateError) {
      console.error("خطأ في إنشاء حالة اللعبة:", gameStateError.message);
      alert('حدث خطأ أثناء إنشاء حالة اللعبة');
      setLoading(false);
      return;
    }

    if (!gameStateData) {
      console.error("فشل إنشاء حالة اللعبة: البيانات فارغة");
      alert('فشل إنشاء حالة اللعبة');
      setLoading(false);
      return;
    }

    const { data: roomData, error: roomError } = await supabase
      .from('rooms')
      .insert([
        {
          room_code: roomCode,
          game_state_id: gameStateData.id
        }
      ])
      .select()
      .single();

    if (roomError) {
      console.error("خطأ في إنشاء الغرفة:", roomError.message);
      alert('حدث خطأ أثناء إنشاء الغرفة');
      setLoading(false);
      return;
    }

    const { data: playerData, error: playerError } = await supabase
      .from('players')
      .insert([{ room_id: roomData.id, name: userName, team: 'red' }]);

    if (playerError) {
      console.error("خطأ في إضافة اللاعب:", playerError.message);
      alert('حدث خطأ أثناء إضافة اللاعب');
      setLoading(false);
      return;
    }

    navigate(`/room/${roomCode}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-semibold mb-8">إنشاء غرفة جديدة</h1>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md mb-4"
        placeholder="أدخل اسمك"
      />
      <button
        className="px-6 py-3 text-lg font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition duration-300"
        onClick={createRoom}
        disabled={loading}
      >
        {loading ? 'جارٍ إنشاء الغرفة...' : 'إنشاء غرفة'}
      </button>
    </div>
  );
};

export default CreateRoom;
