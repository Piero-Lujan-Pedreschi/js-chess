import {Piece} from './piece.js';

export class Rook extends Piece {
  constructor(game, loc) {
    super(game, loc);
    this.moveSet = [
      [0, 8],
      [0, -8],
      [8, 0], 
      [-8, 0]
    ];
  }

  createElement() {
    super.createElement(); // call base setup
    this.pieceEl.classList.add("rook"); // add specific class
  }
}