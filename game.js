
class Game{
	constructor(a,b,c) {
		this.data = new DataManager(a,b,c);
		this.glasses = [new Glass(a), new Glass(b), new Glass(c)];
		this.history = [];
		this.selectedGlass = -1;
		this.targetGlass = -1;
		this.animateGlass = -1;
		this.waterLineState = false;
	}

	initialize() {
		//
	}

	selectGlass(indexGlass) {
		this.selectedGlass = indexGlass;
		this.animateGlass = indexGlass;
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
	}

	clear() {
		this.history.push(this.getGlassesVolume());
		this.glasses[this.selectedGlass].clearUntilEmpty();
	}

	transfer(toIndexGlass) {
		this.history.push(this.getGlassesVolume());
		this.targetGlass = toIndexGlass;

		if(toIndexGlass > this.selectedGlass) {
			this.glasses[this.selectedGlass].rotationCenter = 'left';	
			let midPointX = this.glasses[toIndexGlass].position.x - this.glasses[toIndexGlass].width / 2;
			let midPointY = this.glasses[toIndexGlass].position.y - 50;
			this.glasses[this.selectedGlass].move({x:midPointX,y:midPointY});
			this.glasses[this.selectedGlass].lean();
		};

		if(toIndexGlass < this.selectedGlass) {
			this.glasses[this.selectedGlass].rotationCenter = 'right';	
			let midPointX = this.glasses[toIndexGlass].position.x + this.glasses[toIndexGlass].width / 2;
			let midPointY = this.glasses[toIndexGlass].position.y - 50;
			this.glasses[this.selectedGlass].move({x:midPointX,y:midPointY});
			this.glasses[this.selectedGlass].lean();
		}

	}

	watchSelectedGlass() { //action after transfer
		if(this.animateGlass > -1) {
			if(this.glasses[this.animateGlass].isPoured()) {
				this.glasses[this.animateGlass].back();
				this.glasses[this.animateGlass].startPourState = false;
				this.waterLineState = false;
				this.animateGlass = -1;
				return;
			};

			if(this.glasses[this.animateGlass].isLeaned()) {
				
				let amountTransferred = this.glasses[this.targetGlass].capacity - this.glasses[this.targetGlass].volume;
				if(this.glasses[this.animateGlass].volume < amountTransferred) {
					amountTransferred = this.glasses[this.animateGlass].volume
				}
				this.glasses[this.targetGlass].fill(amountTransferred);
				this.glasses[this.animateGlass].clear(amountTransferred);
				this.glasses[this.animateGlass].startPourState = true;

				this.waterLineState = true;

				return;
			};

			if(this.glasses[this.animateGlass].isMoved()) {
				this.glasses[this.animateGlass].lean();
				return;
			};
		}
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