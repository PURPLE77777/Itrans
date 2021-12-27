const secureRandom = require("secure-random");
const crypto = require("crypto");
const readlineSync = require("readline-sync");
const randomNumber = require("random-number");
class Game {
    constructor(moves) {
        this.moves = moves;
        this.player = new Player(this.moves);
        this.computer = new Computer(this.moves);
        this.helper = new HelpTable(this.moves);
    }
    start() {
        this.computer.randomMove();
        this.player.playerMove();
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
            this.player.currentMove,
            this.computer.currentMove
        );
        console.log(`Computer move: ${this.computer.currentMove}`);
        if (result == "win") {
            console.log(
                `Congratulations! You won! :)\nHMAC key:\n${this.computer.currentKey}\n`
            );
        } else if (result == "lose") {
            console.log(
                `Oh, you lose :(\nHMAC key:\n${this.computer.currentKey}\n`
            );
        } else if (result == "draw") {
            console.log(
                `It's a draw :|\nHMAC key:\n${this.computer.currentKey}\n`
            );
        }
        this.start();
    }
}
class Player {
    constructor(moves) {
        this.playerMoves = moves;
        this.currentMove;
    }
    playerMove() {
        let menu = "";
        for (let i = 0; i < this.playerMoves.length; i++) {
            menu += `${i + 1} - ${this.playerMoves[i]}\n`;
        }
        menu += "0 - exit\n? - help";
        console.log(menu);
        let move = readlineSync.question("Select an action: ");
        if (move == "0") console.log("Your move: exit\nBye-bye");
        else if (move == "?") {
            console.log(`Your move: help`);
            app.helper.showTable();
            this.playerMove();
        } else if (Number(move) <= this.playerMoves.length) {
            this.currentMove = this.playerMoves[Number(move) - 1];
            console.log(`Your move: ${this.currentMove}`);
            app.winner();
        } else {
            console.log(`Yout move: ${move}\nPlease, enter a correct move!`);
            this.playerMove();
        }
    }
}
class Computer {
    constructor(moves) {
        this.computerMoves = moves;
        this.steps = {};
        this.currentMove;
        this.currentKey;
    }
    randomMove() {
        let randIndex = randomNumber({
            min: 0,
            max: this.computerMoves.length - 1,
            integer: true,
        });
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
            table[0][0] = `move \u2193`;
            for (let y = 0; y < this.moves.length + 1; y++) {
                if (y != 0 && x == 0) table[x][y] = this.moves[y - 1];
                else if (x != 0 && y == 0) table[x][y] = this.moves[x - 1];
                else if (y != 0 && x != 0) {
                    table[x][y] = app.check(table[0][y], table[x][0]);
                }
            }
        }
        this.table = table;
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
        this.consoleTable = consoleTable;
    }
    showTable() {
        console.log(this.consoleTable);
    }
}
let steps = process.argv.slice(2).join(",").toLowerCase().split(",");
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
    app.start();
}
