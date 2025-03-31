import React, { useState } from 'react';
import supabase from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const JoinRoom = () => {
  const [roomCode, setRoomCode] = useState('');
  const [userName, setUserName] = useState('');
  const [team, setTeam] = useState('red');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const joinRoom = async () => {
    if (!userName) {
      alert("يرجى إدخال اسمك");
      return;
    }

    const { data: room, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('room_code', roomCode)
      .single();

    if (error || !room) {
      setError('الغرفة غير موجودة');
      return;
    }

    const { data, error: playerError } = await supabase
      .from('players')
      .insert([{ room_id: room.id, name: userName, team }]);

    if (playerError) {
      setError('حدث خطأ أثناء الانضمام إلى الغرفة');
      return;
    }

    navigate(`/room/${roomCode}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-semibold mb-8">انضم إلى غرفة</h1>
      <input
        type="text"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md mb-4"
        placeholder="رقم الغرفة"
      />
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md mb-4"
        placeholder="أدخل اسمك"
      />
      <div className="flex gap-4">
        <button
          className="px-6 py-3 text-lg font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
          onClick={() => setTeam('red')}
        >
          فريق أحمر
        </button>
        <button
          className="px-6 py-3 text-lg font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
          onClick={() => setTeam('blue')}
        >
          فريق أزرق
        </button>
      </div>
      <button
        className="mt-4 px-6 py-3 text-lg font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
        onClick={joinRoom}
      >
        انضم إلى الغرفة
      </button>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default JoinRoom;
