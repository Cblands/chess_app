import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Chessboard from "chessboardjsx";
import Chess from "chess.js";

import { post_board } from './api';
import { toast } from 'react-toastify';
import { Dimmer } from 'semantic-ui-react';

// Segments of the code below were obtained from the chessboard.jsx demo. https://chessboardjsx.com/

class Board extends Component {
  static propTypes = { children: PropTypes.func };

  state = {
    fen: "start",
    // square styles for active drop square
    dropSquareStyle: {},
    // custom square styles
    squareStyles: {},
    // square with the currently clicked piece
    pieceSquare: "",
    // currently clicked square
    square: "",
    // array of past game moves
    history: []
  };

  componentDidMount() {
    this.game = new Chess();
    this.checkOrientation();
  }

  checkOrientation = () => {
    if (this.props.userColor === 'b') {
      this.aiPlay()
    }
  }

  // keep clicked square style and remove hint squares
  removeHighlightSquare = () => {
    this.setState(({ pieceSquare, history }) => ({
      squareStyles: squareStyling({ pieceSquare, history })
    }));
  };

  // show possible moves
  highlightSquare = (sourceSquare, squaresToHighlight) => {
    const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
      (a, c) => {
        return {
          ...a,
          ...{
            [c]: {
              background:
                "radial-gradient(circle, #fffc00 36%, transparent 40%)",
              borderRadius: "50%"
            }
          },
          ...squareStyling({
            history: this.state.history,
            pieceSquare: this.state.pieceSquare
          })
        };
      },
      {}
    );

    this.setState(({ squareStyles }) => ({
      squareStyles: { ...squareStyles, ...highlightStyles }
    }));
  };

  onDrop = ({ sourceSquare, targetSquare }) => {
    // see if the move is legal
    let move = this.game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q" // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;
    this.setState(({ history, pieceSquare }) => ({
      fen: this.game.fen(),
      history: this.game.history({ verbose: true }),
      squareStyles: squareStyling({ pieceSquare, history })
    }));

    this.aiPlay();

  };

  aiPlay = async () => {
    try {
      let response = await post_board(this.game.fen())
      let ai_move = this.game.move(response.board, {
        sloppy: true
      });

      if (ai_move === null) return;
      this.setState(({ history, pieceSquare }) => ({
        fen: this.game.fen(),
        history: this.game.history({ verbose: true }),
        squareStyles: squareStyling({ pieceSquare, history })
      }));

      if (response.match_status !== 'continuing') this.handleMatchEnd(response);
    } catch (e) {
      toast.error("Uh oh! Harold couldn't handle the pressure... Try refreshing")
    }

  }

  onMouseOverSquare = square => {
    // get list of possible moves for this square
    let moves = this.game.moves({
      square: square,
      verbose: true
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    let squaresToHighlight = [];
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].color !== this.props.userColor) return;
      squaresToHighlight.push(moves[i].to);
    }

    this.highlightSquare(square, squaresToHighlight);
  };

  onMouseOutSquare = square => this.removeHighlightSquare(square);

  // central squares get diff dropSquareStyles
  onDragOverSquare = square => {
    this.setState({
      dropSquareStyle:
        square === "e4" || square === "d4" || square === "e5" || square === "d5"
          ? { backgroundColor: "cornFlowerBlue" }
          : { boxShadow: "inset 0 0 1px 4px rgb(255, 255, 0)" }
    });
  };

  handleMatchEnd = (response) => {
    this.props.handleMatchEnd(response);
  }

  render() {
    const { fen, dropSquareStyle, squareStyles } = this.state;

    return (
      this.props.children({
        squareStyles,
        position: fen,
        onMouseOverSquare: this.onMouseOverSquare,
        onMouseOutSquare: this.onMouseOutSquare,
        onDrop: this.onDrop,
        dropSquareStyle,
        onDragOverSquare: this.onDragOverSquare,
      })
    );
  }
}

export default class Game extends React.Component{

  render() {
    return (
      <div>
        <Board userColor={this.props.userColor} handleMatchEnd={this.props.handleMatchEnd}>
          {({
            position,
            onDrop,
            onMouseOverSquare,
            onMouseOutSquare,
            squareStyles,
            dropSquareStyle,
            onDragOverSquare
          }) => (
              <Chessboard
                id="board"
                width={320}
                position={position}
                orientation={this.props.userColor === 'w' ? 'white' : 'black'}
                onDrop={onDrop}
                onMouseOverSquare={onMouseOverSquare}
                onMouseOutSquare={onMouseOutSquare}
                boardStyle={{
                  borderRadius: "5px",
                  boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
                }}
                squareStyles={squareStyles}
                dropSquareStyle={dropSquareStyle}
                onDragOverSquare={onDragOverSquare}
              />
            )}
        </Board>
      </div>
    );
  }

}

const squareStyling = ({ pieceSquare, history }) => {
  const sourceSquare = history.length && history[history.length - 1].from;
  const targetSquare = history.length && history[history.length - 1].to;

  return {
    [pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
    ...(history.length && {
      [sourceSquare]: {
        backgroundColor: "rgba(255, 255, 0, 0.4)"
      }
    }),
    ...(history.length && {
      [targetSquare]: {
        backgroundColor: "rgba(255, 255, 0, 0.4)"
      }
    })
  };
};