export interface GameState {
    board: string[][];
    is_won: boolean;
    cars: Record<string, CarData>;
    status?: string;
    message?: string;
    size: number;
    level: number;
    total_levels: number;
    level_name: string;
    difficulty: string;
}

export interface CarData {
  row: number;
  col: number;
  length: number;
  direction: "H" | "V";
}

export interface MoveRequest {
  car_id: string;
  steps: number;
}

export interface LevelInfo {
  index: number;
  name: string;
  difficulty: "easy" | "medium" | "hard";
}