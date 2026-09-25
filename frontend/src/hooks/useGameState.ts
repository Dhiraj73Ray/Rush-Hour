import { useState, useEffect } from "react";
import { type GameState } from "../types/game";
import { getGameState } from "../api/gameApi";


export const useGameState = () => {
    const [gameState, setGameState] = useState<GameState|null>(null)
    const [selectedCar, setSelectedCar] = useState<string>("")
    const [status, setStatus] = useState<{ message: string; color: string }>({ message: '', color: '' });


    useEffect(() => {
        const loadInitialState = async () => {

            try{
                const data = await getGameState()
                setGameState(data)
            } catch (err){
                setStatus({ message: "❌ Cannot connect to backend server!", color: "#e84118" });
            }
        }

        loadInitialState()
    }, [])

    const handleCellClick = (cell_id: string, car: string) => {

        if (car != "." && car != selectedCar){
            console.log(cell_id, car)
            setSelectedCar(car)
        }
    }

    return {gameState, status, setStatus, selectedCar, handleCellClick}
}

