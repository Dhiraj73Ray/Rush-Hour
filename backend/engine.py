from levels import LEVELS
class RushHourEngine:
    def __init__(self, puzzle_string: str = None, level_index: int = 0, exit_side: str = "bottom", exit_position: int = 1):
        if puzzle_string is None and (LEVELS and len(LEVELS) > 0):
            puzzle_string = LEVELS[level_index]["puzzle"]
        elif puzzle_string is None:
            puzzle_string = ".A.... .A.... .A.... .BBBC. ....C. ....C."
            level_index = -1
            
        self.level_index = level_index
        self.exit_side = exit_side
        self.exit_position = exit_position
        self.cars = {}
        
        # Route initialization through reset to ensure size is detected immediately
        self.reset(puzzle_string)
        self._validate_puzzle()

    def _detect_size(self, puzzle_str: str) -> int:
        clean = puzzle_str.replace(" ", "")
        total = len(clean)
        size = int(round(total ** 0.5))
        if size * size != total:
            raise ValueError(f"Puzzle has {total} cells, not a perfect square")
        return size
    
    def load_level(self, index: int):
        if index < 0 or index >= len(LEVELS):
            raise ValueError(f"Level {index} does not exist")
        self.level_index = index
        self.reset(LEVELS[index]["puzzle"])

    def reset(self, new_puzzle: str = None):
        # 1. Resolve which puzzle string to use
        if new_puzzle:
            self.puzzle_string = new_puzzle
            # Only reset level_index to -1 if we aren't internally reloading the current level
            if self.level_index >= 0 and LEVELS and self.puzzle_string != LEVELS[self.level_index]["puzzle"]:
                self.level_index = -1
        elif self.level_index >= 0 and LEVELS:
            self.puzzle_string = LEVELS[self.level_index]["puzzle"]
        else:
            self.puzzle_string = ".A.... .A.... .A.... .BBBC. ....C. ....C."

        # 2. FIX: Detect new size and rebuild the empty board FIRST
        self.board_size = self._detect_size(self.puzzle_string)
        self.board = [["." for _ in range(self.board_size)] for _ in range(self.board_size)]

        # 3. NOW load cars using the correct board_size
        self.cars.clear()
        self._load_puzzle(self.puzzle_string)
        self._render()

    def _validate_puzzle(self):
        if "A" not in self.cars:
            raise ValueError("Puzzle must contain a car labeled 'A'")
        a = self.cars["A"]
        if a["direction"] not in ("H", "V"):
            raise ValueError("Car 'A' must be at least 2 cells long")
        if self.is_won():
            raise ValueError("Puzzle is already solved (A is at the exit)")
        for cid, data in self.cars.items():
            if data["length"] < 2:
                raise ValueError(f"Car '{cid}' has length 1 (min 2)")
            if data["direction"] is None:
                raise ValueError(f"Car '{cid}' has no direction")

    def _load_puzzle(self, puzzle_str: str):
        clean = puzzle_str.replace(" ", "")
        n = self.board_size
        for idx, char in enumerate(clean):
            if char == ".":
                continue
            r, c = idx // n, idx % n
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
        n = self.board_size
        for r in range(n):
            for c in range(n):
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
        last = self.board_size - 1

        if d == "H":
            new_col = car["col"] + step
            if not (0 <= new_col and (new_col + car["length"] - 1) <= last):
                return "wall"
            check_col = (car["col"] + car["length"]) if step > 0 else (car["col"] - 1)
            if self.board[car["row"]][check_col] != ".":
                return "blocked"
            car["col"] = new_col
            return "ok"

        elif d == "V":
            new_row = car["row"] + step
            if not (0 <= new_row and (new_row + car["length"] - 1) <= last):
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
            "size": self.board_size,
            "level": self.level_index,
            "total_levels": len(LEVELS),
            "level_name": LEVELS[self.level_index]["name"] if self.level_index >= 0 else "Custom",
            "difficulty": LEVELS[self.level_index]["difficulty"] if self.level_index >= 0 else "custom",
        }
