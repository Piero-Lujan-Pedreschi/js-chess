import { Player } from "./player.js";

export class Piece {
  constructor(game, cell) {
    this.currentCell = cell;
    this.color;
    this.moveSet;
    this.pieceEl = null;
    this.createElement();
    this.location = this.currentCell.position;
    this.selected = false;
    this.moveCount = 0;
    this.game = game;
    // this.checkAllPaths();
    this.possibleMoves = [];
    this.legalMoves = [];  //only use when king is checked
    this.isCaptured = false;
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
  }

  getColor() {
    return this.color;
  }

  getMoveCount() {
    return this.moveCount;
  }

  createElement() {
    this.pieceEl = document.createElement("div");
    this.pieceEl.setAttribute("class", "piece");
    this.pieceEl.addEventListener("click", () => {
      if (
        this === this.game.pieceSelected ||
        this.game.pieceSelected === null
      ) {
        this.selectPiece();
      } else {
        // console.log("please unselect selected piece");
      }
    });
    this.pieceEl.pieceObj = this;
    // console.log("new Piece has been created");
  }

  setLocation(newLoc) {
    this.location = newLoc;
  }

  getLocation() {
    return this.location;
  }

  selectPiece() {
    const cellEl = this.pieceEl.parentNode;
    if (this.game.playerTurn.getColor() == this.color) {
      this.selected = !this.selected;
      // console.log(this.selected);
      if (this.selected) {
        cellEl.style.backgroundColor = "rgba(142, 240, 56, 0.41)";
        console.log("piece has been selected");
        this.game.pieceSelected = this;
        // console.log(this.game.pieceSelected);
        this.checkAllPaths();
        this.highlightCells();
      } else {
        console.log("piece has been unselected");
        cellEl.style.backgroundColor = "";
        this.game.pieceSelected = null;
        this.unhighlightCells();
        // console.log(this.game.pieceSelected);
      }
    } else {
      console.log("please select a piece of your color");
    }
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

    const isPossible = this.legalMoves.some(
      (cell) => cell.position === newCell.position
    );

    console.log(`${move} is legal: ${isLegal}`);

    if (
      this.game.checkedKing &&
      this.game.checkedKing.getColor() == this.color
    ) {
      if (isLegal && isPossible && this.isPathClear(newCell, move)) {
        this.moveCount++;

        if (this.moveCount === 1) {
          this.onFirstMove?.();
        }

        this.movePiece(newCell, oldCell);
        return true;
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

        this.movePiece(newCell, oldCell);
        return true;
      } else {
        console.log("select an allowed cell");
        return false;
      }
    }
  }

  movePiece(newCell, oldCell) {
    console.log(`piece can move to ${newCell.position}`);
    const cell = newCell;
    this.selectPiece();

    oldCell.cellEl.style.backgroundColor = "";
    oldCell.setValid();
    oldCell.cellEl.removeChild(this.pieceEl);

    cell.cellEl.appendChild(this.pieceEl);
    cell.setValue(this);
    this.game.pieceSelected = null;
    this.currentCell = cell;
    this.setLocation(cell.position);
    this.updateAllPaths();
    this.game.onMoveComplete();
  }

  updateAllPaths() {
    for (const piece of this.game.whitePieces) {
      // console.log(piece);
      piece.checkAllPaths();
      // console.log(piece);
      // console.log(piece.possibleMoves);
    }
    for (const piece of this.game.blackPieces) {
      // console.log(piece);
      piece.checkAllPaths();
    }
  }

  checkAllPaths() {
    if (this.isCaptured) return;

    this.possibleMoves.length = 0;
    for (const move of this.moveSet) {
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
        const piece = currentCell.getValue();

        if (piece === null) {
          this.possibleMoves.push(currentCell); // empty square
        } else if (piece.getColor() !== this.color) {
          this.possibleMoves.push(currentCell); // enemy piece (can capture)
          break; // can't go past captured piece
        } else {
          break; // blocked by ally
        }
      }
    }
  }

  highlightCells() {
    for (const cell of this.possibleMoves) {
      cell.highlight();
    }
  }

  unhighlightCells() {
    for (const cell of this.possibleMoves) {
      cell.unhighlight();
    }
  }

  checkIfOpponentIsChecked() {
    let playerPieces;
    let opponentKing;
    this.color == "white"
      ? (playerPieces = this.game.whitePieces)
      : (playerPieces = this.game.blackPieces);
    this.color == "white"
      ? (opponentKing = this.game.blackPieces.find(
          (piece) => piece instanceof King
        ))
      : (opponentKing = this.game.whitePieces.find(
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

  checkForCheck() {}

  capturePiece(newCell) {
    console.log("can replace piece");

    const capturedPiece = this.removePiece(newCell);
    if (capturedPiece) {
      const isWhite = this.color === "white";

      // Remove from active pieces
      const activeArray = isWhite
        ? this.game.blackPieces
        : this.game.whitePieces;

      const takenArray = isWhite
        ? this.game.whiteTakenPieces
        : this.game.blackTakenPieces;

      // Remove from active list
      const index = activeArray.indexOf(capturedPiece);
      if (index !== -1) {
        activeArray.splice(index, 1);
      }

      // Push to taken list
      takenArray.push(capturedPiece);
      capturedPiece.reset();
      capturedPiece.isCaptured = true;

      console.log(`white taken pieces:`, this.game.whiteTakenPieces);
      console.log(`black taken pieces:`, this.game.blackTakenPieces);
    }
  }

  removePiece(newCell) {
    const piece = newCell.getValue();
    if (!piece) {
      return null;
    }

    newCell.cellEl.removeChild(piece.pieceEl);
    newCell.setValue(null); // Clear the piece from the board
    return piece;
  }

  isSameOrShorterMove(moveSet, move) {
    const [dxSet, dySet] = moveSet;
    const [dx, dy] = move;

    const sameDirection =
      (dxSet === 0 ? dx === 0 : Math.sign(dx) === Math.sign(dxSet)) &&
      (dySet === 0 ? dy === 0 : Math.sign(dy) === Math.sign(dySet));

    const withinBounds =
      Math.abs(dx) <= Math.abs(dxSet) && Math.abs(dy) <= Math.abs(dySet);

    return sameDirection && withinBounds;
  }

  reset() {
    this.currentCell = null;
    this.pieceEl = null;
    this.location = null;
    this.selected = false;
    this.moveCount = 0;
  }

  letterToCol(letter) {
    const upper = letter.toUpperCase();
    if (upper >= "A" && upper <= "H") {
      return upper.charCodeAt(0) - 64;
    }
    return undefined;
  }

  colToLetter(num) {
    if (num >= 1 && num <= 8) {
      return String.fromCharCode(64 + num);
    }
    return undefined;
  }
}
