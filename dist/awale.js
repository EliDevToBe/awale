"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/awale.ts
var awale_exports = {};
__export(awale_exports, {
  Awale: () => Awale,
  Player: () => Player
});
module.exports = __toCommonJS(awale_exports);
var readline = __toESM(require("readline"));
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var _gameBoard, _sides, _players, _turnCount, _turnArray, _Awale_instances, definePlayers_fn, askPlayerName_fn, playerMove_fn, display_fn, rulesDisplay_fn, boardDisplay_fn, colorize_fn, deletePrevLine_fn, isGameOver_fn, saw_fn, harvest_fn, getCurrentPlayer_fn, getTurnOrderFrom_fn;
var Awale = class {
  constructor() {
    __privateAdd(this, _Awale_instances);
    __privateAdd(this, _gameBoard, /* @__PURE__ */ new Map([
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
    ]));
    __privateAdd(this, _sides, {
      upperBoard: ["A", "B", "C", "D", "E", "F"],
      lowerBoard: ["G", "H", "I", "J", "K", "L"]
    });
    __privateAdd(this, _players, /* @__PURE__ */ new Map());
    __privateAdd(this, _turnCount, 0);
    __privateAdd(this, _turnArray);
    let roleArray = ["upperPlayer", "lowerPlayer"];
    const rndNum = Math.floor(Math.random() * 10);
    if (rndNum % 2 == 0) {
      roleArray = roleArray.reverse();
    }
    __privateSet(this, _turnArray, roleArray);
  }
  play() {
    return __async(this, null, function* () {
      var _a;
      process.stdout.write("\x1Bc");
      console.info(`- --===== ${__privateMethod(this, _Awale_instances, colorize_fn).call(this, "Awale Game", "white")} =====-- -`);
      console.info();
      yield __privateMethod(this, _Awale_instances, definePlayers_fn).call(this);
      __privateMethod(this, _Awale_instances, display_fn).call(this);
      while (true) {
        const playerInput = yield __privateMethod(this, _Awale_instances, playerMove_fn).call(this);
        const currentPlayer = __privateMethod(this, _Awale_instances, getCurrentPlayer_fn).call(this);
        if (!((_a = currentPlayer.getBoard()) == null ? void 0 : _a.includes(playerInput))) {
          __privateMethod(this, _Awale_instances, display_fn).call(this);
          __privateMethod(this, _Awale_instances, deletePrevLine_fn).call(this, 2);
          if (playerInput === "Q") {
            console.info("Exiting the game. Hope you had fun!");
            break;
          }
          console.error(`\x1B[31m'${playerInput}\x1B[0m' -> is not a valid entry. `);
          console.info();
          continue;
        }
        __privateMethod(this, _Awale_instances, saw_fn).call(this, playerInput, currentPlayer);
        if (__privateMethod(this, _Awale_instances, isGameOver_fn).call(this)) {
          break;
        }
      }
      __privateGet(this, _players).forEach((player) => {
        player.displayScore();
      });
      console.info();
      rl.close();
      process.exit();
    });
  }
};
_gameBoard = new WeakMap();
_sides = new WeakMap();
_players = new WeakMap();
_turnCount = new WeakMap();
_turnArray = new WeakMap();
_Awale_instances = new WeakSet();
definePlayers_fn = function() {
  return __async(this, null, function* () {
    const upperPlayer = yield __privateMethod(this, _Awale_instances, askPlayerName_fn).call(this, "upper");
    __privateGet(this, _players).set("upperPlayer", new Player(upperPlayer));
    __privateGet(this, _players).get("upperPlayer").setBoard(__privateGet(this, _sides).upperBoard);
    const lowerPlayer = yield __privateMethod(this, _Awale_instances, askPlayerName_fn).call(this, "lower");
    __privateGet(this, _players).set("lowerPlayer", new Player(lowerPlayer));
    __privateGet(this, _players).get("lowerPlayer").setBoard(__privateGet(this, _sides).lowerBoard);
  });
};
askPlayerName_fn = function(side) {
  return new Promise((resolve, reject) => {
    rl.question(`Choose a player name for the \x1B[33m${side}\x1B[0m board: `, (answer) => {
      resolve(answer.trim());
    });
  });
};
playerMove_fn = function() {
  const currentPlayer = __privateMethod(this, _Awale_instances, getCurrentPlayer_fn).call(this);
  console.info(`It's your turn \x1B[1m${currentPlayer.getName()}\x1B[0m!`);
  const playerSlots = currentPlayer.getBoard();
  return new Promise((resolve, reject) => {
    rl.question(`Choose a slot to saw (${playerSlots == null ? void 0 : playerSlots.join("-")}): `, (answer) => {
      resolve(answer.trim().toUpperCase());
    });
  });
};
display_fn = function(slotToUpdate) {
  process.stdout.write("\x1Bc");
  __privateMethod(this, _Awale_instances, rulesDisplay_fn).call(this);
  __privateMethod(this, _Awale_instances, boardDisplay_fn).call(this, slotToUpdate);
};
rulesDisplay_fn = function() {
  var _a, _b;
  console.info(`- --===== ${__privateMethod(this, _Awale_instances, colorize_fn).call(this, "Awale Rules", "white")} =====-- -`);
  console.info();
  console.info(`${__privateMethod(this, _Awale_instances, colorize_fn).call(this, "\xA4", "magenta", true)} Each player chooses a \x1B[34mnon empty\x1B[0m slot to distribute the seeds \r
 inside following a counter-clockwise pattern.`);
  console.info();
  console.info(`${__privateMethod(this, _Awale_instances, colorize_fn).call(this, "\xA4", "magenta", true)} You have to choose a slot on your side: \r
 - ${(_a = __privateGet(this, _players).get("upperPlayer")) == null ? void 0 : _a.getName()}: A-B-C-D-E-F \r
 - ${(_b = __privateGet(this, _players).get("lowerPlayer")) == null ? void 0 : _b.getName()}: G-H-I-J-K-L`);
  console.info();
  console.info(`${__privateMethod(this, _Awale_instances, colorize_fn).call(this, "\xA4", "magenta", true)} When the \x1B[34mfinishing slot\x1B[0m of the distribution cycle has \x1B[34m1-2 seeds\x1B[0m \r
 and is in the adversary board, you \x1B[34mcollect\x1B[0m all the seeds in a \r
 clockwise pattern \x1B[34muntil\x1B[0m finding a slot of at least \x1B[34m4 seeds\x1B[0m.`);
  console.info();
  console.info(`${__privateMethod(this, _Awale_instances, colorize_fn).call(this, "\xA4", "magenta", true)} At anytime, type '\x1B[31mQ\x1B[0m' to \x1B[31mexit\x1B[0m the game.`);
  console.info();
  console.info();
};
boardDisplay_fn = function(slotToUpdate) {
  __privateGet(this, _players).forEach((player) => {
    player.displayScore();
  });
  console.info();
  const upperState = __privateGet(this, _sides).upperBoard.map((el) => {
    const value = __privateGet(this, _gameBoard).get(el);
    if (value == 0) return __privateMethod(this, _Awale_instances, colorize_fn).call(this, " " + value, "red");
    if ((value == null ? void 0 : value.toString().length) == 1) return __privateMethod(this, _Awale_instances, colorize_fn).call(this, " " + value, "yellow");
    return value;
  });
  const lowerState = __privateGet(this, _sides).lowerBoard.map((el) => {
    const value = __privateGet(this, _gameBoard).get(el);
    if (value == 0) return __privateMethod(this, _Awale_instances, colorize_fn).call(this, " " + value, "red");
    if ((value == null ? void 0 : value.toString().length) == 1) return __privateMethod(this, _Awale_instances, colorize_fn).call(this, " " + value, "yellow");
    return value;
  });
  const upperBoardColored = __privateGet(this, _sides).upperBoard.map((el) => {
    return (slotToUpdate == null ? void 0 : slotToUpdate.indexOf(el)) == 1 ? __privateMethod(this, _Awale_instances, colorize_fn).call(this, " " + el, "magenta", true) : (slotToUpdate == null ? void 0 : slotToUpdate.indexOf(el)) == 0 ? __privateMethod(this, _Awale_instances, colorize_fn).call(this, " " + el, "cyan", true) : " " + el;
  });
  const lowerBoardColored = __privateGet(this, _sides).lowerBoard.map((el) => {
    return (slotToUpdate == null ? void 0 : slotToUpdate.indexOf(el)) == 1 ? __privateMethod(this, _Awale_instances, colorize_fn).call(this, " " + el, "magenta", true) : (slotToUpdate == null ? void 0 : slotToUpdate.indexOf(el)) == 0 ? __privateMethod(this, _Awale_instances, colorize_fn).call(this, " " + el, "cyan", true) : " " + el;
  });
  console.info("\x1B[37m===== BOARD =====\x1B[0m");
  console.info(...upperBoardColored);
  console.info(...upperState);
  console.info(...lowerState);
  console.info(...lowerBoardColored);
  console.info("\x1B[37m=================\x1B[0m");
  console.info();
  console.info();
  console.info();
  console.info();
};
colorize_fn = function(element, color, bold = false) {
  const colors = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"];
  const params = colors.indexOf(color) + (bold ? ";1" : "");
  return `\x1B[3${params}m` + element + "\x1B[0m";
};
deletePrevLine_fn = function(num) {
  for (let i = 0; i < num; i++) {
    process.stdout.write("\x1B[1A\x1B[2K");
  }
};
isGameOver_fn = function() {
  for (const [key, _] of __privateGet(this, _gameBoard)) {
    if (__privateGet(this, _gameBoard).get(key) != 0) {
      return false;
    }
  }
  console.info("G A M E  O V E R");
  console.info("The board is finally empty!");
  return true;
};
saw_fn = function(slot, player) {
  var _a;
  let seedsNumber = __privateGet(this, _gameBoard).get(slot);
  if (!seedsNumber) {
    __privateMethod(this, _Awale_instances, display_fn).call(this);
    __privateMethod(this, _Awale_instances, deletePrevLine_fn).call(this, 2);
    console.error(`\x1B[31m${slot}\x1B[0m is an empty slot!`);
    console.info();
    return false;
  }
  __privateGet(this, _gameBoard).set(slot, 0);
  const sawOrder = __privateMethod(this, _Awale_instances, getTurnOrderFrom_fn).call(this, slot, "saw");
  for (let i = 0; i < seedsNumber; i++) {
    const key = sawOrder[i % sawOrder.length];
    let value = __privateGet(this, _gameBoard).get(key);
    __privateGet(this, _gameBoard).set(key, value += 1);
  }
  const lastSlotKey = sawOrder[(seedsNumber - 1) % sawOrder.length];
  const lastSlotValue = __privateGet(this, _gameBoard).get(lastSlotKey) - 1;
  if (lastSlotValue <= 2 && lastSlotValue > 0 && !((_a = player.getBoard()) == null ? void 0 : _a.includes(lastSlotKey))) {
    __privateMethod(this, _Awale_instances, harvest_fn).call(this, lastSlotKey, player);
    __privateMethod(this, _Awale_instances, display_fn).call(this, [slot, lastSlotKey]);
    __privateMethod(this, _Awale_instances, deletePrevLine_fn).call(this, 3);
    console.info(
      `Player ${player.getName()} saw on slot ${__privateMethod(this, _Awale_instances, colorize_fn).call(this, slot, "cyan", true)}.`
    );
    console.info(`/!\\ ${__privateMethod(this, _Awale_instances, colorize_fn).call(this, "HARVEST TIME", "magenta", true)} on slot ${__privateMethod(this, _Awale_instances, colorize_fn).call(this, lastSlotKey, "magenta")} /!\\`);
  } else {
    __privateMethod(this, _Awale_instances, display_fn).call(this, [slot]);
    __privateMethod(this, _Awale_instances, deletePrevLine_fn).call(this, 2);
    console.info(
      `Player ${player.getName()} saw on slot ${__privateMethod(this, _Awale_instances, colorize_fn).call(this, slot, "cyan", true)}.`
    );
  }
  __privateWrapper(this, _turnCount)._++;
  console.info();
  return true;
};
harvest_fn = function(slot, player) {
  var _a;
  const harvestOrder = __privateMethod(this, _Awale_instances, getTurnOrderFrom_fn).call(this, slot, "harvest");
  for (const slot2 of harvestOrder) {
    if (__privateGet(this, _gameBoard).get(slot2) > 3) {
      break;
    }
    player.addPoints((_a = __privateGet(this, _gameBoard).get(slot2)) != null ? _a : 0);
    __privateGet(this, _gameBoard).set(slot2, 0);
  }
};
getCurrentPlayer_fn = function() {
  const playerRole = __privateGet(this, _turnArray)[__privateGet(this, _turnCount) % 2];
  return __privateGet(this, _players).get(playerRole);
};
getTurnOrderFrom_fn = function(slot, action) {
  const turnOrder = ["F", "E", "D", "C", "B", "A", "G", "H", "I", "J", "K", "L"];
  const sawOrder = [
    ...turnOrder.slice(turnOrder.indexOf(slot) + 1),
    ...turnOrder.slice(0, turnOrder.indexOf(slot) + 1)
  ];
  if (action == "saw") {
    return sawOrder;
  } else {
    return sawOrder.reverse();
  }
};
var _name, _score, _board;
var Player = class {
  constructor(name) {
    __privateAdd(this, _name);
    __privateAdd(this, _score, 0);
    __privateAdd(this, _board, null);
    __privateSet(this, _name, "\x1B[32m" + name + "\x1B[0m");
  }
  addPoints(num) {
    __privateSet(this, _score, __privateGet(this, _score) + num);
  }
  displayScore() {
    console.info(`${__privateGet(this, _name)} has \x1B[33m${__privateGet(this, _score)}\x1B[0m point${__privateGet(this, _score) ? "s" : ""}!`);
  }
  getName() {
    return __privateGet(this, _name);
  }
  setBoard(board) {
    __privateSet(this, _board, board);
  }
  getBoard() {
    return __privateGet(this, _board);
  }
};
_name = new WeakMap();
_score = new WeakMap();
_board = new WeakMap();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Awale,
  Player
});
//# sourceMappingURL=awale.js.map