type Slot = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L";
declare class Awale {
    #private;
    constructor();
    play(): Promise<void>;
}
declare class Player {
    #private;
    constructor(name: string);
    addPoints(num: number): void;
    displayScore(): void;
    getName(): string;
    setBoard(board: Slot[]): void;
    getBoard(): Slot[] | null;
}

export { Awale, Player };
