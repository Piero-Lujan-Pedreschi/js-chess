import {Piece} from './piece.js';

export class Pawn extends Piece {
    constructor(game, loc) {
        super(game, loc);
        this.moveSet = [
        [0, 1],
        [0, 2],
        ];
        this.moveCount = 0;
    }


    movePiece(newCell) {
        const newHPos = letterToCol(newCell.position[0]);
        const newVPos = parseInt(newCell.position[1]);

        const oldCell = this.pieceEl.parentElement.cellObj;

        const hLoc = letterToCol(oldCell.position[0]);
        const vLoc = parseInt(oldCell.position[1]);

        const dx = newHPos - hLoc;
        const dy = newVPos - vLoc;

        const move = [dx, dy];

        const isLegal = this.moveSet.some((ms) => isSameOrShorterMove(ms, move));

        console.log(`${move} is legal: ${isLegal}`);

        if (isLegal && this.isPathClear(newCell, move)) {
            this.moveCount++;
            if (this.moveCount === 1) {
                this.moveSet.pop();
            }

            console.log(this.moveSet);

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
            console.log(`ending moves count = ${this.moveCount}`);
            return true;
        } else {
            console.log("select an allowed cell");
        }
        return false;
    }

}

function letterToCol(letter) {
  const upper = letter.toUpperCase();
  if (upper >= "A" && upper <= "H") {
    return upper.charCodeAt(0) - 64;
  }
  return undefined;
}

function colToLetter(num) {
  if (num >= 1 && num <= 8) {
    return String.fromCharCode(64 + num);
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