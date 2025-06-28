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
  }

  assignColor(color) {
    this.color = color;
    if (this.color == "white") {
      this.pieceEl.classList.add("white");
      this.game.addWhitePiece(this);
    } else {
      this.pieceEl.classList.add("black");
      this.game.addBlackPiece(this);
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
    if (this.game.playerTurn == this.color) {
      this.selected = !this.selected;
      // console.log(this.selected);
      if (this.selected) {
        cellEl.style.backgroundColor = "rgba(142, 240, 56, 0.41)";
        // console.log('piece has been selected');
        this.game.pieceSelected = this;
        // console.log(this.game.pieceSelected);
      } else {
        // console.log("piece has been unselected");
        cellEl.style.backgroundColor = "";
        this.game.pieceSelected = null;
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

    console.log(`${move} is legal: ${isLegal}`);

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

  movePiece(newCell, oldCell) {
    console.log(`piece can move to ${newCell.position}`);
    const cell = newCell;

    oldCell.cellEl.style.backgroundColor = "";
    oldCell.setValid();
    oldCell.cellEl.removeChild(this.pieceEl);

    cell.cellEl.appendChild(this.pieceEl);
    cell.setValue(this);
    this.game.pieceSelected = null;
    this.currentCell = cell;
    this.setLocation(cell.position);
    this.selectPiece();
    this.game.onMoveComplete();
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

  capturePiece(newCell) {
    console.log("can replace piece");
    const capturedPiece = this.removePiece(newCell);
    if (capturedPiece) {
      (this.color === "white"
        ? this.game.whiteTakenPieces
        : this.game.blackTakenPieces
      ).push(capturedPiece);
      console.log(`white taken pieces: ${this.game.whiteTakenPieces}`);
      console.log(`black taken pieces: ${this.game.blackTakenPieces}`);
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