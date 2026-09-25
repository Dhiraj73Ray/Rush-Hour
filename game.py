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


park_bot()



def print_board():
    for row in board:
        print(" ".join(row))

print_board()