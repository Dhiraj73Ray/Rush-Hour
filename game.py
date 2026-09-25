board = [
    ['.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.']
]

# for row in board:
#     print(" ".join(row))

def print_board():
    for row in board:
        print(" ".join(row))

# This is car's Garage
cars = {
    "A":{"row":2, "col":1, "length":3, "direction":"V"},
    "B":{"row":2, "col":1, "length":3, "direction":"H"},
}

def draw_car(letter, start_row, start_col, length, direction):
    for step in range(length):
        if direction == "H":
            board[start_row][start_col + step] = letter
        elif direction == "V":
            board[start_row + step][start_col] = letter

for id, data in cars.items():
    draw_car(id, data["row"], data["col"], data["length"], data["direction"])

print_board()
