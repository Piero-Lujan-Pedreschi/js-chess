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

    const isLegal = this.moveSet.some(
      (ms) => ms[0] === move[0] && ms[1] === move[1]
    );

    console.log(`${move} is legal: ${isLegal}`);

    if (isLegal && this.checkDestinationCell(newCell)) {
      this.moveCount++;

      if (this.moveCount === 1) {
        this.onFirstMove?.();
      }
      console.log(`piece can move to ${newCell.position}`);
      const cell = newCell;
      const parentCellEl = this.pieceEl.parentNode;
      parentCellEl.cellObj.setValid();
      parentCellEl.style.backgroundColor = "";
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

  checkDestinationCell(newCell) {
    const path = [];

    const newXPos = this.letterToCol(newCell.position[0]);
    const newYPos = parseInt(newCell.position[1]);

    const startCell = this.pieceEl.parentElement.cellObj;

    let x = this.letterToCol(startCell.position[0]);
    let y = parseInt(startCell.position[1]);

    // while (x !== newXPos || y !== newYPos) {
    //   if (x < newXPos && y === newYPos) {
    //     x++;
    //   } else if (x > newXPos && y === newYPos) {
    //     x--;
    //   } else if (x < newXPos && y < newYPos) {
    //     x++;
    //     y++;
    //   } else if (x < newXPos && y > newYPos) {
    //     x++;
    //     y--;
    //   } else if (x === newXPos && y < newYPos) {
    //     y++;
    //   } else if (x === newXPos && y > newYPos) {
    //     y--;
    //   } else if (x > newXPos && y > newYPos) {
    //     x--;
    //     y--;
    //   } else if (x > newXPos && y < newYPos) {
    //     x--;
    //     y++;
    //   }

    //   if (x === newXPos && y === newYPos) break;

    //   path.push(`${`${this.colToLetter(x)}${y}`}`);
    //   console.log(path);
    //   // console.log(`cell ${`${colToLetter(x)}${y}`} is along path`);
    //   if (
    //     !this.game.chessBoard.getCell(`${this.colToLetter(x)}${y}`).isValid()
    //   ) {
    //     console.log(`path is not clear to ${newCell.position}`);
    //     return false;
    //   }
    // }

    const targetPiece = newCell.getValue();
    console.log(`piece on target = `);
    console.log(targetPiece);
    if (targetPiece && targetPiece.getColor() !== this.color) {
      console.log("can replace piece");
      const capturedPiece = this.removePiece(newCell);
      if (capturedPiece) {
        (this.color === "white"
          ? this.game.whiteTakenPieces
          : this.game.blackTakenPieces
        ).push(capturedPiece);
        console.log(`white taken pieces: ${this.game.whiteTakenPieces}`);
        console.log(`black taken pieces: ${this.game.blackTakenPieces}`);
      }
    } else if (targetPiece && targetPiece.getColor() === this.color) {
      console.log("cannot capture piece of same color");
      return false;
    }

    console.log("path is clear");
    return true;
  }
}