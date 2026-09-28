import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isSessionActive, startSession } from "../hooks/useSession";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isSessionActive()) {
      navigate("/menu", { replace: true });
    }
  }, [navigate]);

  const handlePlay = () => {
    startSession();
    navigate("/menu");
  };

  return (
    <div className="landing">
      <div className="landing-hero">
        <div className="landing-icon">🚗</div>
        <h1 className="landing-title">RUSH HOUR</h1>
        <p className="landing-subtitle">Traffic Puzzle</p>
        <p className="landing-tagline">
          Slide the cars. Clear the exit. One puzzle at a time.
        </p>
        <button className="landing-btn" onClick={handlePlay}>
          PLAY
        </button>
      </div>
    </div>
  );
}