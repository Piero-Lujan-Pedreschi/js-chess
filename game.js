import {Board} from './board.js';
import {Piece} from './piece.js';
import { King } from "./king.js";
import { Pawn } from "./pawn.js";
import {Player} from "./player.js";

class Game {
  constructor() {
    this.whitePieces = [];
    this.whiteTakenPieces = [];
    this.whitePlayer = new Player(this, "white");
    this.blackPieces = [];
    this.blackTakenPieces = [];
    this.blackPlayer = new Player(this, "black");
    this.array = [];
    this.chessBoard = new Board(this);
    this.pieceSelected = null;
    this.moveComplete = false;
    this.resolveTurn = null;
    this.playerTurn = this.whitePlayer;
    this.playerWin = "";

    this.checkedKing = null;

    this.startGame();
  }

  async startGame() {
    this.chessBoard.setBoard();
    while (true) {
      console.log("player turn: ");
      console.log(this.playerTurn);
      await this.awaitTurn();
      this.checkedKing = this.checkIfOpponentIsChecked(this.playerTurn.getColor());

      if (this.checkedKing) {
        console.log(this.checkedKing);
        console.log("is checked");
        this.checkedKing.isCheckmated();
      }
      this.switchPlayer();
    }
  }

  addWhitePiece(piece) {
    this.whitePlayer
    this.whitePieces.push(piece);
  }

  addBlackPiece(piece) {
    this.blackPieces.push(piece);
  }

  checkIfOpponentIsChecked(playerColor) {
    let playerPieces;
    let opponentKing;
    playerColor == "white"
      ? (playerPieces = this.whitePieces)
      : (playerPieces = this.blackPieces);
      playerColor == "white"
        ? (opponentKing = this.blackPieces.find(
            (piece) => piece instanceof King
          ))
        : (opponentKing = this.whitePieces.find(
            (piece) => piece instanceof King
          ));

    for (const piece of playerPieces) {
      if (piece instanceof Pawn) {
        for (const pathCell of piece.possibleCaptureMoves) {
          if (pathCell.getValue() == opponentKing) {
            return opponentKing;
          }
        }
      } else {
        for (const pathCell of piece.possibleMoves) {
          if (pathCell.getValue() == opponentKing) {
            return opponentKing;
          }
        }
      }
    }

    
    return null;
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
    console.log(this.playerTurn);
    console.log("has completed their turn");
    this.playerTurn == this.whitePlayer ? this.playerTurn = this.blackPlayer : this.playerTurn = this.whitePlayer;
    this.moveComplete = false;
  }
}

const game = new Game();