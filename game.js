import {Board} from './board.js';
import {Piece} from '/piece.js';

class Game {
  constructor() {
    this.whitePieces = [];
    this.chessBoard = new Board(this);
    console.log(`Location of piece is ${this.whitePieces[0].location}`);
    this.pieceSelected = null;
    this.moveComplete = false;

    this.startGame();
    

  }

  startGame() {

  }

  addWhitePiece(pieceObj) {
    this.whitePieces.push(pieceObj);
  }

}

const game = new Game();