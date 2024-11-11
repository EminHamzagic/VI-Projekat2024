export class GameController {
	constructor(game) {
		this.game = game;
		this.puzzleGrid = document.getElementById("puzzleGrid");
		this.stepCounter = document.getElementById("stepCounter");
		this.algorithmSelect = document.getElementById("algorithmSelect");
		this.heuristicSelect = document.getElementById("heuristicSelect");
		this.spaceButton = document.getElementById("spaceButton");
		this.enterButton = document.getElementById("enterButton");
		this.solution = [];
		this.solutionInterval = null;
	}

	init() {
		this.setupEventListeners();
		this.render();
		this.fetchSolution();
	}

	setupEventListeners() {
		document.addEventListener("keydown", (e) => {
			if (e.code === "Space") {
				e.preventDefault();
				this.togglePlay();
			} else if (e.code === "Enter") {
				e.preventDefault();
				this.showSolution();
			} else if (e.code === "Escape") {
				e.preventDefault();
				this.close();
			}
		});

		this.spaceButton.addEventListener("click", () => this.togglePlay());
		this.enterButton.addEventListener("click", () => this.showSolution());
		this.algorithmSelect.addEventListener("change", () => this.fetchSolution());
		this.heuristicSelect.addEventListener("change", () => this.fetchSolution());
	}

	async fetchSolution() {
		// try {
		// console.log(this.game.board);
		const response = await fetch("http://localhost:8000/puzzle/solve/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				goal_state: this.game.solution,
				initial_state: this.game.board,
				algorithm: this.algorithmSelect.value,
				heuristic: this.heuristicSelect.value,
			}),
		}).catch((err) => console.log(err));

		const data = await response.json();
		console.log(data);
		// console.log(data.steps);
		this.solution = data.steps;
		// } catch (error) {
		// 	console.error("Error fetching solution:", error);
		// }
	}

	togglePlay() {
		this.game.isPlaying = !this.game.isPlaying;
		if (this.game.isPlaying) {
			this.playSolution();
		} else {
			clearInterval(this.solutionInterval);
		}
	}

	playSolution() {
		if (this.solutionInterval) clearInterval(this.solutionInterval);

		this.solutionInterval = setInterval(() => {
			console.log("object");
			if (this.game.currentStep < this.solution.length) {
				this.game.move(this.solution[this.game.currentStep]);
				this.game.currentStep++;
				this.render();
			} else {
				clearInterval(this.solutionInterval);
				this.game.isPlaying = false;
			}
		}, 500);
	}

	showSolution() {
		while (this.game.currentStep < this.solution.length) {
			this.game.move(this.solution[this.game.currentStep]);
			this.game.currentStep++;
		}
		this.render();
	}

	close() {
		clearInterval(this.solutionInterval);
		// Additional cleanup if needed
	}

	render() {
		this.puzzleGrid.innerHTML = "";
		const { board } = this.game.getState();
		const imageSrc = "../../public/pieces.png"; // Path to your image file
		const tileSize = 100; // Size of each tile, assuming the image is split into 3x3 tiles.

		board.forEach((value, index) => {
			const tile = document.createElement("div");
			tile.className = "puzzle-tile";

			// Check if the tile is empty (0)
			if (value === 0) {
				tile.classList.add("empty");
				tile.style.background = "none"; // No image for the empty tile
			} else {
				// Calculate row and column for the current piece
				const row = Math.floor((value - 1) / 3); // 3 columns
				const col = (value - 1) % 3;

				// Set the background image with the correct positioning
				tile.style.backgroundImage = `url(${imageSrc})`;
				tile.style.backgroundPosition = `-${col * tileSize}px -${row * tileSize}px`;
			}

			// Append the tile to the grid
			this.puzzleGrid.appendChild(tile);
		});

		this.stepCounter.textContent = this.game.currentStep;
	}
}
