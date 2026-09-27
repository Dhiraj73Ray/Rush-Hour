import "./Footer.css";

interface FooterProps {
  level: number;
  status: string;
}

export const Footer: React.FC<FooterProps> = ({ level, status }) => (
  <footer className="game-footer">
    <span>RUSH HOUR ENGINE</span>
    <span>•</span>
    <span>PUZZLE {String(level).padStart(2, "0")}</span>
    <span>•</span>
    <span>{status}</span>
  </footer>
);