#!/usr/bin/env node
import * as readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

type Slot = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L";
type Action = "saw" | "harvest";
type Color = "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white";

class Awale {

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

        // Clear the console
        process.stdout.write('\x1bc');

        console.info(`- --===== ${this.#colorize("Awale Game", "white")} =====-- -`);
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

                // Check secret token for switching turn
                if (playerInput as string === "secret5yzdirjinqaorq0ox1tf383nb3xr") {
                    console.info();
                    console.info();
                    continue;
                }

                console.error(`\x1b[31m'${playerInput.length > 10 ? playerInput.slice(0, 7) + "..." : playerInput}\x1b[0m' -> is not a valid entry. `);
                console.info();
                continue;
            }

            this.#saw(playerInput, currentPlayer);

            if (this.#isGameOver()) {
                break;
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
        this.#players.set("upperPlayer", new Player(upperPlayer, this.#sides.upperBoard));

        const lowerPlayer = await this.#askPlayerName("lower");
        this.#players.set("lowerPlayer", new Player(lowerPlayer, this.#sides.lowerBoard));
    }

    #askPlayerName(side: "upper" | "lower") {
        return new Promise((resolve, _) => {
            rl.question(`Choose a player name for the \x1b[33m${side}\x1b[0m board: `, (answer) => {
                resolve(answer.length < 20 ? answer.trim() : answer.trim().slice(0, 16) + "...");
            });
        }) as unknown as string;
    }

    #playerMove() {
        const currentPlayer = this.#getCurrentPlayer();

        if (this.#isSideEmpty(currentPlayer.getBoard())) {

            let suspensPoints = "";

            console.info(`It's your turn \x1b[1m${currentPlayer.getName()}\x1b[0m!`);
            console.info(`Oh no! You have no moves left! ${this.#colorize("Switching turn", "white", true)}`)

            return new Promise((resolve, _) => {

                const suspensId = setInterval(() => {
                    suspensPoints += ".";

                    this.#deletePrevLine(1);
                    console.info(`Oh no! You have no moves left! ${this.#colorize("Switching turn" + suspensPoints, "white", true)}`)
                }, 500);

                setTimeout(() => {
                    clearInterval(suspensId);
                    this.#turnCount++;

                    resolve("secret5yzdirjinqaorq0ox1tf383nb3xr");

                }, 2000)
            }) as unknown as Slot

        } else {

            console.info(`It's your turn \x1b[1m${currentPlayer.getName()}\x1b[0m!`);

            const playerSlots = currentPlayer.getBoard();

            return new Promise((resolve, reject) => {
                rl.question(`Choose a slot to saw (${playerSlots?.join("-")}): `, (answer) => {
                    resolve(answer.trim().toUpperCase());
                });
            }) as unknown as Slot
        }
    }

    #display(slotToUpdate?: Slot[]): void {

        // Clear the console
        process.stdout.write('\x1bc');

        this.#displayRules();
        this.#displayPlayersScore();
        this.#displayBoard(slotToUpdate);
    }

    #displayRules(): void {
        // Rules
        console.info(`- --===== ${this.#colorize("Awale Rules", "white")} =====-- -`);
        console.info();
        console.info(`${this.#colorize("¤", "magenta", true)} Each player chooses a \x1b[34mnon empty\x1b[0m slot to distribute the seeds \r\n inside following a counter-clockwise pattern.`);
        console.info();
        console.info(`${this.#colorize("¤", "magenta", true)} You have to choose a slot on your side: \r\n - ${this.#players.get("upperPlayer")?.getName()}: A-B-C-D-E-F \r\n - ${this.#players.get("lowerPlayer")?.getName()}: G-H-I-J-K-L`);
        console.info();
        console.info(`${this.#colorize("¤", "magenta", true)} When the \x1b[34mfinishing slot\x1b[0m of the distribution cycle has \x1b[34m1-2 seeds\x1b[0m and \r\n is in the adversary board, you \x1b[34mcollect\x1b[0m all the seeds in a clockwise \r\n pattern \x1b[34muntil\x1b[0m finding a slot of at least \x1b[34m4 seeds\x1b[0m or one of yours.`);
        console.info();
        console.info(`${this.#colorize("¤", "magenta", true)} At anytime, type '\x1b[31mQ\x1b[0m' to \x1b[31mexit\x1b[0m the game.`);
        console.info();
        console.info();
    }

    #displayPlayersScore(): void {

        const uP = this.#players.get("upperPlayer");
        const lP = this.#players.get("lowerPlayer");

        if (uP.getScore() == lP.getScore()) {
            uP.setWin(false);
            lP.setWin(false);
        }
        else if (uP.getScore() < lP.getScore()) {
            uP.setWin(false);
            lP.setWin(true);
        } else {
            uP.setWin(true);
            lP.setWin(false);
        }

        this.#players.forEach((player: Player) => {
            player.displayScore();
        })
        console.info();
    }

    #displayBoard(slotToUpdate?: Slot[]): void {

        // Getting seeds state in upper/lower board
        const upperState = this.#sides.upperBoard.map((el) => {
            const value = this.#gameBoard.get(el);

            if (value == 0) return this.#colorize(" " + value, "red");
            if (value?.toString().length == 1) return this.#colorize(" " + value, "yellow");

            return value
        });
        const lowerState = this.#sides.lowerBoard.map((el) => {
            const value = this.#gameBoard.get(el);

            if (value == 0) return this.#colorize(" " + value, "red");
            if (value?.toString().length == 1) return this.#colorize(" " + value, "yellow");

            return value
        });

        // Colorize player move + Harvest move
        const upperBoardColored = this.#sides.upperBoard.map((el) => {
            return slotToUpdate?.indexOf(el) == 1 ? this.#colorize(" " + el, "magenta", true)
                : slotToUpdate?.indexOf(el) == 0 ? this.#colorize(" " + el, "cyan", true)
                    : " " + el;
        });
        const lowerBoardColored = this.#sides.lowerBoard.map((el) => {
            return slotToUpdate?.indexOf(el) == 1 ? this.#colorize(" " + el, "magenta", true)
                : slotToUpdate?.indexOf(el) == 0 ? this.#colorize(" " + el, "cyan", true)
                    : " " + el;
        })

        // Final display
        console.info("\x1b[37m===== BOARD =====\x1b[0m");
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

    #colorize(element: string, color: Color, bold: boolean = false): string {

        const colors = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"]
        const params = colors.indexOf(color) + (bold ? ";1" : "")

        return `\x1b[3${params}m` + element + "\x1b[0m"
    }

    #deletePrevLine(num: number): void {

        for (let i = 0; i < num; i++) {
            // Move cursor 1 line up and clear
            process.stdout.write('\x1b[1A\x1b[2K');
        }
    }

    #isGameOver(): boolean {

        if (this.#isSideEmpty(this.#sides.upperBoard)
            && this.#isSideEmpty(this.#sides.lowerBoard)) {

            console.info("G A M E  O V E R");
            console.info("The board is finally empty!");
            return true
        }
        return false
    }

    #isSideEmpty(side: Slot[]): boolean {

        for (const slot of side) {
            if (this.#gameBoard.get(slot) != 0) {
                return false;
            }
        }
        return true
    }

    #saw(slot: Slot, player: Player): boolean {

        let seedsNumber = this.#gameBoard.get(slot);

        if (!seedsNumber) {
            this.#display();

            this.#deletePrevLine(2);

            console.error(`${this.#colorize(slot, "red", true)}\ is an empty slot!`);
            console.info();

            return false
        }
        this.#gameBoard.set(slot, 0);

        const sawOrder = this.#getTurnOrderFrom(slot, "saw");

        // Actual seed distribution
        for (let i = 0; i < seedsNumber; i++) {

            const key = sawOrder[i % sawOrder.length];

            if (key == slot) {
                seedsNumber++;
                continue;

            } else {
                let value = this.#gameBoard.get(key)!;
                this.#gameBoard.set(key, value += 1);
            }
        }

        // Check for last slot and possible Harvest
        const lastSlotKey = sawOrder[(seedsNumber - 1) % sawOrder.length];
        const lastSlotValue = this.#gameBoard.get(lastSlotKey)! - 1;


        if (lastSlotValue <= 2
            && lastSlotValue > 0
            && !player.getBoard()?.includes(lastSlotKey)
        ) {
            const harvestValue = this.#harvest(lastSlotKey, player);

            this.#display([slot, lastSlotKey]);
            this.#deletePrevLine(3);

            console.info(
                `Player ${player.getName()} saw on slot ${this.#colorize(slot, "cyan", true)}.`
            );
            console.info(`/!\\ ${this.#colorize("HARVEST TIME", "magenta", true)} on slot ${this.#colorize(lastSlotKey, "magenta", true)} /!\\ ${this.#colorize("+" + harvestValue, "yellow", true)} points!`);

        } else {
            this.#display([slot]);
            this.#deletePrevLine(2);

            console.info(
                `Player ${player.getName()} saw on slot ${this.#colorize(slot, "cyan", true)}.`
            );
        }

        this.#turnCount++;

        console.info();
        return true
    }

    #harvest(slot: Slot, player: Player): number {

        const currentPoints = player.getScore();
        const harvestOrder = this.#getTurnOrderFrom(slot, "harvest");

        for (const slot of harvestOrder) {
            if (this.#gameBoard.get(slot)! > 3
                || player.getBoard().includes(slot)) {
                break;
            }

            player.addPoints(this.#gameBoard.get(slot) ?? 0);
            this.#gameBoard.set(slot, 0);
        }
        const newPoints = player.getScore();

        return newPoints - currentPoints;
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

class Player {

    #name: string;
    #score: number = 0;
    #board: Slot[];
    #isWinning: boolean = false;

    constructor(name: string, board: Slot[]) {
        this.#name = '\x1b[32m' + name + '\x1b[0m';
        this.#board = board;
    }

    public addPoints(num: number): void {
        this.#score += num;
    }

    public getScore(): number {
        return this.#score;
    }

    public displayScore(): void {
        console.info(`${this.#isWinning ? "👑 " : "   "}${this.#name} has \x1b[33m${this.#score}\x1b[0m point${this.#score ? 's' : ''}!`);
    }

    public getName(): string {
        return this.#name;
    }

    public getBoard(): Slot[] {
        return this.#board;
    }

    public setWin(bool: boolean): void {
        bool ? this.#isWinning = true : this.#isWinning = false
    }
}

new Awale().play();
