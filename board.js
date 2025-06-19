import {Cell} from './cell.js';
import {Piece} from './piece.js';
import {Pawn} from './pawn.js';
import {Rook} from './rook.js';
import {Bishop} from './bishop.js';
import {Knight} from './knight.js';
import {Queen} from './queen.js';
import {King} from './king.js';

export class Board {
  constructor(game, cellArray) {
    this.game = game;

    this.board = document.querySelector("#board");
    this.overlay = document.querySelector("#overlay");
    this.board.width = 800;
    this.board.height = 800;
    this.cellSize = this.board.width / 8;

    this.cells = [];
    this.drawBoard();
    this.setBoard();
  }

  drawBoard() {
    this.square = this.board.getContext("2d");
    for (let r = 1; r <= 8; r++) {
      for (let c = 1; c <= 8; c++) {
        const col = colToLetter(c);
        const row = r;

        const cell = new Cell(col, row, this.game);
        this.cells.push(cell);
        this.overlay.appendChild(cell.cellEl);

        const x = (c - 1) * this.cellSize;
        const y = (r - 1) * this.cellSize;

        cell.cellEl.style.left = `${x}px`;
        cell.cellEl.style.top = `${y}px`;

        const fillColor = (r + c) % 2 === 0 ? "AntiqueWhite" : "Peru";
        this.square.fillStyle = fillColor;
        this.square.fillRect(x, y, this.cellSize, this.cellSize);
      }
    }
  }

  setBoard() {
    for (let i = 0; i < 4; i++) {
      let cellPos = i;
      if (i > 1) {
        cellPos = this.cells.length - i;
      } else {
        cellPos = i;
      }

      const cell = this.cells[cellPos];
      
      const piece = new Queen(this.game, cell);
      cell.cellEl.appendChild(piece.pieceEl);
      cell.setValue(piece);
      if (i % 2 == 0) {
        piece.assignColor("white");
        console.log('white');
      } else {
        piece.assignColor("black");
        console.log('black')
      }
    }
  }

  getCell(position) {
    for (const cell of this.cells) {
        if (cell.position == position) {
            return cell;
        }
    }
  }
}

function colToLetter(num) {
  if (num >= 1 && num <= 8) {
    return String.fromCharCode(64 + num);
  }
  return undefined;
}