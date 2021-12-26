const secureRandom = require("secure-random");
const crypto = require("crypto");
class Game {
    constructor(moves) {
        this.moves = moves;
        this.player = new Player(this.moves);
        this.computer = new Computer(this.moves);
        this.helper = new HelpTable(this.moves);
    }
    start() {
        this.computer.randomMove();
        console.log(`Available moves:\n`);
    }
    check(str1, str2) {
        let sub = this.moves.slice(0);
        let index = sub.indexOf(str1);
        let arr = sub.slice(index);
        arr = arr.concat(sub.splice(0, index));
        if (str1 == str2) return "draw";
        if (arr.indexOf(str2) <= arr.length / 2) return "win";
        else return "lose";
    }
    winner() {
        let result = this.check(
            this.player.currectmove,
            this.computer.currectmove
        );
        if (result == "win") {
            console.log("Congratulations! You won! :)");
        } else if (result == "lose") {
            console.log("Oh, you lose :(");
        } else {
            console.log("It's a draw :|");
        }
    }
}

class Player {
    constructor(moves) {
        this.playerMoves = moves;
        this.currentMove;
    }
    playerMove() {}
}

class Computer {
    constructor(moves) {
        this.computerMoves = moves;
        this.steps = {};
        this.currentMove;
        this.currentKey;
    }
    randomMove() {
        let randIndex = (Math.random() * this.computerMoves.length).round() - 1;
        let key = secureRandom.randomBuffer(32).toString("hex");
        this.currentKey = key;
        this.currentMove = this.computerMoves[randIndex];
        let HMAC = crypto
            .createHmac("sha256", this.currentKey)
            .update(this.currentMove)
            .digest("hex");
        this.steps[this.currentKey] = this.currentMove;
        console.log(`HMAC:\n${HMAC}`);
    }
}

class HelpTable {
    constructor(moves) {
        this.moves = moves;
    }
    makeTable() {
        let table = [];
        for (let x = 0; x < this.moves.length + 1; x++) {
            table[x] = [];
            table[0][0] = "№ move";
            for (let y = 0; y < this.moves.length + 1; y++) {
                if (y != 0 && x == 0) table[x][y] = this.moves[y - 1];
                else if (x != 0 && y == 0) table[x][y] = this.moves[x - 1];
                else if (y != 0 && x != 0) {
                    table[x][y] = app.check(table[0][y], table[x][0]);
                }
            }
        }
        this.table = table;
    }
    showTable() {
        let str = "";
        for (let y = 0; y == 0; y++) {
            for (let x = 0; x < this.table.length; x++) {
                str += `\t${this.table[y][x]}\t|`;
            }
        }
        let hor = "";
        for (let i = 0; i < str.length; i++) {
            hor += "-";
        }
        let consoleTable = `${hor}\n`;
        for (let y = 0; y < this.table.length; y++) {
            consoleTable += "|";
            for (let x = 0; x < this.table.length; x++) {
                consoleTable += `${this.table[x][y]}\t|`;
            }
            consoleTable += `\n${hor}\n`;
        }
        console.log(consoleTable);
    }
}

let steps = ["paper", "stone", "knees", "rock", "lizard"]
    .join(",")
    .toLowerCase()
    .split(","); // вместо массива наддо поменять на process.argv.slice(2) !!!
steps = Array.from(new Set(steps));
let app;
if (steps.length < 3) {
    console.log(
        "Enter more 2 of possible different moves!\nExample: rock paper scissors lizard spock"
    );
} else if (steps.length % 2 == 0) {
    console.log(
        "Enter an odd number of possible different moves!\nExample: rock paper scissors lizard spock"
    );
} else {
    app = new Game(steps);
    app.helper.makeTable();
}

//["paper", "stone", "knees", "rock", "lizard"]
//["a","b","c","d","d","e","f","c"]
// a b c d d e f c
//paper stone knees rock lizard stone knees
