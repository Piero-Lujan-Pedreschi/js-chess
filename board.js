import {Cell} from './cell.js';
import {Piece} from './piece.js';
import {Pawn} from './pawn.js';
import {Rook} from './rook.js';
import {Bishop} from './bishop.js';
import {Knight} from './knight.js';
import {Queen} from './queen.js';
import {King} from './king.js';
import {Player} from "./player.js";

export class Board {
  constructor(game) {
    this.game = game;

    this.board = document.querySelector("#board");
    this.overlay = document.querySelector("#overlay");
    this.board.width = 800;
    this.board.height = 800;
    this.cellSize = this.board.width / 8;

    this.cells = Array.from({ length: 8 }, () => Array(8).fill(null));
    this.drawBoard();
    // this.setBoard();
  }

  getCell(position) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.cells[i][j].position == position) {
          return this.cells[i][j];
        }
      }
    }
  }

  drawBoard() {
    this.square = this.board.getContext("2d");
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const col = colToLetter(c + 1);
        const row = 8 - r;

        const cell = new Cell(col, row, this.game);
        this.cells[r][c] = cell;
        this.overlay.appendChild(cell.cellEl);

        const x = c * this.cellSize;
        const y = r * this.cellSize;

        cell.cellEl.style.left = `${x}px`;
        cell.cellEl.style.top = `${y}px`;

        const fillColor = (r + c) % 2 === 0 ? "AntiqueWhite" : "Peru";
        this.square.fillStyle = fillColor;
        this.square.fillRect(x, y, this.cellSize, this.cellSize);
      }
    }
  }

  setBoard() {
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 8; j++) {
        const cell = this.cells[i][j];
        let piece;
        if (i == 0 && (j == 0 || j == 7)) {
          piece = new Rook(this.game, cell);
        } else if (i == 0 && (j == 1 || j == 6)) {
          piece = new Knight(this.game, cell);
        } else if (i == 0 && (j == 2 || j == 5)) {
          piece = new Bishop(this.game, cell);
        } else if (i == 0 && j == 4) {
          piece = new King(this.game, cell);
        } else if (i == 0 && j == 3) {
          piece = new Queen(this.game, cell);
        } else if (i == 1) {
          piece = new Pawn(this.game, cell);
        }

        cell.cellEl.appendChild(piece.pieceEl);
        cell.setValue(piece);
        piece.assignColor("black");
        this.game.addBlackPiece(piece);
      }
    }

    for (let i = 6; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const cell = this.cells[i][j];
        let piece;
        if (i == 7 && (j == 0 || j == 7)) {
          piece = new Rook(this.game, cell);
        } else if (i == 7 && (j == 1 || j == 6)) {
          piece = new Knight(this.game, cell);
        } else if (i == 7 && (j == 2 || j == 5)) {
          piece = new Bishop(this.game, cell);
        } else if (i == 7 && j == 4) {
          piece = new King(this.game, cell);
        } else if (i == 7 && j == 3) {
          piece = new Queen(this.game, cell);
        } else if (i == 6) {
          piece = new Pawn(this.game, cell);
        }

        cell.cellEl.appendChild(piece.pieceEl);
        cell.setValue(piece);
        piece.assignColor("white");
        this.game.addWhitePiece(piece);
      }
    }

    for (const piece of [...this.game.whitePieces, ...this.game.blackPieces,]) {
      piece.checkAllPaths();
    }
  }
}

function colToLetter(num) {
  if (num >= 1 && num <= 8) {
    return String.fromCharCode(64 + num);
  }
  return undefined;
}