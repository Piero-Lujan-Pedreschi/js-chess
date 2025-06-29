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
    
    // this.checkAllPaths(this.moveSet);
  }

  createElement() {
    super.createElement();
    this.pieceEl.classList.add("rook");
  }
}