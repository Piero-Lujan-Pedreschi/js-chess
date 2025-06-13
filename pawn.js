import {Piece} from './piece.js';

export class Pawn extends Piece {
  constructor(game, loc) {
    super(game, loc);
    this.moveSet = [
      [0, 1],
      [0, 2],
    ];
  }

  onFirstMove() {
    this.moveSet.pop();
  }

  createElement() {
    super.createElement(); // call base setup
    this.pieceEl.classList.add("pawn"); // add specific class
  }
}