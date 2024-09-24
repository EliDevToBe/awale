import * as readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

type Slot = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L";
type Action = "saw" | "harvest";

class Awale {

    #gameBoard: Map<string, number> = new Map([
        ["A", 4],
        ["B", 4],
        ["C", 1],
        ["D", 4],
        ["E", 4],
        ["F", 4],
        ["G", 4],
        ["H", 4],
        ["I", 1],
        ["J", 4],
        ["K", 4],
        ["L", 4]
    ]);

    #sides: Record<string, Slot[]> = {
        upperBoard: ["A", "B", "C", "D", "E", "F"],
        lowerBoard: ["G", "H", "I", "J", "K", "L"]
    }

    #turnCount = 0;
    #turnArray: string[];

    constructor(upperPlayer: Player, lowerPlayer: Player) {
        upperPlayer.setBoard(this.#sides.upperBoard);
        lowerPlayer.setBoard(this.#sides.lowerBoard);

        let array = [upperPlayer.getName(), lowerPlayer.getName()];

        // Random attribution of starting player
        const rndNum = Math.floor(Math.random() * 10);
        if (rndNum % 2 == 0) {
            array = array.reverse();
        }
        this.#turnArray = array;

        console.info(`It's your turn ${this.#turnArray[0]}!`);

        this.display();
    }

    public display(): void {
        // Affichage plateau dans console

        const upperState = this.#sides.upperBoard.map((el) => this.#gameBoard.get(el));
        const lowerState = this.#sides.lowerBoard.map((el) => this.#gameBoard.get(el));

        console.info("== BOARD ==");
        console.info(...this.#sides.upperBoard);
        console.info(...upperState);
        console.info(...lowerState);
        console.info(...this.#sides.lowerBoard);
        console.info("===========");
    }

    public isEmpty(): boolean {
        // le plateau est-il vide ?
        for (const [key, _] of this.#gameBoard) {
            if (key) {
                console.info("Is the board empty?", false);
                return false
            }
        }
        console.info("Is the board empty?", true);
        return true
    }

    public saw(slot: Slot, player: Player): void {

        if (!this.#isTurnPlayer(player)) {
            console.error(`It's not your turn ${player.getName()}!`);
            return
        }

        console.info(`Player ${player.getName()} saw on slot ${slot}.`)

        // check if authorized board side
        if (!player.getBoard()?.includes(slot)) {
            console.error(`${slot} is not your on board side ${player.getName()}!`);
            console.error(`Available slots are ${player.getBoard()?.join("/")}.`);
            return
        }

        let seedsNumber = this.#gameBoard.get(slot);

        if (!seedsNumber) {
            console.error("It's an empty slot!");
            return
        }
        this.#gameBoard.set(slot, 0);

        const sawOrder = this.#getTurnOrderFrom(slot, "saw");

        // Actual seed distribution
        for (let i = 0; i < seedsNumber; i++) {

            const key = sawOrder[i % sawOrder.length];
            let value = this.#gameBoard.get(key)!;
            // if (value == undefined) continue

            this.#gameBoard.set(key, value += 1);
        }

        // Check for last slot and possible Harvest
        const lastSlotKey = sawOrder[(seedsNumber - 1) % sawOrder.length];
        const lastSlotValue = this.#gameBoard.get(lastSlotKey)! - 1;

        if (lastSlotValue <= 2
            && lastSlotValue > 0
            && !player.getBoard()?.includes(lastSlotKey)
        ) {
            this.#harvest(lastSlotKey, player);
            player.displayScore();
        }

        // Final display after end of turn
        this.display();
        this.#turnCount++
    }

    #harvest(slot: Slot, player: Player): void {
        console.info(`/!\\ HARVEST TIME on slot ${slot} /!\\`)

        const harvestOrder = this.#getTurnOrderFrom(slot, "harvest");
        // console.log("harvest", harvestOrder);

        for (const slot of harvestOrder) {
            if (this.#gameBoard.get(slot)! > 3) {
                console.info(`Stopped harvesting at ${slot}, holding ${this.#gameBoard.get(slot)} seeds.`)
                return
            }

            player.addPoints(this.#gameBoard.get(slot) ?? 0);
            this.#gameBoard.set(slot, 0);
        }
    }

    #isTurnPlayer(player: Player) {
        if (this.#turnArray[this.#turnCount % 2] === player.getName()) {
            return true
        }
        return false
    }

    #getTurnOrderFrom(slot: Slot, action: Action): Slot[] {
        const turnOrder: Slot[] = ["F", "E", "D", "C", "B", "A", "G", "H", "I", "J", "K", "L"];
        const sawOrder = [
            ...turnOrder.slice(turnOrder.indexOf(slot) + 1),
            ...turnOrder.slice(0, turnOrder.indexOf(slot) + 1)];

        if (action == "saw") {
            return sawOrder
        } else {
            return sawOrder.reverse();
        }
    }

    #resetGame(): void {
        for (const [key, _] of this.#gameBoard) {
            this.#gameBoard.set(key, 4);
        }
        console.info("Game has been reseted");
    }
}

class Player {

    #name: string;
    #score: number = 0;
    #board: Slot[] | null = null;

    constructor(name: string) {
        console.info(`Welcome ${name}!`);
        this.#name = name;
    }

    public addPoints(num: number) {
        this.#score += num;
    }

    public displayScore(): void {
        console.info(`${this.#name} has ${this.#score} point${this.#score ? 's' : ''}!`);
    }

    public getName() {
        return this.#name;
    }

    public setBoard(board: Slot[]) {
        this.#board = board;
    }
    public getBoard() {
        return this.#board;
    }
}

const laure = new Player("Laure");
const patrick = new Player("Patrick");

const game = new Awale(laure, patrick);

// game.display();
game.saw("L", patrick);
game.saw("B", laure);
// game.display();
// game.saw("C", laure);
// game.saw("F")
// game.display();
// game.saw("E")


// game.display();