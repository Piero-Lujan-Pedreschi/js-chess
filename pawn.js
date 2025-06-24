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
        [1, -1],
        [-1, -1],
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

  checkMovePiece(newCell) {
    const xf = this.letterToCol(newCell.position[0]);
    const yf = parseInt(newCell.position[1]);

    const oldCell = this.currentCell;

    const xi = this.letterToCol(oldCell.position[0]);
    const yi = parseInt(oldCell.position[1]);

    const dx = xf - xi;
    const dy = yf - yi;

    const move = [dx, dy];

    const isLegal = this.moveSet.some((ms) =>
      this.isSameOrShorterMove(ms, move)
    );

    const isCaptureLegal = this.captureMoveSet.some((ms) =>
      this.isSameOrShorterMove(ms, move)
    );

    console.log(`${move} is legal: ${isLegal}`);

    if (isLegal && this.isPathClear(newCell, move)) {
      this.moveCount++;

      if (this.moveCount === 1) {
        this.onFirstMove?.();
      }

      this.movePiece(newCell, oldCell);
      return true;
    } else if (isCaptureLegal && this.isCaptureClear(newCell)) {
      this.movePiece(newCell, oldCell);
    } else {
      console.log("select an allowed cell");
      return false;
    }
  }

  isPathClear(newCell) {
    const path = [];

    const newXPos = this.letterToCol(newCell.position[0]);
    const newYPos = parseInt(newCell.position[1]);

    const startCell = this.pieceEl.parentElement.cellObj;

    let x = this.letterToCol(startCell.position[0]);
    let y = parseInt(startCell.position[1]);

    while (x !== newXPos || y !== newYPos) {
      if (x < newXPos && y === newYPos) {
        x++;
      } else if (x > newXPos && y === newYPos) {
        x--;
      } else if (x < newXPos && y < newYPos) {
        x++;
        y++;
      } else if (x < newXPos && y > newYPos) {
        x++;
        y--;
      } else if (x === newXPos && y < newYPos) {
        y++;
      } else if (x === newXPos && y > newYPos) {
        y--;
      } else if (x > newXPos && y > newYPos) {
        x--;
        y--;
      } else if (x > newXPos && y < newYPos) {
        x--;
        y++;
      }

      // if (x === newXPos && y === newYPos) break;

      path.push(`${`${this.colToLetter(x)}${y}`}`);
      console.log(path);
      // console.log(`cell ${`${colToLetter(x)}${y}`} is along path`);

      const cellValid = this.game.chessBoard
        .getCell(`${this.colToLetter(x)}${y}`)
        .isValid();

      if (!cellValid) {
        console.log(`path is not clear to ${newCell.position}`);
        return false;
      }
    }

    console.log("path is clear");
    return true;
  }

  isCaptureClear(newCell) {
    const targetPiece = newCell.getValue();
    console.log(`piece on target = `);
    console.log(targetPiece);

    if (targetPiece == null) {
      console.log("must capture a piece");
      return false;
    } else if(targetPiece && targetPiece.getColor() !== this.color) {
      this.capturePiece(newCell);
    } else if (targetPiece && targetPiece.getColor() === this.color) {
      console.log("cannot capture piece of same color");
      return false;
    }

    console.log("path is clear");
    return true;
  }
}