import pygame
import sys

# Initialize Pygame
pygame.init()

# Set up the game window
WIDTH = 400
HEIGHT = 400
WINDOW_SIZE = (WIDTH, HEIGHT)
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREEN = (0, 128, 0)
FPS = 50

screen = pygame.display.set_mode(WINDOW_SIZE)
pygame.display.set_caption("Reversi")
clock = pygame.time.Clock()

# screen.fill(GREEN)
# pygame.display.flip()
# clock.tick(FPS)


# Game board
board = [[0] * 8 for _ in range(8)]
board[3][3] = 1
board[3][4] = -1
board[4][3] = -1
board[4][4] = 1

# Game variables
player = 1
game_over = False

# Draw the game board
def draw_board():
    screen.fill(BLACK)
    for row in range(8):
        for col in range(8):
            pygame.draw.rect(screen, GREEN, (col * 50, row * 50, 48, 48))
            if board[row][col] == 1:
                pygame.draw.circle(screen, WHITE, (col * 50 + 25, row * 50 + 25), 20)
            elif board[row][col] == -1:
                pygame.draw.circle(screen, BLACK, (col * 50 + 25, row * 50 + 25), 20)

# Check if a move is valid
def is_valid_move(row, col):
    if board[row][col] != 0:
        return False
    for dx in [-1, 0, 1]:
        for dy in [-1, 0, 1]:
            if dx == 0 and dy == 0:
                continue
            x, y = row + dx, col + dy
            count = 0
            while 0 <= x < 8 and 0 <= y < 8 and board[x][y] == -player:
                x += dx
                y += dy
                count += 1
            if count > 0 and 0 <= x < 8 and 0 <= y < 8 and board[x][y] == player:
                return True
    return False

# Make a move
def make_move(row, col):
    if not is_valid_move(row, col):
        return
    board[row][col] = player
    for dx in [-1, 0, 1]:
        for dy in [-1, 0, 1]:
            if dx == 0 and dy == 0:
                continue
            x, y = row + dx, col + dy
            count = 0
            while 0 <= x < 8 and 0 <= y < 8 and board[x][y] == -player:
                x += dx
                y += dy
                count += 1
            if count > 0 and 0 <= x < 8 and 0 <= y < 8 and board[x][y] == player:
                x, y = row + dx, col + dy
                while board[x][y] != player:
                    board[x][y] = player
                    x += dx
                    y += dy

# Check if the game is over
def is_game_over():
    for row in range(8):
        for col in range(8):
            if is_valid_move(row, col):
                return False
    return True

# Main game loop
while not game_over:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
            x, y = pygame.mouse.get_pos()
            row = y // 50
            col = x // 50
            if is_valid_move(row, col):
                make_move(row, col)
                player = -player
                if is_game_over():
                    game_over = True

    draw_board()
    pygame.display.flip()
    clock.tick(FPS)
