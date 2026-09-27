export interface GameState {
    board: string[][];
    is_won: boolean;
    cars: Record<string, CarData>;
    status?: string;
    message?: string;
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