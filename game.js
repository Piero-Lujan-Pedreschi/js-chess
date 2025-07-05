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

  // async startGame() {
  //   this.chessBoard.setBoard();
  //   while (true) {
  //     console.log("player turn: ");
  //     console.log(this.playerTurn);
  //     await this.awaitTurn();
  //     this.checkedKing = this.checkIfOpponentIsChecked(
  //       this.playerTurn.getColor()
  //     );

  //     if (this.checkedKing) {
  //       console.log(this.checkedKing);
  //       console.log("is checked");
  //       if (this.checkedKing.isCheckmated()) {
  //         console.log(this.checkedKing, " is checkmated");
  //       } else {
  //         this.filterMovesToResolveCheck(this.checkedKing);
  //       }

  //     }
  //     this.switchPlayer();
  //   }
  // }

  async startGame() {
    this.chessBoard.setBoard();

    while (true) {
      const color = this.playerTurn.getColor();
      const king = this.getKing(color); // current player's own king

      if (king === this.checkedKing) {
        console.log(this.checkedKing, "is in check");

        if (king.isCheckmated()) {
          console.log(`${color} is checkmated`);
          break; // or handle game end
        }
        this.filterMovesToResolveCheck(king);

      }

      await this.awaitTurn();

      for (const piece of this.whitePieces.concat(this.blackPieces)) {
        piece.legalMoves = [];
        if (piece instanceof Pawn) {
          piece.legalPassiveMoves = [];
        }
      }
      

      // After the move, check if opponent is now checked
      this.checkedKing = this.checkIfOpponentIsChecked(
        this.playerTurn.getColor()
      );

      this.switchPlayer();
    }
  }

  getKing(color) {
    const pieces = color === "white" ? this.whitePieces : this.blackPieces;
    return pieces.find((piece) => piece instanceof King);
  }

  filterMovesToResolveCheck(checkedKing) {
    if (!checkedKing.isInCheck()) return;

    

    const myPieces =
      checkedKing.getColor() === "white" ? this.whitePieces : this.blackPieces;

    for (const piece of myPieces) {
      const legalMoves = [];
      piece.legalMoves.length = 0;

      for (const cell of piece.possibleMoves) {
        const occupant = cell.getValue();
        if (occupant && occupant.getColor() === piece.getColor()) continue;

        const simData = this.simulateMove(piece, cell);
        piece.updateAllPaths();
        const stillInCheck = checkedKing.isInCheck();
        this.undoSimulateMove(piece, simData);
        piece.updateAllPaths();

        if (!stillInCheck) legalMoves.push(cell);
      }

      if (piece instanceof Pawn) {
        const legalPassiveMoves = [];

        for (const cell of piece.passiveMoves) {
          const occupant = cell.getValue();
          if (occupant && occupant.getColor() === piece.getColor()) continue;

          const simData = this.simulateMove(piece, cell);
          piece.updateAllPaths();
          const stillInCheck = checkedKing.isInCheck();
          this.undoSimulateMove(piece, simData);
          piece.updateAllPaths();

          if (!stillInCheck) legalPassiveMoves.push(cell);
        }

        // piece.passiveMoves.length = 0;
        piece.legalMoves.push(...legalPassiveMoves);
      }

      
      // console.log(
      //   "Before filtering:",
      //   piece.possibleMoves.map((c) => c.position)
      // );
      // if (piece instanceof Pawn) {
      //   console.log(
      //     "Passive moves before:",
      //     piece.passiveMoves.map((c) => c.position)
      //   );
      // }

      console.log(piece);
      console.log(
          "Before filtering:",
          piece.legalMoves.map((c) => c.position)
        );
      // piece.possibleMoves.length = 0;
      piece.legalMoves.push(...legalMoves);

      console.log(piece);
      console.log(
        "After filtering:",
        piece.legalMoves.map((c) => c.position)
      );
      // if (piece instanceof Pawn) {
      //   console.log(
      //     "Passive moves after:",
      //     piece.passiveMoves?.map((c) => c.position)
      //   );
      // }
    }
    console.log("finish filter");
  }

  addWhitePiece(piece) {
    this.whitePlayer;
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
      ? (opponentKing = this.blackPieces.find((piece) => piece instanceof King))
      : (opponentKing = this.whitePieces.find(
          (piece) => piece instanceof King
        ));

    for (const piece of playerPieces) {
      for (const pathCell of piece.possibleMoves) {
        if (pathCell.getValue() == opponentKing) {
          return opponentKing;
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
    this.playerTurn == this.whitePlayer
      ? (this.playerTurn = this.blackPlayer)
      : (this.playerTurn = this.whitePlayer);
    this.moveComplete = false;
  }

  simulateMove(piece, targetCell) {
    const originalCell = piece.currentCell;
    const capturedPiece = targetCell.getValue();

    const savedPieceMoves = [...piece.possibleMoves];
    const savedPiecePassiveMoves = piece.passiveMoves
      ? [...piece.passiveMoves]
      : null;

    let savedCapturedMoves = [];
    let savedCapturedPassive = [];

    if (capturedPiece) {
      capturedPiece.currentCell = null;
      savedCapturedMoves = [...capturedPiece.possibleMoves];
      capturedPiece.possibleMoves.length = 0;

      if (capturedPiece.passiveMoves)
        savedCapturedPassive = [...capturedPiece.passiveMoves];

      capturedPiece.isCaptured = true;
    }

    originalCell.setValue(null);
    targetCell.setValue(piece);
    piece.currentCell = targetCell;

    return {
      originalCell,
      targetCell,
      capturedPiece,
      savedCapturedMoves,
      savedCapturedPassive,
      savedPieceMoves,
      savedPiecePassiveMoves,
    };
  }

  undoSimulateMove(piece, simData) {
    const {
      originalCell,
      targetCell,
      capturedPiece,
      savedCapturedMoves,
      savedCapturedPassive,
      savedPieceMoves,
      savedPiecePassiveMoves,
    } = simData;

    // Remove piece from simulated cell
    targetCell.setValue(null);

    // Restore captured piece
    if (capturedPiece) {
      capturedPiece.currentCell = targetCell;
      targetCell.setValue(capturedPiece);
      capturedPiece.possibleMoves.length = 0;
      capturedPiece.possibleMoves.push(...savedCapturedMoves);

      if (capturedPiece.passiveMoves) {
        capturedPiece.passiveMoves.length = 0;
        capturedPiece.passiveMoves.push(...savedCapturedPassive);
      }

      capturedPiece.isCaptured = false;
    }

    // Move back the original piece
    originalCell.setValue(piece);
    piece.currentCell = originalCell;

    // Restore original piece's move lists
    piece.possibleMoves.length = 0;
    piece.possibleMoves.push(...savedPieceMoves);

    if (piece.passiveMoves && savedPiecePassiveMoves) {
      piece.passiveMoves.length = 0;
      piece.passiveMoves.push(...savedPiecePassiveMoves);
    }
  }
}

const game = new Game();