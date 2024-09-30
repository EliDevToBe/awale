type Slot = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L";
declare class Awale {
    #private;
    constructor();
    play(): Promise<void>;
}
declare class Player {
    #private;
    constructor(name: string, board: Slot[]);
    addPoints(num: number): void;
    displayScore(): void;
    getName(): string;
    getBoard(): Slot[];
}

export { Awale, Player };
