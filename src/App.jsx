import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/Home"
import CreateRoom from "./pages/CreateRoom"
import JoinRoom from "./pages/JoinRoom"
import Room from "./pages/Room"
import Winner from "./pages/winner"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/room/:roomCode" element={<Room />} />
        <Route path="/winner" element={<Winner />} />
      </Routes>
    </Router>
  )
}

export default App

