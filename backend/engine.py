from levels import LEVELS
class RushHourEngine:
    def __init__(self, puzzle_string: str = None, level_index: int = 0):
        if puzzle_string is None and (LEVELS and len(LEVELS) > 0):
            puzzle_string = LEVELS[level_index]["puzzle"]
        elif puzzle_string is None:
            puzzle_string = ".A.... .A.... .A.... .BBBC. ....C. ....C."
            level_index = -1
            
        self.puzzle_string = puzzle_string
        self.level_index = level_index
        self.board_size = 6
        self.board = [["." for _ in range(6)] for _ in range(6)]
        self.cars = {}
        self.reset()

    def load_level(self, index: int):
        if index < 0 or index >= len(LEVELS):
            raise ValueError(f"Level {index} does not exist")
        self.level_index = index
        self.puzzle_string = LEVELS[index]["puzzle"]
        self.cars.clear()
        self._load_puzzle(self.puzzle_string)
        self._render()

    def reset(self, new_puzzle: str = ".A.... .A.... .A.... .BBBC. ....C. ....C."):
        if self.level_index >= 0:
            self.puzzle_string = LEVELS[self.level_index]["puzzle"]
        elif new_puzzle and new_puzzle != ".A.... .A.... .A.... .BBBC. ....C. ....C.":
            self.puzzle_string = new_puzzle
            self.level_index = -1
        else:
            self.puzzle_string = new_puzzle
            self.level_index = -1

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
        for cid, data in self.cars.items():
            if data["length"] == 1:
                raise ValueError(f"Car '{cid}' has length 1, which is not allowed.")

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
        last = self.board_size - 1
        if car["direction"] == "H":
            return (car["col"] + car["length"] - 1) == last
        return (car["row"] + car["length"] - 1) == last

    def _move_single_step(self, car_id: str, step: int):
        car = self.cars[car_id]
        d = car["direction"]

        if d == "H":
            new_col = car["col"] + step
            if not (0 <= new_col and (new_col + car["length"] - 1) <= 5):
                return "wall"
            check_col = (car["col"] + car["length"]) if step > 0 else (car["col"] - 1)
            if self.board[car["row"]][check_col] != ".":
                return "blocked"
            car["col"] = new_col
            return "ok"

        elif d == "V":
            new_row = car["row"] + step
            if not (0 <= new_row and (new_row + car["length"] - 1) <= 5):
                return "wall"
            check_row = (car["row"] + car["length"]) if step > 0 else (car["row"] - 1)
            if self.board[check_row][car["col"]] != ".":
                return "blocked"
            car["row"] = new_row
            return "ok"
        return "invalid"

    def move(self, car_id: str, steps: int) -> dict:
        cid = car_id.upper()
        if cid not in self.cars:
            return {"status": "not_found", "message": f"Car '{cid}' does not exist!"}

        direction_step = 1 if steps > 0 else -1
        last_status = "ok"

        for _ in range(abs(steps)):
            status = self._move_single_step(cid, direction_step)
            if status != "ok":
                last_status = status
                break
            self._render()

        self._render()

        message_map = {
            "ok": "OK",
            "blocked": "Blocked by another car!",
            "wall": "Wall hit!",
            "invalid": "Invalid direction",
            "not_found": f"Car '{cid}' does not exist!",
        }
        return {"status": last_status, "message": message_map.get(last_status, "OK")}

    def get_state(self):
        return {
            "board": self.board,
            "cars": self.cars,
            "is_won": self.is_won(),
            "status": "ok",
            "message": "OK",
            "level": self.level_index,
            "total_levels": len(LEVELS),
            "level_name": LEVELS[self.level_index]["name"] if self.level_index >= 0 else "Custom",
            "difficulty": LEVELS[self.level_index]["difficulty"] if self.level_index >= 0 else "custom",
        }