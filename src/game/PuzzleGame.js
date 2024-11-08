export class PuzzleGame {
	constructor(size) {
		this.size = size;
		this.board = [];
		this.solution = [];
		this.currentStep = 0;
		this.isPlaying = false;
		this.init();
	}

	init() {
		// Initialize board with numbers 1 to size*size-1 and 0 for empty space
		this.board = Array.from({ length: this.size * this.size }, (_, i) => i);
		// console.log(this.board);
		this.shuffle();
		// console.log([2, 6, 1, 3, 8, 0, 4, 7, 9]);
		this.solution = Array.from({ length: this.size * this.size }, (_, i) => (i === this.size * this.size - 1 ? 0 : i + 1));
	}

	shuffle() {
		for (let i = this.board.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.board[i], this.board[j]] = [this.board[j], this.board[i]];
		}
	}

	move(index) {
		const emptyIndex = this.board.indexOf(0);
		if (this.isValidMove(index, emptyIndex)) {
			[this.board[index], this.board[emptyIndex]] = [this.board[emptyIndex], this.board[index]];
			return true;
		}
		return false;
	}

	isValidMove(index, emptyIndex) {
		const row = Math.floor(index / this.size);
		const col = index % this.size;
		const emptyRow = Math.floor(emptyIndex / this.size);
		const emptyCol = emptyIndex % this.size;

		return (Math.abs(row - emptyRow) === 1 && col === emptyCol) || (Math.abs(col - emptyCol) === 1 && row === emptyRow);
	}

	isSolved() {
		return this.board.every((value, index) => value === this.solution[index]);
	}

	getState() {
		return {
			board: [...this.board],
			currentStep: this.currentStep,
			isPlaying: this.isPlaying,
		};
	}
}
