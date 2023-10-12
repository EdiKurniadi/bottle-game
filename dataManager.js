class DataManager{
	constructor(a,b,c){
		this.glassesCapacity = [a,b,c];
		this.allLevel = new Level(a,b,c).getAllLevel();
		this.currentLevel = 1;
		this.totalLevel = this.allLevel.length-1;
	}

	getAllLevelState() {
		return this.allLevel.map(level => level.state);
	}

	getTargetLevel() {
		return this.allLevel[this.currentLevel].state.split('-');
	}

	getTargetLevelText() {
		return this.allLevel[this.currentLevel].state;
	}

	getSolutionToTargetLevel() {
		let solutionCode = this.allLevel[this.currentLevel].solution.split("-");
		let solution = solutionCode.map( code => {
			if(code == "i") return "start";
			if(code == "0") return "fill 1";
			if(code == "1") return "fill 2";
			if(code == "2") return "fill 3";
			if(code == "3") return "dispose 1";
			if(code == "4") return "dispose 2";
			if(code == "5") return "dispose 3";
			if(code == "6") return "transfer 1 to 2";
			if(code == "7") return "transfer 2 to 1";
			if(code == "8") return "transfer 1 to 3";
			if(code == "9") return "transfer 3 to 1";
			if(code == "10") return "transfer 2 to 3";
			if(code == "11") return "transfer 3 to 2";
		});
		return solution;
	}

	// upLevel() {
	// 	this.currentLevel++;
	// }

	updateGlassesCapacity(a,b,c) {
		this.glassesCapacity = [a,b,c];
	}
}