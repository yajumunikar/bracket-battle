import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TournamentsPage from "./pages/TournamentsPage";
import TournamentDetailPage from "./pages/TournamentDetailPage";
import CreateTournamentPage from "./pages/CreateTournamentPage";
import MyTournamentsPage from "./pages/MyTournamentsPage";
import BracketPage from "./pages/BracketPage";
import GamesPage from "./pages/GamesPage";
import ProfilePage from "./pages/ProfilePage";
import ArenaIntelPage from "./pages/ArenaIntelPage";
import MatchPredictionPage from "./pages/MatchPredictionPage";
import ChatBot from "./components/ChatBot";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/tournaments" element={<TournamentsPage />} />
        <Route path="/tournaments/create" element={<CreateTournamentPage />} />
        <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
        <Route path="/tournaments/:id/bracket" element={<BracketPage />} />
        <Route path="/my-tournaments" element={<MyTournamentsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/intel" element={<ArenaIntelPage />} />
        <Route path="/intel/:id" element={<MatchPredictionPage />} />
      </Routes>
      <ChatBot />
    </>
  );
}

export default App;
