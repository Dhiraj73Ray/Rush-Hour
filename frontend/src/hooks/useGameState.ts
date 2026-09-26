import { useState, useEffect } from "react";
import { type GameState } from "../types/game";
import { getGameState } from "../api/gameApi";

export const useGameState = () => {
    const [gameState, setGameState] = useState<GameState|null>(null)
    const [selectedCar, setSelectedCar] = useState<string>("")
    const [status, setStatus] = useState<{ message: string; color: string }>({ message: '', color: '' });
    const [hoveredCar, setHoveredCar] = useState<string|null>(null)

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
    const handleCellClick = (car: string) => {
        
        if (car != "." && car != selectedCar){
            // console.log(cell_id, car)
            setSelectedCar(car)
        }
    }

    
    const handleMouseEnter = (cell: string) => {
        if (cell === ".") return; // Skip empty board slots
        setHoveredCar(cell);
    };
    
    const handleMouseLeave = () => setHoveredCar(null);
    

    return {gameState, status, setStatus, selectedCar, handleCellClick, handleMouseEnter, handleMouseLeave, hoveredCar}
}