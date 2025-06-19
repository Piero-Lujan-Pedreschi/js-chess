import {Board} from './board.js';
import {Piece} from '/piece.js';

class Game {
  constructor() {
    this.whitePieces = [];
    this.whiteTakenPieces = [];
    this.blackPieces = [];
    this.blackTakenPieces = [];
    this.array = [];
    this.chessBoard = new Board(this);
    this.pieceSelected = null;
    this.moveComplete = false;
    this.resolveTurn = null;
    this.playerTurn = 'white';
    this.playerWin = '';

    this.startGame();
    

  }

  async startGame() {
    while (true) {
      console.log(`player turn: ${this.playerTurn}`);
      await this.awaitTurn();

      this.switchPlayer();
    }
  }

  addWhitePiece(piece) {
    this.whitePieces.push(piece);
  }

  addBlackPiece(piece) {
    this.blackPieces.push(piece);
  }

  awaitTurn() {
    return new Promise((resolve) => {
      this.resolveTurn = resolve;
    });
  }

  onMoveComplete() {
    this.moveComplete = true;

    if (this.resolveTurn) {
      this.resolveTurn();
      this.resolveTurn = null;
    }
  }

  switchPlayer() {
    console.log(`${this.playerTurn} has completed their turn`);
    this.playerTurn = this.playerTurn === "white" ? "black" : "white";
    this.moveComplete = false;
  }

}

const game = new Game();