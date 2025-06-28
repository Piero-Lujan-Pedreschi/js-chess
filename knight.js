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

  checkMovePiece(newCell) {
    const xf = this.letterToCol(newCell.position[0]);
    const yf = parseInt(newCell.position[1]);

    const oldCell = this.currentCell;

    const xi = this.letterToCol(oldCell.position[0]);
    const yi = parseInt(oldCell.position[1]);

    const dx = xf - xi;
    const dy = yf - yi;

    const move = [dx, dy];

    const isLegal = this.moveSet.some(
      (ms) => ms[0] === move[0] && ms[1] === move[1]
    );

    console.log(`${move} is legal: ${isLegal}`);

    if (isLegal && this.checkDestinationCell(newCell)) {
      this.moveCount++;

      if (this.moveCount === 1) {
        this.onFirstMove?.();
      }
      this.movePiece(newCell, oldCell)
      return true;
    } else {
      console.log("select an allowed cell");
      return false;
    }
  }

  checkDestinationCell(newCell) {
    const path = [];

    const newXPos = this.letterToCol(newCell.position[0]);
    const newYPos = parseInt(newCell.position[1]);

    const startCell = this.pieceEl.parentElement.cellObj;

    let x = this.letterToCol(startCell.position[0]);
    let y = parseInt(startCell.position[1]);

    const targetPiece = newCell.getValue();
    console.log(`piece on target = `);
    console.log(targetPiece);
    if (targetPiece && targetPiece.getColor() !== this.color) {
      this.capturePiece(newCell);
    } else if (targetPiece && targetPiece.getColor() === this.color) {
      console.log("cannot capture piece of same color");
      return false;
    }

    console.log("path is clear");
    return true;
  }

}