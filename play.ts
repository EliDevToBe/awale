import { Awale, Player } from "./awale";

const laure = new Player("Laure");
const patrick = new Player("Patrick");

const game = new Awale(laure, patrick);

game.play();