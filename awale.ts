import * as readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

type Slot = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L";
type Action = "saw" | "harvest";

export class Awale {

    #gameBoard: Map<string, number> = new Map([
        ["A", 4],
        ["B", 4],
        ["C", 4],
        ["D", 4],
        ["E", 4],
        ["F", 4],
        ["G", 4],
        ["H", 4],
        ["I", 4],
        ["J", 4],
        ["K", 4],
        ["L", 4]
    ]);

    #sides: Record<string, Slot[]> = {
        upperBoard: ["A", "B", "C", "D", "E", "F"],
        lowerBoard: ["G", "H", "I", "J", "K", "L"]
    }

    #players: Map<string, Player>

    #turnCount = 0;
    #turnArray: string[];

    constructor(upperPlayer: Player, lowerPlayer: Player) {

        // Setting each player with their side of gameboard
        upperPlayer.setBoard(this.#sides.upperBoard);
        lowerPlayer.setBoard(this.#sides.lowerBoard);

        this.#players = new Map([
            [upperPlayer.getName(), upperPlayer],
            [lowerPlayer.getName(), lowerPlayer]
        ]);

        // Random attribution of starting player
        let array = [upperPlayer.getName(), lowerPlayer.getName()];

        const rndNum = Math.floor(Math.random() * 10);
        if (rndNum % 2 == 0) {
            array = array.reverse();
        }
        this.#turnArray = array;
    }

    public async play() {

        // Welcome and starting promt
        this.#players.forEach((player) => {
            player.welcome();
        })

        this.#display();

        while (true) {

            const playerInput: Slot = await this.#playerMove();
            const currentPlayer = this.#getCurrentPlayer();

            if (!currentPlayer.getBoard()?.includes(playerInput)) {
                this.#display();
                console.error(`'${playerInput}' -> is not a valid entry. `);
                console.info();
                continue;
            }

            this.#saw(playerInput, currentPlayer);

            if (this.#isGameOver()) {
                break
            }
        }

        this.#players.forEach((player) => {
            player.displayScore();
        })

        rl.close();
        process.exit();
    }

    #playerMove() {
        const currentPlayer = this.#getCurrentPlayer();
        console.info(`It's your turn ${currentPlayer.getName()}!`);

        const playerSlots = currentPlayer.getBoard();

        return new Promise((resolve, reject) => {
            rl.question(`Choose a slot to saw (${playerSlots?.join("-")}): `, (answer) => {
                resolve(answer.trim().toUpperCase());
            });
        }) as unknown as Slot
    }

    #display(): void {

        // Clear the console + set upper left cursor
        console.log('\x1b[2J');
        console.log('\x1b[H');

        this.#rulesDisplay();
        this.#boardDisplay();
    }

    #rulesDisplay(): void {
        // Rules
        console.info();
        console.info("- --===== Awale Rules =====-- -");
        console.info();
        console.info("¤ Each player chooses a non empty slot to distribute the seeds \r\n inside following a counter-clockwise pattern.");
        console.info();
        console.info("¤ You have to choose a slot that belongs to you: \r\n - Upper Player: A-B-C-D-E-F \r\n - Lower Player: G-H-I-J-K-L");
        console.info();
        console.info("¤ When the finishing slot of the distribution cycle has 1-2 seeds \r\n and is in the adversary board, you collect all the seeds in a \r\n clockwise pattern until finding a slot of at least 4 seeds.")
        console.info();
        console.info("¤ At anytime, type 'Q' to exit the game.")
        console.info();
        console.info();
    }

    #boardDisplay(): void {

        this.#players.forEach((player) => {
            player.displayScore();
        })
        console.info();

        // Affichage plateau dans console
        const upperState = this.#sides.upperBoard.map((el) => this.#gameBoard.get(el));
        const lowerState = this.#sides.lowerBoard.map((el) => this.#gameBoard.get(el));

        console.info("== BOARD ==");
        console.info(...this.#sides.upperBoard);
        console.info(...upperState);
        console.info(...lowerState);
        console.info(...this.#sides.lowerBoard);
        console.info("===========");
        console.info();
        console.info();
    }

    #isGameOver(): boolean {
        // le plateau est-il vide ?
        for (const [key, _] of this.#gameBoard) {
            if (this.#gameBoard.get(key) != 0) {
                return false
            }
        }
        console.info("G A M E  O V E R");
        console.info("The board is finally empty!");
        return true
    }

    #saw(slot: Slot, player: Player): boolean {

        let seedsNumber = this.#gameBoard.get(slot);

        if (!seedsNumber) {
            this.#display();
            console.error(`${slot} is an empty slot!`);
            console.info();

            return false
        }
        this.#gameBoard.set(slot, 0);

        const sawOrder = this.#getTurnOrderFrom(slot, "saw");

        // Actual seed distribution
        for (let i = 0; i < seedsNumber; i++) {

            const key = sawOrder[i % sawOrder.length];
            let value = this.#gameBoard.get(key)!;

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

            this.#display();

            console.info(`Player ${player.getName()} saw on slot ${slot}.`);
            console.info(`/!\\ HARVEST TIME on slot ${lastSlotKey} /!\\`)
        } else {
            this.#display();
            console.info(`Player ${player.getName()} saw on slot ${slot}.`);
        }

        this.#turnCount++;

        console.info();
        return true
    }

    #harvest(slot: Slot, player: Player): void {

        const harvestOrder = this.#getTurnOrderFrom(slot, "harvest");

        for (const slot of harvestOrder) {
            if (this.#gameBoard.get(slot)! > 3) {
                // console.info(`Stopped harvesting at ${slot}, holding ${this.#gameBoard.get(slot)} seeds.`)
                break;
            }

            player.addPoints(this.#gameBoard.get(slot) ?? 0);
            this.#gameBoard.set(slot, 0);
        }
    }

    #getCurrentPlayer(): Player {
        const playerName = this.#turnArray[this.#turnCount % 2];
        return this.#players.get(playerName)!;
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

}

export class Player {

    #name: string;
    #score: number = 0;
    #board: Slot[] | null = null;

    constructor(name: string) {
        this.#name = name;
    }

    public welcome(): void {
        console.info(`Welcome ${this.#name}!`);
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
