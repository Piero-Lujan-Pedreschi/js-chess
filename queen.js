import {Piece} from './piece.js';

export class Queen extends Piece {
  constructor(game, loc) {
    super(game, loc);
    this.moveSet = [
      [8, 8],
      [8, 0],
      [8, -8],
      [-8, 0],
      [-8, 8],
      [0, 8],
      [-8, -8],
      [0, -8]
    ];

    // this.checkAllPaths(this.moveSet);
  }

  createElement() {
    super.createElement();
    this.pieceEl.classList.add("queen");
  }

  isSameOrShorterMove(moveSet, move) {
    const [dxSet, dySet] = moveSet;
    const [dx, dy] = move;

    // Make sure direction is the same
    const sameDirection =
      (dxSet === 0 ? dx === 0 : Math.sign(dx) === Math.sign(dxSet)) &&
      (dySet === 0 ? dy === 0 : Math.sign(dy) === Math.sign(dySet)) &&
      (Math.abs(dx) === Math.abs(dy) || dx === 0 || dy === 0);

    // Magnitude check
    const withinBounds =
      Math.abs(dx) <= Math.abs(dxSet) && Math.abs(dy) <= Math.abs(dySet);

    return sameDirection && withinBounds;
  }
}