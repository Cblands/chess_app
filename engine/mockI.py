import chess
import chess.svg
import chess.engine
import time
import math
import random
import re
import matplotlib.pyplot as plt

import engine.values as values

def is_endgame(board):	
	if len(board.pieces(chess.QUEEN, chess.WHITE))+ len(board.pieces(chess.KNIGHT, chess.WHITE)) + len(board.pieces(chess.BISHOP, chess.WHITE)) + len(board.pieces(chess.ROOK, chess.WHITE)) > 1:
			return False # white has more than 2 minor piece
	if len(board.pieces(chess.QUEEN, chess.BLACK)) + len(board.pieces(chess.KNIGHT, chess.BLACK)) + len(board.pieces(chess.BISHOP, chess.BLACK)) + len(board.pieces(chess.ROOK, chess.BLACK)) > 1:
			return False # black has  more than 2 minor piece
	return True


# https://www.chessprogramming.org/Simplified_Evaluation_Function
def evaluate_piece_positions(board, colour):

	score = 0
	for piece_type in range(chess.PAWN, chess.QUEEN + 1):
		for square in board.pieces(piece_type, colour):
			score += values.piece_square_table[piece_type][square] if colour == chess.WHITE else values.piece_square_table[piece_type][chess.square_mirror(square)]
		for square in board.pieces(piece_type, not colour):
			score -= values.piece_square_table[piece_type][square] if colour == chess.BLACK else values.piece_square_table[piece_type][chess.square_mirror(square)]
	
	endgame = is_endgame(board)
	for square in board.pieces(chess.KING, colour):
		score += values.piece_square_table[chess.KING][endgame][square] if colour == chess.WHITE else values.piece_square_table[chess.KING][endgame][chess.square_mirror(square)]
	for square in board.pieces(chess.KING, not colour):
		score -= values.piece_square_table[chess.KING][endgame][square] if colour == chess.BLACK else values.piece_square_table[chess.KING][endgame][chess.square_mirror(square)]
	return score

def evaluate_checkmate(board, colour):
	if board.is_checkmate():
		return -math.inf if board.turn == colour else math.inf
	return 0

def evaluate_stalemate(board, material):
	if board.is_stalemate():
		return math.inf if material < 0 else -math.inf
	return 0

def evaluate_material(board, colour):

	material = 0
	for piece_type in range(chess.PAWN, chess.KING + 1):
		material += values.piece_values[piece_type] * (len(board.pieces(piece_type, colour)) - len(board.pieces(piece_type, not colour)))
	return material

def evaluate_check(board, colour):
	if board.is_check():
		return -100 if board.turn == colour else 100
	return 0


def evaluate_board(board, colour):

	material = evaluate_material(board, colour)
	piece_positions = evaluate_piece_positions(board, colour)
	checkmate = evaluate_checkmate(board, colour)
	stalemate = evaluate_stalemate(board, material)
	check = evaluate_check(board, colour)
	# add other evaluations here, examples:
	# rooks on open files (no pawn), semi open (1 pawn)
	# connected rooks
	# pinning pieces, skewer
	# deduct for having blocked, doubled, or isolated pawns
	# compare 'mobility' of both sides_
	# add for bishop pair
	# opening book
	# modified endgame evaluations
	return 10 * material + piece_positions + checkmate + stalemate + check


# http://web.cs.ucla.edu/~rosen/161/notes/alphabeta.html
def find_best_move_AB(board, colour, depth, alpha = -math.inf, beta = math.inf, max_player = True):

	# Base case
	if depth == 0:
		return [evaluate_board(board, colour), None]

	moves = list(board.legal_moves)
	if len(moves) == 0:
		return [evaluate_board(board, colour), None] # stop descending tree if branch has no legal moves

	random.shuffle(moves) # So engine doesn't play the same moves
	moves.sort(key=lambda move: board.is_capture(move), reverse=True) # Pruning is more effective if capture moves are looked at first
	best_move = moves[0] # board.push(None) causes error
	best_move_value = -math.inf if max_player else math.inf # Maximizing player seeks high value boards and vice versa

	for move in moves:

		board.push(move)
		move_value = find_best_move_AB(board, colour, depth-1, alpha, beta, not max_player)[0]

		if max_player:
			if move_value > best_move_value:
				best_move = move
				best_move_value = move_value 
			alpha = max(move_value, alpha)

		else:
			if move_value < best_move_value:
				best_move = move
				best_move_value = move_value
			beta = min(move_value, beta)

		board.pop()

		if beta <= alpha:
			break

	return [best_move_value, best_move]


def message(board):
	message = 'No match message'

	if board.is_checkmate():
		message = "Checkmate!"
	if board.is_stalemate():
		message = "Stalemate!"
	if board.is_insufficient_material():
		message = "Insufficient material!"
	if board.has_insufficient_material(chess.WHITE):
		message = "White has insufficient material!"
	if board.has_insufficient_material(chess.BLACK):
		message = "Black has insufficient material!"
	if board.is_seventyfive_moves():
		message = "75 moves played without capture/pawn move"
	if board.is_fivefold_repetition():
		message = "Position occurred for 5th time"


def play_chess(board_fen):

	board = chess.Board(board_fen)

	value, move = find_best_move_AB(board, board.turn, 4)
	print(value, move)

	board.push(move)

	if board.is_game_over():

		message = message(board)

		if board.result() == "0-1":
			return board, "Player wins.", message
		elif board.result() == "1-0":
			return board, "AI wins.", message
		elif board.result() == "1/2-1/2":
			return board, "The match results in a draw.", message
		else:
			return board, "Result is undetermined.", message
	else:
		return board.fen(), 'continuing', 'next move'

