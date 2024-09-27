import * as readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

type Slot = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L";
type Action = "saw" | "harvest";
type Color = "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white";

export class Awale {

    #gameBoard: Map<string, number> = new Map([
        ["A", 4],
        ["B", 4],
        ["C", 4],
        ["D", 4],
        ["E", 4],
        ["F", 4],
        ["G", 40],
        ["H", 40],
        ["I", 40],
        ["J", 40],
        ["K", 40],
        ["L", 40]
    ]);

    #sides: Record<string, Slot[]> = {
        upperBoard: ["A", "B", "C", "D", "E", "F"],
        lowerBoard: ["G", "H", "I", "J", "K", "L"]
    }

    #players = new Map();

    #turnCount = 0;
    #turnArray: string[];

    constructor() {

        // Random attribution of starting player
        let roleArray = ["upperPlayer", "lowerPlayer"];

        const rndNum = Math.floor(Math.random() * 10);
        if (rndNum % 2 == 0) {
            roleArray = roleArray.reverse();
        }
        this.#turnArray = roleArray;
    }

    public async play() {

        // Clear the console + set upper left cursor
        process.stdout.write("\x1b[2J");
        process.stdout.write("\x1b[H");

        console.info("- --===== \x1b[37mAwale Game\x1b[0m =====-- -");
        console.info();

        await this.#definePlayers();

        this.#display();

        while (true) {

            const playerInput: Slot = await this.#playerMove();
            const currentPlayer = this.#getCurrentPlayer();

            if (!currentPlayer.getBoard()?.includes(playerInput)) {
                this.#display();

                this.#deletePrevLine(2);

                // Check Quit command
                if (playerInput as string === "Q") {
                    console.info("Exiting the game. Hope you had fun!");
                    break;
                }

                console.error(`\x1b[31m'${playerInput}\x1b[0m' -> is not a valid entry. `);
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
        console.info();

        rl.close();
        process.exit();
    }

    async #definePlayers() {
        const upperPlayer = await this.#askPlayerName("upper");
        this.#players.set("upperPlayer", new Player(upperPlayer));
        this.#players.get("upperPlayer").setBoard(this.#sides.upperBoard);

        const lowerPlayer = await this.#askPlayerName("lower");
        this.#players.set("lowerPlayer", new Player(lowerPlayer));
        this.#players.get("lowerPlayer").setBoard(this.#sides.lowerBoard);
    }

    #askPlayerName(side: "upper" | "lower") {
        return new Promise((resolve, reject) => {
            rl.question(`Choose a player name for the \x1b[33m${side}\x1b[0m board: `, (answer) => {
                resolve(answer.trim());
            });
        }) as unknown as string;
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

    #display(slotToUpdate?: Slot): void {

        // Clear the console + set upper left cursor
        console.log('\x1b[2J');
        console.log('\x1b[H');

        this.#rulesDisplay();
        this.#boardDisplay(slotToUpdate);
    }

    #rulesDisplay(): void {
        // Rules
        console.info(`- --===== ${this.#colorize("Awale Rules", "white")} =====-- -`);
        console.info();
        console.info("\x1b[35m¤\x1b[0m Each player chooses a \x1b[34mnon empty\x1b[0m slot to distribute the seeds \r\n inside following a counter-clockwise pattern.");
        console.info();
        console.info(`\x1b[35m¤\x1b[0m You have to choose a slot that belongs to you: \r\n - ${this.#players.get("upperPlayer")?.getName()}: A-B-C-D-E-F \r\n - ${this.#players.get("lowerPlayer")?.getName()}: G-H-I-J-K-L`);
        console.info();
        console.info("\x1b[35m¤\x1b[0m When the \x1b[34mfinishing slot\x1b[0m of the distribution cycle has \x1b[34m1-2 seeds\x1b[0m \r\n and is in the adversary board, you \x1b[34mcollect\x1b[0m all the seeds in a \r\n clockwise pattern \x1b[34muntil\x1b[0m finding a slot of at least \x1b[34m4 seeds\x1b[0m.");
        console.info();
        console.info("\x1b[35m¤\x1b[0m At anytime, type '\x1b[31mQ\x1b[0m' to \x1b[31mexit\x1b[0m the game.");
        console.info();
        console.info();
    }

    #boardDisplay(slotToUpdate?: Slot): void {

        this.#players.forEach((player) => {
            player.displayScore();
        })
        console.info();

        // Getting seeds state in upper/lower board
        const upperState = this.#sides.upperBoard.map((el) => {
            const value = this.#gameBoard.get(el);
            if (value?.toString().length == 1) return "\x1b[33m " + value + "\x1b[0m"

            return value
        });
        const lowerState = this.#sides.lowerBoard.map((el) => {
            const value = this.#gameBoard.get(el);
            if (value?.toString().length == 1) return "\x1b[33m " + value + "\x1b[0m"

            return value
        });

        const upperBoardColored = this.#sides.upperBoard.map((el) => {

            return el == slotToUpdate ? this.#colorize(" " + el, "blue") : " " + el;
        });
        const lowerBoardColored = this.#sides.lowerBoard.map((el) => {
            return el == slotToUpdate ? this.#colorize(" " + el, "blue") : " " + el;
        })

        console.info("\x1b[37m===== BOARD =====\x1b[0m");
        // console.info(...this.#sides.upperBoard.map((el) => " " + el));
        console.info(...upperBoardColored);
        console.info(...upperState);
        console.info(...lowerState);
        console.info(...lowerBoardColored);
        console.info("\x1b[37m=================\x1b[0m");
        console.info();
        console.info();
        console.info();
        console.info();
    }

    #colorize(element: string, color: Color): string {

        const colors = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"]
        return `\x1b[3${colors.indexOf(color)}m` + element + "\x1b[0m"
    }

    #deletePrevLine(num: number): void {

        for (let i = 0; i < num; i++) {
            process.stdout.write('\x1b[1A\x1b[2K');
        }
    }

    #isGameOver(): boolean {
        // Is the board empty ?
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

            this.#deletePrevLine(2);

            console.error(`\x1b[31m${slot}\x1b[0m is an empty slot!`);
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

            this.#deletePrevLine(3)

            console.info(
                `Player ${player.getName()} saw on slot \x1b[33m${slot}\x1b[0m.`
            );
            console.info(`/!\\ \x1b[35mHARVEST TIME\x1b[0m on slot ${lastSlotKey} /!\\`);

        } else {
            this.#display(slot);

            this.#deletePrevLine(2);

            console.info(
                `Player ${player.getName()} saw on slot \x1b[33m${slot}\x1b[0m.`
            );
        }

        this.#turnCount++;

        console.info();
        return true
    }

    #harvest(slot: Slot, player: Player): void {

        const harvestOrder = this.#getTurnOrderFrom(slot, "harvest");

        for (const slot of harvestOrder) {
            if (this.#gameBoard.get(slot)! > 3) {
                break;
            }

            player.addPoints(this.#gameBoard.get(slot) ?? 0);
            this.#gameBoard.set(slot, 0);
        }
    }

    #getCurrentPlayer(): Player {
        const playerRole = this.#turnArray[this.#turnCount % 2];
        return this.#players.get(playerRole)!;
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
        this.#name = '\x1b[32m' + name + '\x1b[0m';
    }

    public addPoints(num: number) {
        this.#score += num;
    }

    public displayScore(): void {
        console.info(`${this.#name} has \x1b[33m${this.#score}\x1b[0m point${this.#score ? 's' : ''}!`);
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
