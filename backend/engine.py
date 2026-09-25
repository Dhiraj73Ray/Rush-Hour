class RushHourEngine:
    def __init__(self, puzzle_string: str = ".A.... .A.... .A.... .BBBC. ....C. ....C."):
        self.puzzle_string = puzzle_string
        self.board = [["." for _ in range(6)] for _ in range(6)]
        self.cars = {}
        self.reset()

    def reset(self, new_puzzle: str = None):
        if new_puzzle:
            self.puzzle_string = new_puzzle
        self.cars.clear()
        self._load_puzzle(self.puzzle_string)
        self._render()

    def _load_puzzle(self, puzzle_str: str):
        clean = puzzle_str.replace(" ", "")
        for idx, char in enumerate(clean):
            if char == ".":
                continue
            r, c = idx // 6, idx % 6
            if char not in self.cars:
                self.cars[char] = {"row": r, "col": c, "length": 1, "direction": None}
            else:
                self.cars[char]["length"] += 1
                if self.cars[char]["direction"] is None:
                    self.cars[char]["direction"] = "H" if self.cars[char]["row"] == r else "V"

    def _clear_board(self):
        for r in range(6):
            for c in range(6):
                self.board[r][c] = "."

    def _draw_car(self, letter, start_r, start_c, length, direction):
        for step in range(length):
            if direction == "H":
                self.board[start_r][start_c + step] = letter
            elif direction == "V":
                self.board[start_r + step][start_c] = letter

    def _render(self):
        self._clear_board()
        for cid, data in self.cars.items():
            self._draw_car(cid, data["row"], data["col"], data["length"], data["direction"])

    def is_won(self) -> bool:
        if "A" not in self.cars:
            return False
        car = self.cars["A"]
        # Horizontal exit (col 5) ya vertical exit (row 5)
        if car["direction"] == "H":
            return (car["col"] + car["length"] - 1) == 5
        return (car["row"] + car["length"] - 1) == 5

    def _move_single_step(self, car_id: str, step: int):
        car = self.cars[car_id]
        d = car["direction"]
        
        if d == "H":
            new_col = car["col"] + step
            if not (0 <= new_col and (new_col + car["length"] - 1) <= 5):
                return "Wall hit!"
            check_col = (car["col"] + car["length"]) if step > 0 else (car["col"] - 1)
            if self.board[car["row"]][check_col] != ".":
                return "Blocked by another car!"
            car["col"] = new_col
            return "OK"
            
        elif d == "V":
            new_row = car["row"] + step
            if not (0 <= new_row and (new_row + car["length"] - 1) <= 5):
                return "Wall hit!"
            check_row = (car["row"] + car["length"]) if step > 0 else (car["row"] - 1)
            if self.board[check_row][car["col"]] != ".":
                return "Blocked by another car!"
            car["row"] = new_row
            return "OK"
        return "Invalid direction"

    def move(self, car_id: str, steps: int) -> str:
        cid = car_id.upper()
        if cid not in self.cars:
            return f"Car '{cid}' does not exist!"

        direction_step = 1 if steps > 0 else -1
        last_status = "OK"

        for _ in range(abs(steps)):
            status = self._move_single_step(cid, direction_step)
            if status != "OK":
                last_status = status
                break
            self._render()

        self._render()
        return last_status

    def get_state(self):
        return {
            "board": self.board,
            "cars": self.cars,
            "is_won": self.is_won()
        }