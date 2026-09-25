import { type GameState } from "../types/game";

const API_URL = "http://127.0.0.1:8000";


export const getGameState = async (): Promise<GameState> => {
    const res = await fetch(`${API_URL}/api/state`);
    if (!res.ok) throw new Error("Backend connection failed");
    return (res.json());
}