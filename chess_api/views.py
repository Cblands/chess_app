from flask import Blueprint, jsonify, request
import engine.mockI as engine

main = Blueprint('main', __name__)

@main.route('/submit_move', methods={'POST'})
def submit_move():

    board = ''
    move_data = request.get_json()
    board, match_status, messsage = engine.play_chess(move_data['board'])

    return jsonify({
        'board' : board,
        'match_status': match_status,
        'messsage': messsage
        })

@main.route('/start_game', methods={'PUT'})
def start_game():

    # Start the chess engine
    return 'Game Started', 201

@main.route('/end_game', methods={'PUT'})
def end_game():
    # Stop the chess engine

    return 'Game Ended', 201
