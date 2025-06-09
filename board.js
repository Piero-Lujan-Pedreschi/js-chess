import {Cell} from './cell.js';
import {Piece} from './piece.js';

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
        const cell = this.cells[0];
        const piece = new Piece(this.game, cell.position);
        cell.cellEl.appendChild(piece.pieceEl);
        cell.setValue(piece);
        
    }

    movePiece(pieceObj) {

    }
}

function colToLetter(num) {
  if (num >= 1 && num <= 8) {
    return String.fromCharCode(64 + num);
  }
  return undefined;
}