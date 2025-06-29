import {Piece} from './piece.js';
import {Rook} from './rook.js';

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
      [0, -1],
      [2, 0]
    ];
    this.isChecked === false;
    this.isCheckMated == false;

    // this.checkAllPaths(this.moveSet);
  }

  createElement() {
    super.createElement();
    this.pieceEl.classList.add("king");
  }


  onFirstMove() {
    return this.moveSet.pop();
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

    console.log(`${move} is legal: ${isLegal}`);

   if (isLegal && this.isPathClear(newCell, move)) {
      this.moveCount++;

      if (this.moveCount === 1) {
        
        const castleMove = this.onFirstMove?.();
        if (castleMove[0] == move[0] && castleMove[1] == move[1]) {
          var rook = this.checkCastle(xf, yf);
          this.castle(newCell, oldCell, rook);
          console.log("castle complete");
          return true;
        }
      }
      this.movePiece(newCell, oldCell);
      return true;
    } else {
      console.log("select an allowed cell");
      return false;
    }
  }

  movePiece(newCell, oldCell) {
    console.log(`piece can move to ${newCell.position}`);
    const cell = newCell;

    oldCell.cellEl.style.backgroundColor = "";
    oldCell.setValid();
    oldCell.cellEl.removeChild(this.pieceEl);

    cell.cellEl.appendChild(this.pieceEl);
    cell.setValue(this);
    this.game.pieceSelected = null;
    this.currentCell = cell;
    this.setLocation(cell.position);
    this.selectPiece();
    this.game.onMoveComplete();
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

      if (x === newXPos && y === newYPos) break;

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

  checkCastle(x, y) {
    let pieceOneOver = this.game.chessBoard
    .getCell(`${this.colToLetter(x + 1)}${y}`)
    .getValue();
    if (pieceOneOver instanceof Rook) {
      if (pieceOneOver.getMoveCount() < 1) {
        // this.castle();
        console.log("can castle");
        return pieceOneOver;
      }
    }
  }

  castle(newCell, oldCell, rook) {
    console.log(`king can be castled at ${newCell.position}`);
    const cell = newCell;

    oldCell.cellEl.style.backgroundColor = "";
    oldCell.setValid();
    oldCell.cellEl.removeChild(this.pieceEl);

    cell.cellEl.appendChild(this.pieceEl);
    cell.setValue(this);
    this.game.pieceSelected = null;
    this.currentCell = cell;
    this.setLocation(cell.position);

    const rookOldCell = rook.currentCell;
    rookOldCell.setValid();
    rookOldCell.cellEl.removeChild(rook.pieceEl);

    const colIndex = this.letterToCol(oldCell.position[0]); 
    const newColLetter = this.colToLetter(colIndex + 1);
    const row = oldCell.position[1]; 

    const rookNewCell = this.game.chessBoard.getCell(`${newColLetter}${row}`);

    rookNewCell.cellEl.appendChild(rook.pieceEl);
    rookNewCell.setValue(rook);
    rook.currentCell = rookNewCell;
    rook.setLocation(rookNewCell.position);


    this.selectPiece();
    this.game.onMoveComplete();
  }
}