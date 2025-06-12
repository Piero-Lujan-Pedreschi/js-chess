

export class Cell {
    constructor(horizontalValue, verticalValue, game) {
        this.game = game;

        this.position = `${horizontalValue}${verticalValue}`;
        this.value = null;
        this.valid = true;
        this.cellEl = null;
        this.createElement();
        // console.log(`Cell ${horizontalValue}${verticalValue} has been created`);
    }

    isValid() {
        return this.valid;
    }

    setValid() {
        this.valid = true;
        // console.log(`${this.position} is now valid`);
    }

    setInvalid() {
        this.valid = false;
        // console.log(`${this.position} is now invalid`);
    }

    setValue(newPieceObj) {
        this.value = newPieceObj;
        if (newPieceObj === null) {
            this.setValid();
        } else {
            this.setInvalid();
        }
    }


    getValue() {
        return this.value;
    }

    getPosition() {
        return this.position;
    }


    createElement() {
        this.cellEl = document.createElement("div");
        this.cellEl.setAttribute("class", "cell");
        this.cellEl.setAttribute('id', this.position);
        this.cellEl.textContent = `${this.position}`;
        this.cellEl.cellObj = this;
        this.cellEl.addEventListener('click', () => this.handleClick());
        // console.log(this.cellEl);
    }

    handleClick() {
        if (this.isValid() && this.game.pieceSelected) {
            this.game.pieceSelected.movePiece(this);
        } 
    }
}
