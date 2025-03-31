import React, { useState, useEffect } from 'react';
import supabase from "../supabaseClient";
import { useParams } from 'react-router-dom';

const Room = () => {
  const { roomCode } = useParams();
  const [room, setRoom] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [players, setPlayers] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const fetchRoomData = async () => {
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_code', roomCode)
        .single();

      if (roomError) {
        console.error("خطأ في جلب بيانات الغرفة:", roomError.message);
        return;
      }

      setRoom(roomData);

      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('*')
        .eq('room_id', roomData.id);

      if (playersError) {
        console.error("خطأ في جلب بيانات اللاعبين:", playersError.message);
        return;
      }

      setPlayers(playersData);

      // حاول استرجاع حالة اللعبة من localStorage
      const storedGameState = localStorage.getItem(`gameState-${roomCode}`);
      if (storedGameState) {
        setGameState(JSON.parse(storedGameState));
      } else {
        // إذا لم تكن موجودة في localStorage، استخدم البيانات من قاعدة البيانات
        const { data: gameData, error: gameDataError } = await supabase
          .from('game_state')
          .select('*')
          .eq('id', roomData.game_state_id)
          .single();

        if (gameDataError) {
          console.error("خطأ في جلب حالة اللعبة:", gameDataError.message);
          return;
        }

        setGameState(gameData);
      }
    };

    fetchRoomData();
  }, [roomCode]);

  const handleCellClick = (index) => {
    if (selectedLetter && gameStarted) {
      let updatedGrid = [...gameState.grid];
      updatedGrid[index] = selectedLetter;
      setGameState({ ...gameState, grid: updatedGrid });

      // تحديث حالة اللعبة في localStorage
      localStorage.setItem(`gameState-${roomCode}`, JSON.stringify({ ...gameState, grid: updatedGrid }));

      // تحديث قاعدة البيانات
      supabase
        .from('game_state')
        .update({ grid: updatedGrid })
        .eq('id', gameState.id);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    // حفظ حالة بدء اللعبة في localStorage
    localStorage.setItem(`gameState-${roomCode}`, JSON.stringify({ ...gameState, turn_active: true }));

    supabase
      .from('game_state')
      .update({ turn_active: true })
      .eq('id', gameState.id);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">غرفة: {roomCode}</h1>
      <div className="mb-6">
        <h2 className="text-xl">اللاعبين</h2>
        {players.map((player) => (
          <p key={player.id}>{player.name} - فريق {player.team}</p>
        ))}
      </div>

      {/* شبكة الخلايا السداسية */}
      <div className="grid grid-cols-5 gap-2 justify-center items-center">
        {gameState && gameState.grid.map((letter, index) => (
          <div
            key={index}
            className={`relative w-16 h-16 ${index % 2 === 0 ? 'bg-yellow-200' : 'bg-white'} 
                        rounded-lg flex justify-center items-center cursor-pointer`}
            onClick={() => handleCellClick(index)}
            style={{
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            }}
          >
            <span className="text-xl">{letter}</span>
          </div>
        ))}
      </div>

      {/* زر بدء اللعبة */}
      {!gameStarted && (
        <button
          className="mt-6 px-6 py-3 text-lg font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition duration-300"
          onClick={startGame}
        >
          بدء المسابقة
        </button>
      )}

      {/* أزرار التحكم */}
      <div className="flex justify-center gap-6 mt-6">
        <button className="px-6 py-3 bg-blue-500 text-white rounded-md">تغيير الحروف</button>
        <button className="px-6 py-3 bg-red-500 text-white rounded-md">إعلان الفائز</button>
        <button className="px-6 py-3 bg-yellow-500 text-white rounded-md">نسخ الحروف</button>
        <button className="px-6 py-3 bg-teal-500 text-white rounded-md">تغيير الألوان</button>
      </div>
    </div>
  );
};

export default Room;

