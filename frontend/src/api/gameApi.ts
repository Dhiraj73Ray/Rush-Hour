import { type GameState, type MoveRequest } from "../types/game";

const API_URL = "http://127.0.0.1:8000";


export const getGameState = async (): Promise<GameState> => {
    const res = await fetch(`${API_URL}/api/state`);
    if (!res.ok) throw new Error("Backend connection failed");
    return (res.json());
}

export const postMoveCar = async (move: MoveRequest): Promise<GameState> => {
    const res = await fetch(`${API_URL}/api/move`,{
        method: 'POST',
        headers: {'Content-Type': "application/json" },
        body: JSON.stringify(move),
    })
    if (!res.ok) throw new Error("Move action failed");
    return res.json();
}

export const postResetGame = async() => {
    const res = await fetch(`${API_URL}/api/reset`,{
        method: "POST",
    });
    if (!res.ok) throw new Error("Backend connection failed");
    return (res.json());
}