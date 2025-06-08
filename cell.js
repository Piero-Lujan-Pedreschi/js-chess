

export class Cell {
    constructor(horizontalValue, verticalValue) {
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
    }

    setInvalid() {
        this.valid = false;
    }

    setValue(newPieceObj) {
        this.value = newPieceObj;
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
        this.cellEl.addEventListener('click', () => this.handleClick());
        // console.log(this.cellEl);
    }

    handleClick() {
        console.log(`Cell ${this.position} was clicked`);
    }
}
