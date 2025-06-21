import {Piece} from './piece.js';

export class Pawn extends Piece {
  constructor(game, loc) {
    super(game, loc);
    this.captureMoveSet;
  }

  onFirstMove() {
    this.moveSet.pop();
  }

  assignColor(color) {
    this.color = color;
    if (this.color == "white") {
      this.pieceEl.classList.add("white");
      this.game.addWhitePiece(this);
      this.assignMoves(color);
    } else {
      this.pieceEl.classList.add("black");
      this.game.addBlackPiece(this);
      this.assignMoves(color);
    }
  }

  assignMoves(color) {
    if (color == "black") {
      this.moveSet = [
        [0, -1],
        [0, -2],
      ];
      this.captureMoveSet = [
        [1, 1],
        [-1, 1],
      ];
    } else {
      this.moveSet = [
        [0, 1],
        [0, 2],
      ];
      this.captureMoveSet = [
        [1, 1],
        [-1, 1],
      ];
    }
  }

  createElement() {
    super.createElement();
    this.pieceEl.classList.add("pawn");
  }
}