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
		this.startPourState = false;
		this.transformation = new Transformation();
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

	setRotationCenter(rotationCenter) {
		this.rotationCenter = rotationCenter;
	}

	distToDest() {
		let dx = this.destPosition.x - this.position.x;
		let dy = this.destPosition.y - this.position.y;
		if(Math.abs(dx) > Math.abs(dy)) return dx;
		return dy;
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

	isMoving() {
		if(this.distToDest() !== 0) return true;
		return false;
	};

	isMoved() {
		if(!this.isMoving() && this.position.x !== this.oriPosition.x && this.position.y !== this.oriPosition.y) {
			return true;
		} else {
			return false;
		}
	}

	isLeaned() {
		if(this.isMoved() && this.angle === this.getLeanDegree()) return true;
		return false;
	}

	isPoured() {
		if(this.isLeaned() && this.volToDest() === 0 && this.startPourState) return true;
		return false;
	}

	back() {
		this.destPosition = this.oriPosition;
		this.destAngle = 0;
	}

	getLeanDegree() {
		let rotationFactor = 1;
		if(this.rotationCenter === "right") rotationFactor = -1;
		if(this.volume > this.volumeBoundary()) {
			let tanTheta = (2*this.height*(this.capacity-this.volume))/(this.width*this.capacity);
			return Math.atan(tanTheta) * rotationFactor;
		} else {
			let tanTheta = (this.height*this.capacity)/(2*this.width*this.volume);
			return Math.atan(tanTheta) * rotationFactor;
		}

	}

	lean() {
		this.destAngle = this.getLeanDegree();
	}

	pour(volume) {
		//this.destAngle = degree;
	}

	getCornerGlass() {
		//posisi gelas tanpa dimiringkan
		let b_corner1 = this.position;
		let b_corner2 = {x:this.position.x, y: this.position.y + this.height};
		let b_corner3 = {x:this.position.x + this.width, y: this.position.y + this.height};
		let b_corner4 = {x:this.position.x + this.width, y: this.position.y};
		
		//posisi gelas sudah dimiringkan
		if(this.rotationCenter == 'right') {
			let f_corner1 = b_corner1;
			let f_corner2 = this.transformation.rotate(b_corner2, this.angle, b_corner1);
			let f_corner3 = this.transformation.rotate(b_corner3, this.angle, b_corner1);
			let f_corner4 = this.transformation.rotate(b_corner4, this.angle, b_corner1);
			return [f_corner1,f_corner2,f_corner3,f_corner4];
		}

		if(this.rotationCenter == 'left') {
			let f_corner1 = this.transformation.rotate(b_corner1, this.angle, b_corner4);
			let f_corner2 = this.transformation.rotate(b_corner2, this.angle, b_corner4);
			let f_corner3 = this.transformation.rotate(b_corner3, this.angle, b_corner4);	
			let f_corner4 = b_corner4;
			return [f_corner1,f_corner2,f_corner3,f_corner4];
		}
	};

	volumeBoundary() { // batas volume paling besar, sehingga menggambar air hanya perlu 3 titik
		let tan = Math.tan(Math.abs(this.angle));
		return (this.width*tan*this.capacity)/(2*this.height);
	}

	volumeMax() {
		return this.capacity - this.volumeBoundary();
	}

	getCornersWater() {
		let cornersGlass = this.getCornerGlass();

		if(this.volume <= this.volumeBoundary() && this.rotationCenter == 'left' ) { 
			let tanx = Math.tan(Math.abs(this.angle)) + Math.tan(Math.PI/2 - Math.abs(this.angle)) //tanx = tan theta + tan alpha
			let waterHeight = Math.sqrt(2*this.width*this.height*this.volume/(this.capacity*tanx))
			let midPointWaterY = cornersGlass[2].y - waterHeight;
			let cornerWaterLeftX = this.transformation.intersect(cornersGlass[1], cornersGlass[2], midPointWaterY);
			let cornerWaterRightX = this.transformation.intersect(cornersGlass[2], cornersGlass[3], midPointWaterY);
			let corner1 = {x:cornerWaterLeftX, y:midPointWaterY};
			let corner2 = cornersGlass[2];
			let corner3 = {x:cornerWaterRightX, y:midPointWaterY};
			return [corner1, corner2, corner3];
		}

		if(this.volume <= this.volumeBoundary() && this.rotationCenter == 'right' ) { 
			let tanx = Math.tan(Math.abs(this.angle)) + Math.tan(Math.PI/2 - Math.abs(this.angle)) //tanx = tan theta + tan alpha
			let waterHeight = Math.sqrt(2*this.width*this.height*this.volume/(this.capacity*tanx))
			let midPointWaterY = cornersGlass[1].y - waterHeight;
			let cornerWaterLeftX = this.transformation.intersect(cornersGlass[0], cornersGlass[1], midPointWaterY);
			let cornerWaterRightX = this.transformation.intersect(cornersGlass[1], cornersGlass[2], midPointWaterY);
			let corner1 = {x:cornerWaterLeftX, y:midPointWaterY};
			let corner2 = cornersGlass[1];
			let corner3 = {x:cornerWaterRightX, y:midPointWaterY};
			return [corner1, corner2, corner3];
		}


		if(this.volume >= this.volumeMax()) {
			let midBottomGlassY = (cornersGlass[1].y + cornersGlass[2].y)*0.5;
			let midUpperGlassY = (cornersGlass[0].y + cornersGlass[3].y)*0.5;
			let midPointWaterY = midBottomGlassY*(1-this.volumeMax()/this.capacity) +  midUpperGlassY*(this.volumeMax()/this.capacity)
			let cornerWaterLeftX = this.transformation.intersect(cornersGlass[0], cornersGlass[1], midPointWaterY)
			let cornerWaterRightX = this.transformation.intersect(cornersGlass[2], cornersGlass[3], midPointWaterY)
			let corner1 = {x:cornerWaterLeftX, y:midPointWaterY};
			let corner2 = cornersGlass[1];
			let corner3 = cornersGlass[2];
			let corner4 = {x:cornerWaterRightX, y:midPointWaterY};
			return [corner1, corner2, corner3, corner4];
		};

		let midBottomGlassY = (cornersGlass[1].y + cornersGlass[2].y)*0.5;
		let midUpperGlassY = (cornersGlass[0].y + cornersGlass[3].y)*0.5;
		let midPointWaterY = midBottomGlassY*(1-this.volume/this.capacity) +  midUpperGlassY*(this.volume/this.capacity)
		let cornerWaterLeftX = this.transformation.intersect(cornersGlass[0], cornersGlass[1], midPointWaterY)
		let cornerWaterRightX = this.transformation.intersect(cornersGlass[2], cornersGlass[3], midPointWaterY)
		let corner1 = {x:cornerWaterLeftX, y:midPointWaterY};
		let corner2 = cornersGlass[1];
		let corner3 = cornersGlass[2];
		let corner4 = {x:cornerWaterRightX, y:midPointWaterY};
		return [corner1, corner2, corner3, corner4];
	}


}