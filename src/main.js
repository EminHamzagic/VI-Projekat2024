import "../style.css";
import { PuzzleGame } from "./game/PuzzleGame";
import { GameController } from "./controllers/GameController";

document.addEventListener("DOMContentLoaded", () => {
	const game = new PuzzleGame(3); // 3x3 puzzle
	const controller = new GameController(game);
	controller.init();
});
