from levels import LEVELS


class RushHourEngine:
    def __init__(self, puzzle_string: str = None, level_index: int = 0):
        if puzzle_string is None and LEVELS and len(LEVELS) > 0:
            puzzle_string = LEVELS[level_index]["puzzle"]
        elif puzzle_string is None:
            puzzle_string = ".A.... .A.... .A.... .BBBC. ....C. ....C."
            level_index = -1

        self.level_index = level_index
        self.exit_side = "bottom"
        self.exit_position = 1
        self.cars = {}
        self.reset(puzzle_string)

    # --------------------------------------------------------------- size
    def _detect_size(self, puzzle_str: str) -> int:
        clean = puzzle_str.replace(" ", "")
        total = len(clean)
        size = int(round(total ** 0.5))
        if size * size != total:
            raise ValueError(f"Puzzle has {total} cells, not a perfect square")
        return size

    # --------------------------------------------------------------- load
    def load_level(self, index: int):
        if index < 0 or index >= len(LEVELS):
            raise ValueError(f"Level {index} does not exist")
        self.level_index = index
        self.reset()  # reset picks up LEVELS[index]

    def reset(self, new_puzzle: str = None):
        # 1. Resolve puzzle string
        if new_puzzle:
            self.puzzle_string = new_puzzle
            if (
                self.level_index >= 0
                and LEVELS
                and self.puzzle_string != LEVELS[self.level_index]["puzzle"]
            ):
                self.level_index = -1
        elif self.level_index >= 0 and LEVELS:
            self.puzzle_string = LEVELS[self.level_index]["puzzle"]
        else:
            self.puzzle_string = ".A.... .A.... .A.... .BBBC. ....C. ....C."

        # 2. Board size + empty board
        self.board_size = self._detect_size(self.puzzle_string)
        self.board = [
            ["." for _ in range(self.board_size)] for _ in range(self.board_size)
        ]

        # 3. Parse cars
        self.cars.clear()
        self._load_puzzle(self.puzzle_string)

        # 4. Resolve exit
        if self.level_index >= 0 and LEVELS:
            level = LEVELS[self.level_index]
            self.exit_side = level.get("exit_side", self._natural_exit_side())
            self.exit_position = level.get(
                "exit_position", self._natural_exit_position()
            )
        else:
            # Custom puzzle — derive exit from A
            self.exit_side = self._natural_exit_side()
            self.exit_position = self._natural_exit_position()

        # 5. Render + validate
        self._render()
        self._validate_puzzle()

    def _natural_exit_side(self) -> str:
        if "A" not in self.cars:
            return "bottom"
        return "right" if self.cars["A"]["direction"] == "H" else "bottom"

    def _natural_exit_position(self) -> int:
        if "A" not in self.cars:
            return 0
        car = self.cars["A"]
        return car["row"] if car["direction"] == "H" else car["col"]

    # --------------------------------------------------------------- parse
    def _load_puzzle(self, puzzle_str: str):
        clean = puzzle_str.replace(" ", "")
        n = self.board_size
        for idx, char in enumerate(clean):
            if char == ".":
                continue
            r, c = idx // n, idx % n
            if char not in self.cars:
                self.cars[char] = {
                    "row": r,
                    "col": c,
                    "length": 1,
                    "direction": None,
                }
            else:
                self.cars[char]["length"] += 1
                if self.cars[char]["direction"] is None:
                    self.cars[char]["direction"] = (
                        "H" if self.cars[char]["row"] == r else "V"
                    )

    # --------------------------------------------------------------- validate
    def _validate_puzzle(self):
        if "A" not in self.cars:
            raise ValueError("Puzzle must contain a car labeled 'A'")

        a = self.cars["A"]

        for cid, data in self.cars.items():
            if data["length"] < 2:
                raise ValueError(f"Car '{cid}' has length 1 (min 2)")
            if data["direction"] is None:
                raise ValueError(f"Car '{cid}' has no direction")

        if self.exit_side not in ("right", "left", "top", "bottom"):
            raise ValueError(f"Invalid exit_side: {self.exit_side}")
        if not (0 <= self.exit_position < self.board_size):
            raise ValueError(
                f"exit_position {self.exit_position} out of range "
                f"(board size {self.board_size})"
            )

        if self.exit_side in ("right", "left"):
            if a["direction"] != "H":
                raise ValueError(
                    f"Exit on '{self.exit_side}' requires car 'A' to be horizontal"
                )
            if a["row"] != self.exit_position:
                raise ValueError(
                    f"Car 'A' must be in row {self.exit_position} "
                    f"for a '{self.exit_side}' exit (currently row {a['row']})"
                )
        else:
            if a["direction"] != "V":
                raise ValueError(
                    f"Exit on '{self.exit_side}' requires car 'A' to be vertical"
                )
            if a["col"] != self.exit_position:
                raise ValueError(
                    f"Car 'A' must be in column {self.exit_position} "
                    f"for a '{self.exit_side}' exit (currently col {a['col']})"
                )

        if self.is_won():
            raise ValueError("Puzzle is already solved (A is at the exit)")

    # --------------------------------------------------------------- render
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
            self._draw_car(
                cid, data["row"], data["col"], data["length"], data["direction"]
            )

    # --------------------------------------------------------------- win
    def is_won(self) -> bool:
        if "A" not in self.cars:
            return False
        car = self.cars["A"]
        last = self.board_size - 1

        if self.exit_side == "right":
            if car["row"] != self.exit_position:
                return False
            return (car["col"] + car["length"] - 1) == last

        if self.exit_side == "left":
            if car["row"] != self.exit_position:
                return False
            return car["col"] == 0

        if self.exit_side == "bottom":
            if car["col"] != self.exit_position:
                return False
            return (car["row"] + car["length"] - 1) == last

        if self.exit_side == "top":
            if car["col"] != self.exit_position:
                return False
            return car["row"] == 0

        return False

    # --------------------------------------------------------------- moves
    def _move_single_step(self, car_id: str, step: int):
        car = self.cars[car_id]
        d = car["direction"]
        last = self.board_size - 1

        if d == "H":
            new_col = car["col"] + step
            if not (0 <= new_col and (new_col + car["length"] - 1) <= last):
                return "wall"
            check_col = (
                (car["col"] + car["length"]) if step > 0 else (car["col"] - 1)
            )
            if self.board[car["row"]][check_col] != ".":
                return "blocked"
            car["col"] = new_col
            return "ok"

        elif d == "V":
            new_row = car["row"] + step
            if not (0 <= new_row and (new_row + car["length"] - 1) <= last):
                return "wall"
            check_row = (
                (car["row"] + car["length"]) if step > 0 else (car["row"] - 1)
            )
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

    # --------------------------------------------------------------- state
    def get_state(self):
        in_level = 0 <= self.level_index < len(LEVELS)
        return {
            "board": self.board,
            "cars": self.cars,
            "is_won": self.is_won(),
            "status": "ok",
            "message": "OK",
            "size": self.board_size,
            "level": self.level_index,
            "total_levels": len(LEVELS),
            "level_name": LEVELS[self.level_index]["name"] if in_level else "Custom",
            "difficulty": LEVELS[self.level_index]["difficulty"] if in_level else "custom",
            "exit_side": self.exit_side,
            "exit_position": self.exit_position,
        }