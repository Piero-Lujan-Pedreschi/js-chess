export class Piece {
    constructor(game, loc) {
        this.color = "white";
        this.moveSet = [[2, 0], [0, 2], [-2, 0], [0, -2]];
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
        const newVPos = parseInt(newCell.position[1]);
        
        const oldCell = this.pieceEl.parentElement.cellObj;

        const hLoc = letterToCol(oldCell.position[0]);
        const vLoc = parseInt(oldCell.position[1]);

        const dx = newHPos - hLoc;
        const dy = newVPos - vLoc;
        console.log(`dx = ${dx} dy = ${dy}`);
        
        const move = [dx, dy];

        const isLegal = this.moveSet.some((ms) =>
          isSameOrShorterMove(ms, move)
        );


        console.log(`${move} is legal: ${isLegal}`);

        if (isLegal) {
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
    }
}

function letterToCol(letter) {
  const upper = letter.toUpperCase();
  if (upper >= "A" && upper <= "H") {
    return upper.charCodeAt(0) - 64;
  }
  return undefined;
}
  
function isSameOrShorterMove(moveSet, move) {
  const [dxSet, dySet] = moveSet;
  const [dx, dy] = move;

  // Make sure direction is the same
  const sameDirection =
    (dxSet === 0 ? dx === 0 : Math.sign(dx) === Math.sign(dxSet)) &&
    (dySet === 0 ? dy === 0 : Math.sign(dy) === Math.sign(dySet));

  // Magnitude check
  const withinBounds =
    Math.abs(dx) <= Math.abs(dxSet) && Math.abs(dy) <= Math.abs(dySet);

  return sameDirection && withinBounds;
}