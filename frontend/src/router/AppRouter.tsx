import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import MainMenu from "../pages/MainMenu";
import GamePage from "../pages/GamePage";
import LevelsPage from "../pages/LevelsPage";
import HistoryPage from "../pages/HistoryPage";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/menu", element: <MainMenu /> },
  { path: "/play", element: <GamePage /> },
  { path: "/play/:level", element: <GamePage /> },
  { path: "/levels", element: <LevelsPage /> },
  { path: "/history", element: <HistoryPage /> },
  { path: "*", element: <LandingPage /> },
]);