export class Player {
    constructor(game, color) {
        this.color = color;
        this.game = game;
        this.changeStatus("playing");
    }

    changeStatus(status) {
        this.gameStatus = status;
        console.log(this.gameStatus);
    }

    getColor() {
        return this.color;
    }
}