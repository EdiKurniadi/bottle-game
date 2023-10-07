class DataManager{
	constructor(a,b,c){
		this.glassesCapacity = [a,b,c];
		this.allLevel = new Level(a,b,c).getAllLevel();
		this.currentLevel = 1;
		this.totalLevel = this.allLevel.length-1;
	}

	// reset() {
	// 	this.currentLevel = 1;
	// }

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
		return this.allLevel[this.currentLevel].solution;	
	}

	// upLevel() {
	// 	this.currentLevel++;
	// }

	updateGlassesCapacity(a,b,c) {
		this.glassesCapacity = [a,b,c];
	}
}