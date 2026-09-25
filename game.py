import re

# 6x6 board


board = [
    [".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", "."]
]


cars = {
    "A":{"row":0, "col":1, "length":3, "direction":"V"},
    "B":{"row":3, "col":1, "length":3, "direction":"H"},
    "C":{"row":3, "col":4, "length":3, "direction":"V"},
}


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
        if new_col >= 0 and (new_col + car["length"] -1) <= 5:
            if steps > 0:
                front_col = car["col"] + car["length"]
                if board[car["row"]][front_col] == ".":
                    cars[car_id]["col"] = new_col
                    return True
                else:
                    print("Blocked by another car!")
                    return False
            else:
                back_col = car["col"] -1
                if board[car["row"]][back_col] == ".":
                    cars[car_id]["col"] = new_col
                    return True
                else:
                    print("Blocked by another car!")
                    return False
        else:
            print("Wall hit!")
            return False

    elif direction == "V":
        new_row = car["row"] + steps
        if new_row >= 0 and (new_row + car["length"] -1) <= 5:
            if steps > 0:
                front_row = car["row"] + car["length"]
                if board[front_row][car["col"]] == ".":
                    cars[car_id]["row"] = new_row
                    return True
                else:
                    print("Blocked by another car!")
                    return False

            else:
                back_row = car["row"] -1

                if board[back_row][car["col"]] == ".":
                    cars[car_id]["row"] = new_row
                    return True
                else:
                    print("Blocked by another car!")
                    return False
        else:
            print("Wall hit!")
            return False

    # print_board()

    
def is_won():
    return (cars["A"]["row"] + cars["A"]["length"] - 1 == 5)

   

def render():
    clear_board()
    park_bot()
    print_board()


   

while(True):
    render()
    if is_won():
        print("You Win!")
        break
    user_input = input().strip()
    match = re.match(r"^([A-Za-z])\s?(\-?\d+)$", user_input)
    if match:
        car_id = match.group(1)
        steps = int(match.group(2))
        if car_id in cars:
            direction_step = 1 if steps > 0 else -1
            for _ in range(abs(steps)):
                success = move_car(car_id, direction_step)
                if success == False:
                    break
        else:
            print("Wrong Car")
    else:
        print("Invalid Input! Sahi format: 'A 15' ya 'A15' (Single letter + Number)")
