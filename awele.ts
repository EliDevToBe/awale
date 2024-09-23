// Started at 11am

class Awele {

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

    public resetGame(): void {
        for (const [key, _] of this.#gameBoard) {
            this.#gameBoard.set(key, 4);
        }
        console.info("Game has been reseted");
    }

    public display(): void {
        // Affichage plateau dans console
        const upperSide = ["A", "B", "C", "D", "E", "F"];
        const lowerSide = ["G", "H", "I", "J", "K", "L"];

        const upperState = upperSide.map((el) => this.#gameBoard.get(el));
        const lowerState = lowerSide.map((el) => this.#gameBoard.get(el));

        console.info("===========");
        console.info(...upperSide);
        console.info(...upperState);
        console.info(...lowerState);
        console.info(...lowerSide);
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

    public saw(slot: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L") {
        let seedsNumber = this.#gameBoard.get(slot);
        this.#gameBoard.set(slot, 0);

        if (!seedsNumber) {
            console.error("It's an empty slot!");
            return
        }

    }

}

class Player {

    #name: string;
    #score: number = 0;

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
}

const game = new Awele();
game.display();
game.isEmpty();

const laure = new Player("Laure");
laure.displayScore();
game.saw("A")