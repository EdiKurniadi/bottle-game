
class Game{
	constructor(a,b,c) {
		this.data = new DataManager(a,b,c);
		this.glasses = [new Glass(a), new Glass(b), new Glass(c)];
		this.history = [];
		this.selectedGlass = -1;
	}

	initialize() {
		//
	}

	selectGlass(indexGlass) {
		this.selectedGlass = indexGlass;
	}

	unselectGlass() {
		this.selectedGlass = -1;
	}

	getIndexUnselectedGlasses() {
		let indexUnselectedGlasses = [0,1,2];
		indexUnselectedGlasses.splice(this.selectedGlass,1)
		return indexUnselectedGlasses;
	}

	getGlassesVolume() {
		return [this.glasses[0].volume, this.glasses[1].volume, this.glasses[2].volume]
	}

	fill() {
		this.history.push(this.getGlassesVolume());
		this.glasses[this.selectedGlass].fillUntilFull();
		// if(this.isTargetAchieved()) this.updateLevel();
	}

	clear() {
		this.history.push(this.getGlassesVolume());
		this.glasses[this.selectedGlass].clearUntilEmpty();
		// if(this.isTargetAchieved()) this.updateLevel();
	}

	transfer(toIndexGlass) {
		this.history.push(this.getGlassesVolume());
		let amountTransferred = this.glasses[toIndexGlass].capacity - this.glasses[toIndexGlass].volume;
		if(this.glasses[this.selectedGlass].volume < amountTransferred) {
			amountTransferred = this.glasses[this.selectedGlass].volume
		}

		// let midPointX = this.glasses[toIndexGlass].position.x + this.glasses[toIndexGlass].width / 2;
		// let midPointY = this.glasses[toIndexGlass].position.y - 50;
		// this.glasses[this.selectedGlass].move({x:midPointX,y:midPointY});
		// if(toIndexGlass > this.selectedGlass) this.glasses[this.selectedGlass].rotationCenter = 'left';
		// if(toIndexGlass < this.selectedGlass) this.glasses[this.selectedGlass].rotationCenter = 'right';
		// this.glasses[this.selectedGlass].lean(-Math.PI/4);

		this.glasses[toIndexGlass].fill(amountTransferred);
		this.glasses[this.selectedGlass].clear(amountTransferred);

		// if(this.isTargetAchieved()) this.updateLevel();

	}

	isTargetAchieved() {
		if(this.glasses[0].volume == parseInt(this.data.getTargetLevel()[0])  && this.glasses[1].volume == parseInt(this.data.getTargetLevel()[1]) && this.glasses[2].volume == parseInt(this.data.getTargetLevel()[2])) {
			return true;
		};
		return false;
	}

	isFinish() {
		return this.data.currentLevel > this.data.totalLevel;
	}

	updateLevel() {
		this.data.currentLevel++;
	}

	undo() {
		if(this.history.length) {
			let lastStateInHistory = this.history.pop();

			this.glasses[0].volume = lastStateInHistory[0];
			this.glasses[1].volume = lastStateInHistory[1];
			this.glasses[2].volume = lastStateInHistory[2];

			this.glasses[0].destVolume = lastStateInHistory[0];
			this.glasses[1].destVolume = lastStateInHistory[1];
			this.glasses[2].destVolume = lastStateInHistory[2];
		}
	}
}

// let game = new Game(7,7,11);
// console.log(game.data.getTargetLevel());
// console.log(game.data.currentLevel);
// console.log(game.data.getAllLevelState());