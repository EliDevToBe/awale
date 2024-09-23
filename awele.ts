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

    resetGame(): void {
        for (const [key, _] of this.#gameBoard) {
            this.#gameBoard.set(key, 4);
        }
        console.info("Game has been reseted");
    }

    display(): void {
        // Affichage plateau dans console
        const upperSide = ["A", "B", "C", "D", "E", "F"];
        const lowerSide = ["G", "H", "I", "J", "K", "L"];

        const upperState = upperSide.map((el) => this.#gameBoard.get(el));
        const lowerState = lowerSide.map((el) => this.#gameBoard.get(el));

        console.info(...upperSide);
        console.info(...upperState);
        console.info(...lowerState);
        console.info(...lowerSide);
    }

    isEmpty(): boolean {
        // le plateau est-il vide ?
        for (const [key, _] of this.#gameBoard) {
            if (key) {
                console.info(false)
                return false
            }
        }
        console.info(true)
        return true
    }

}

const game = new Awele()
game.display()
game.isEmpty()