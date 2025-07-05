import {Piece} from './piece.js';
import { Rook } from "./rook.js";
import { Bishop } from "./bishop.js";
import { Knight } from "./knight.js";
import { Queen } from "./queen.js";

export class Pawn extends Piece {
  constructor(game, loc) {
    super(game, loc);
    this.captureMoveSet;
    this.passiveMoves = [];
  }

  onFirstMove() {
    this.moveSet.pop();
  }

  assignColor(color) {
    this.color = color;
    if (this.color == "white") {
      this.pieceEl.classList.add("white");
      // this.game.addWhitePiece(this);
    } else {
      this.pieceEl.classList.add("black");
      // this.game.addBlackPiece(this);
    }
    this.assignMoves(color);
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

    const isLegal = this.moveSet.some((ms) => this.isSameOrShorterMove(ms, move));

    const isPossible = this.legalMoves.some((cell) => cell.position === newCell.position)

    const isCaptureLegal = this.captureMoveSet.some((ms) =>
      this.isSameOrShorterMove(ms, move)
    );

    console.log(`${move} is legal: ${isLegal}`);

      

    if (this.game.checkedKing && this.game.checkedKing.getColor() == this.color) {
      if (isLegal && isPossible && this.isPathClear(newCell, move)) {
        this.moveCount++;

        if (this.moveCount === 1) {
          this.onFirstMove?.();
        }

        if (yf == 1 || yf == 8) {
          console.log("promoting and moving");
          this.promotion(newCell, oldCell);
          return true;
        }

        this.movePiece(newCell, oldCell);
        return true;
      } else if (isCaptureLegal && this.isCaptureClear(newCell)) {
        this.moveCount++;

        if (yf == 1 || yf == 8) {
          console.log("promoting and capturing");
          this.promotion(newCell, oldCell);
          return true;
        }

        this.movePiece(newCell, oldCell);
      } else {
        console.log("select an allowed cell");
        return false;
      }
    } else {
      if (isLegal && this.isPathClear(newCell, move)) {
        this.moveCount++;

        if (this.moveCount === 1) {
          this.onFirstMove?.();
        }

        if (yf == 1 || yf == 8) {
          console.log("promoting and moving");
          this.promotion(newCell, oldCell);
          return true;
        }

        this.movePiece(newCell, oldCell);
        return true;
      } else if (isCaptureLegal && this.isCaptureClear(newCell)) {
        this.moveCount++;

        if (yf == 1 || yf == 8) {
          console.log("promoting and capturing");
          this.promotion(newCell, oldCell);
          return true;
        }

        this.movePiece(newCell, oldCell);
      } else {
        console.log("select an allowed cell");
        return false;
      }
    }
  }

  checkAllPaths() {
    if (this.isCaptured) return;

    this.possibleMoves.length = 0;
    this.passiveMoves.length = 0;
    for (const move of [...this.moveSet, ...this.captureMoveSet]) {
      // console.log(`checking path for move: ${move}`);
      const startCell = this.pieceEl.parentElement.cellObj;

      let x = this.letterToCol(startCell.position[0]);
      let y = parseInt(startCell.position[1]);

      const dx = this.letterToCol(startCell.position[0]) + move[0];
      // console.log(`dx: ${dx}`);
      const dy = parseInt(startCell.position[1]) + move[1];
      // console.log(`dy: ${dy}`);

      let currentCell;

      while (x !== dx || y !== dy) {
        if (x < dx && y === dy) {
          x++;
        } else if (x > dx && y === dy) {
          x--;
        } else if (x < dx && y < dy) {
          x++;
          y++;
        } else if (x < dx && y > dy) {
          x++;
          y--;
        } else if (x === dx && y < dy) {
          y++;
        } else if (x === dx && y > dy) {
          y--;
        } else if (x > dx && y > dy) {
          x--;
          y--;
        } else if (x > dx && y < dy) {
          x--;
          y++;
        }

        if (x > 8 || y > 8 || x < 1 || y < 1) {
          break;
        }

        // console.log(`x: ${x}\ny: ${y}`);
        currentCell = this.game.chessBoard.getCell(
          `${this.colToLetter(x)}${y}`
        );

        if (this.moveSet.includes(move)) {
          if (currentCell.isValid()) {
            this.passiveMoves.push(currentCell);
          } 
        } else if (this.captureMoveSet.includes(move)) {
          if (currentCell.getValue() && currentCell.getValue().getColor() !== this.color) {
            this.possibleMoves.push(currentCell);
          } 
        }
      }
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
    } else if (targetPiece && targetPiece.getColor() !== this.color) {
      console.log("capturing");
      this.capturePiece(newCell);
      return true;
    } else if (targetPiece && targetPiece.getColor() === this.color) {
      console.log("cannot capture piece of same color");
      return false;
    }

    console.log("path is clear");
    return true;
  }

  promotion(newCell, oldCell) {
    console.log(`pawn can be promoted at ${newCell.position}`);
    const cell = newCell;
    const newPiece = new Queen(this.game, newCell);
    this.selectPiece();

    oldCell.cellEl.style.backgroundColor = "";
    oldCell.setValid();
    oldCell.cellEl.removeChild(this.pieceEl);
    let idxPiece;
    this.color == "white"
      ? (idxPiece = this.game.whitePieces.indexOf(this))
      : (idxPiece = this.game.blackPieces.indexOf(this));

    this.color == "white"
      ? this.game.whitePieces.splice(idxPiece, 1)
      : this.game.blackPieces.splice(idxPiece, 1);

    cell.cellEl.appendChild(newPiece.pieceEl);
    newPiece.assignColor(this.color);
    cell.setValue(newPiece);
    cell.cellEl.style.backgroundColor = "";
    this.game.pieceSelected = null;
    newPiece.currentCell = cell;
    newPiece.setLocation(cell.position);
    this.updateAllPaths();
    newPiece.game.onMoveComplete();
  }

  highlightCells() {
    for (const cell of this.passiveMoves) {
      cell.highlight();
    }
    for (const cell of this.possibleMoves) {
      if (!cell.isValid() && cell.getValue().getColor() !== this.color) {
        cell.highlight();
      }
      
    }
  }

  unhighlightCells() {
    super.unhighlightCells();
    for (const cell of this.passiveMoves) {
      cell.unhighlight();
    }
  }
}