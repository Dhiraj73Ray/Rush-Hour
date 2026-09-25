export interface GameState {
    board: string[][];
    is_won: boolean;
    cars: object;
    message?: string|boolean;
}