export class Piece {
    constructor(game, loc) {
        this.color = "white";
        this.moveSet = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        this.pieceEl = null;
        this.createElement();
        this.location = loc;
        this.selected = false;

        this.game = game;
        this.game.whitePieces.push(this);
    }

    createElement() {
        this.pieceEl = document.createElement("div");
        this.pieceEl.setAttribute("class", "piece");
        this.pieceEl.addEventListener('click', () => this.selectPiece())
        this.pieceEl.pieceObj = this;
        console.log("new Piece has been created");
    }

    setLocation(newLoc) {
        this.location = newLoc;
    }

    getLocation() {
        return this.location;
    }

    selectPiece() {
        this.selected = !this.selected;
        console.log(this.selected);
        if (this.selected) {
            this.pieceEl.style.borderColor = 'green';
            console.log('piece has been selected');
            this.game.pieceSelected = this;
            console.log(this.game.pieceSelected);
        } else {
            this.pieceEl.style.borderColor = "red";
            console.log("piece has been unselected");
            this.game.pieceSelected = null;
            console.log(this.game.pieceSelected);
        }

    }

    movePiece(newCell) {
        const newHPos = letterToCol(newCell.position[0]);
        console.log(newHPos);
        const newVPos = parseInt(newCell.position[1]);
        console.log(newVPos);
        const oldCell = this.pieceEl.parentElement.cellObj;

        const hLoc = letterToCol(oldCell.position[0]);
        console.log(hLoc);
        const vLoc = parseInt(oldCell.position[1]);
        console.log(vLoc);
        
        const move = [newHPos - hLoc, newVPos - vLoc];

        console.log(move);

        if (this.moveSet.some((m) => m[0] === move[0] && m[1] === move[1])) {
           console.log(`piece can move to ${newCell.position}`);
           const cell = newCell;
           const parentCellEl = this.pieceEl.parentNode;
           parentCellEl.cellObj.setValid();
           parentCellEl.removeChild(this.pieceEl);

           cell.cellEl.appendChild(this.pieceEl);
           cell.setValue(this);
           this.game.pieceSelected = null;
           this.setLocation(cell.position);
           this.selectPiece();
        } else {
            console.log('select an allowed cell');
        }

        // const cell = newCell;
        // const parentCellEl = this.pieceEl.parentNode;
        // parentCellEl.cellObj.setValid();
        // parentCellEl.removeChild(this.pieceEl);

        // cell.cellEl.appendChild(this.pieceEl);
        // cell.setValue(this);
        // this.game.pieceSelected = null;
        // this.setLocation(cell.position);
        // this.selectPiece();
    }
}

function letterToCol(letter) {
  const upper = letter.toUpperCase();
  if (upper >= "A" && upper <= "H") {
    return upper.charCodeAt(0) - 64;
  }
  return undefined;
}
  