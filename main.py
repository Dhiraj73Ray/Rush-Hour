from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


board = [ ["." for _ in range(6)] for _ in range(6) ]
cars = {}
puzzle_string = ".A.... .A.... .A.... .BBBC. ....C. ....C."

def draw_car(letter, start_row, start_col, length, direction):

    for step in range(length):
        if direction == "H":
            board[start_row][start_col + step] = letter
        elif direction == "V":
            board[start_row + step][start_col] = letter



def park_bot():
    for id, data in cars.items():
        draw_car(id, data["row"], data["col"], data["length"], data["direction"])


def print_board():
    for row in board:
        print(" ".join(row))


def clear_board():
    for row in range(len(board)):
        for col in range(len(board[row])):
            board[row][col] = "."



def move_car(car_id, steps):
    car = cars[car_id]
    direction = car["direction"]
    if direction == "H":
        new_col = car["col"] + steps
        if new_col >= 0 and (new_col + car["length"] - 1) <= 5:
            if steps > 0:
                front_col = car["col"] + car["length"]
                if board[car["row"]][front_col] == ".":
                    cars[car_id]["col"] = new_col
                    return "OK"
                else:
                    return "Blocked by another car!"
            else:
                back_col = car["col"] - 1
                if board[car["row"]][back_col] == ".":
                    cars[car_id]["col"] = new_col
                    return "OK"
                else:
                    return "Blocked by another car!"
        else:
            return "Wall hit!"
    elif direction == "V":
        new_row = car["row"] + steps
        if new_row >= 0 and (new_row + car["length"] - 1) <= 5:
            if steps > 0:
                front_row = car["row"] + car["length"]
                if board[front_row][car["col"]] == ".":
                    cars[car_id]["row"] = new_row
                    return "OK"
                else:
                    return "Blocked by another car!"
            else:
                back_row = car["row"] - 1
                if board[back_row][car["col"]] == ".":
                    cars[car_id]["row"] = new_row
                    return "OK"
                else:
                    return "Blocked by another car!"
        else:
            return "Wall hit!"

    
def is_won():
    return (cars["A"]["row"] + cars["A"]["length"] - 1 == 5)


puzzle_string = ".A.... .A.... .A.... .BBBC. ....C. ....C."


def load_puzzle(puzzle_string):

    string = puzzle_string.replace(" ", "")
    for index, s in enumerate(string):
        row = index//6
        col = index % 6
        # print(row, col)
        if s != ".":
            if s in cars:
                cars[s]["length"] += 1
                if cars[s]["length"] < 3:
                    cars[s]["direction"] = "H" if cars[s]["row"] == row else "V"    
            else:
                cars[s] = {"row": row, "col": col, "length": 1, "direction": None}

        # print(cars)


load_puzzle(puzzle_string)
clear_board()
park_bot()

class MoveRequest(BaseModel):
    car_id: str
    steps: int

@app.get("/state")
def get_state():
    return {
        "board": board,
        "cars": cars,
        "is_won": is_won()
    }

@app.post("/move")
def make_move(req: MoveRequest):
    car_id = req.car_id.upper()
    steps = req.steps
    msg = "OK"
    
    if car_id in cars:
        direction_step = 1 if steps > 0 else -1
        for _ in range(abs(steps)):
            status = move_car(car_id, direction_step)
            if status != "OK":
                msg = status
                break
    else:
        msg = f"Car '{car_id}' not found!"
                
    clear_board()
    park_bot()
    
    return {
        "board": board,
        "cars": cars,
        "is_won": is_won(),
        "message": msg
    }