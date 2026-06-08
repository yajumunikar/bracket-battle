import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TournamentsPage from "./pages/TournamentsPage";
import TournamentDetailPage from "./pages/TournamentDetailPage";
import CreateTournamentPage from "./pages/CreateTournamentPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/tournaments" element={<TournamentsPage />} />
      <Route path="/tournaments/create" element={<CreateTournamentPage />} />
      <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
    </Routes>
  );
}

export default App;
