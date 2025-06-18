import {Piece} from './piece.js';

export class Knight extends Piece {
  constructor(game, loc) {
    super(game, loc);
    this.moveSet = [
      [1, 2],
      [1, -2],
      [2, 1],
      [2, -1],
      [-1, 2],
      [-1, -2],
      [-2, 1],
      [-2, -1],
    ];
  }

  createElement() {
    super.createElement(); // call base setup
    this.pieceEl.classList.add("knight"); // add specific class
  }

  movePiece(newCell) {
    const xf = this.letterToCol(newCell.position[0]);
    const yf = parseInt(newCell.position[1]);

    const oldCell = this.currentCell;

    const xi = this.letterToCol(oldCell.position[0]);
    const yi = parseInt(oldCell.position[1]);

    const dx = xf - xi;
    const dy = yf - yi;

    const move = [dx, dy];

    const isLegal = this.moveSet.some((ms) =>
      ms[0] === move[0] && ms[1] === move[1]
    );

    console.log(`${move} is legal: ${isLegal}`);

    if (isLegal) {
      this.moveCount++;

      if (this.moveCount === 1) {
        this.onFirstMove?.();
      }
      console.log(`piece can move to ${newCell.position}`);
      const cell = newCell;
      const parentCellEl = this.pieceEl.parentNode;
      parentCellEl.cellObj.setValid();
      parentCellEl.removeChild(this.pieceEl);

      cell.cellEl.appendChild(this.pieceEl);
      cell.setValue(this);
      this.game.pieceSelected = null;
      this.currentCell = cell;
      this.setLocation(cell.position);
      this.selectPiece();
      this.game.onMoveComplete();
      return true;
    } else {
      console.log("select an allowed cell");
      return false;
    }
  }
}