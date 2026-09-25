# 6x6 board

board = [
    [".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", "."]
]

# for row in board:
#     print(" ".join(row))

cars = {
    "A":{"row":2, "col":1, "length":3, "direction":"V"},
    "B":{"row":1, "col":3, "length":3, "direction":"H"},
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
        for col in range(len(board)):
            if col != ".":
                board[row][col] = "."


def move_car(car_id, steps):
    car = cars[car_id]
    direction = car["direction"]
    if direction == "H":
        draw_car(car_id, car["row"], car["col"] + steps, car["length"], car["direction"])
        board[car["row"]][car["col"]] = "."
    elif direction == "V":
        draw_car(car_id, car["row"] + steps, car["col"], car["length"], car["direction"])
        board[car["row"]][car["col"]] = "."
    print_board()




def render():
    clear_board()
    park_bot()
    print_board()

   

render()
print()
move_car("A",1)