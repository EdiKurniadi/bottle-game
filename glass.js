class Glass {
	constructor(capacity) {
		this.oriPosition = {x: null, y: null};
		this.position = {x: null, y: null};
		this.destPosition = {x: null, y: null};
		this.width = null;
		this.height = null;
		this.capacity = capacity;
		this.volume = 0;
		this.destVolume = 0;
		this.angle = 0;
		this.destAngle = 0;
		this.rotationCenter = 'right';
	}

	fill(amount) {
		this.destVolume += amount;
	}

	fillUntilFull() {
		this.destVolume = this.capacity;
	}

	clear(amount) {
		this.destVolume -= amount;
	}

	clearUntilEmpty() {
		this.destVolume = 0;
	}

	distToDest() {
		return Math.sqrt( (this.position.x-this.destPosition.x)^2 + (this.position.y - this.destPosition.y)^2 )
	}

	volToDest() {
		return this.destVolume - this.volume;
	}

	angleToDest() {
		return this.destAngle - this.angle;
	}

	move(newPos) {
		this.destPosition = newPos;
	}

	lean(degree) {
		this.destAngle = degree;
	}
}