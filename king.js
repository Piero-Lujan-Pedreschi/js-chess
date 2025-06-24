import {Piece} from './piece.js';

export class King extends Piece {
  constructor(game, loc) {
    super(game, loc);
    this.moveSet = [
      [1, 1],
      [1, 0],
      [1, -1],
      [-1, 0],
      [-1, 1],
      [0, 1],
      [-1, -1],
      [0, -1]
    ];
    this.isChecked === false;
    this.isCheckMated == false;
  }

  createElement() {
    super.createElement();
    this.pieceEl.classList.add("king");
  }

  isSameOrShorterMove(moveSet, move) {
    const [dxSet, dySet] = moveSet;
    const [dx, dy] = move;

    const sameDirection =
      (dxSet === 0 ? dx === 0 : Math.sign(dx) === Math.sign(dxSet)) &&
      (dySet === 0 ? dy === 0 : Math.sign(dy) === Math.sign(dySet)) &&
      (Math.abs(dx) === Math.abs(dy) || dx === 0 || dy === 0);

    const withinBounds =
      Math.abs(dx) <= Math.abs(dxSet) && Math.abs(dy) <= Math.abs(dySet);

    return sameDirection && withinBounds;
  }
}