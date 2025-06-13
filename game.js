import {Board} from './board.js';
import {Piece} from '/piece.js';

class Game {
  constructor() {
    this.whitePieces = [];
    this.blackPieces = [];
    this.chessBoard = new Board(this);
    this.pieceSelected = null;
    this.moveComplete = false;

    this.startGame();
    

  }

  startGame() {

  }

  addWhitePiece(piece) {
    this.whitePieces.push(piece);
  }

  addBlackPiece(piece) {
    this.blackPieces.push(piece);
  }

}

const game = new Game();