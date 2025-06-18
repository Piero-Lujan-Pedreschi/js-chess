import {Piece} from './piece.js';

export class Pawn extends Piece {
  constructor(game, loc) {
    super(game, loc);
    this.moveSet = [
      [0, 1],
      [0, 2],
    ];
    this.killMoveSet = this.assignKM(this.color);
  }

  onFirstMove() {
    this.moveSet.pop();
  }

  assignKM(color) {
    if (color == 'white') {
      return [[1, 1], [-1, 1]];
    } else {
      return [[1, -1], [-1, -1]];
    }
  }

  createElement() {
    super.createElement(); // call base setup
    this.pieceEl.classList.add("pawn"); // add specific class
  }
}