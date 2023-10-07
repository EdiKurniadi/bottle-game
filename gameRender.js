class GameRender {
	constructor(game) {
		this.game = game;
		this.canvas = document.getElementById("myCanvas");
		this.ctx = this.canvas.getContext("2d");
		this.stateTempButton = false;
		this.tempButtonSize; 
		this.tempButtonSpacing;
		this.undoButtonPos;
		this.undoButtonSize;
		this.targetPos;
		this.levelPos;
		this.spacingTextToGlass;
		this.moveAnimationSpeed = 0.02;
		this.angleAnimationSpeed = 0.001;
		this.volumeAnimationSpeed = 0.006;
		this.animateState = false;
		this.initialize();
		this.setupEventListeners();
	}

	initialize() {
		//ukuran kanvas
		this.canvas.width = window.innerWidth;
    	this.canvas.height = window.innerHeight;

    	//firework
    	firework.style.display = 'none';

    	//ukuran dan posisi setiap tombol dan info
    	this.tempButtonSize = {width:0.06*this.canvas.width, height:0.05*this.canvas.height};
		this.tempButtonSpacing = 0.01*this.canvas.width;
		this.undoButtonPos = {x:100, y:this.canvas.height-100};
		this.undoButtonSize = {width:60, height:40};
		this.targetPos = {x:0.5*this.canvas.width, y:0.15*this.canvas.height};
		this.levelPos = {x:0.5*this.canvas.width, y:0.15*this.canvas.height + 20 + 10}; //20 itu ukuran font target, 10 spacing antara target dan level
		this.spacingTextToGlass = 0.005*this.canvas.width;

    	//ukuran lebar gelas
    	this.game.glasses[0].width = 0.05*this.canvas.width;
    	this.game.glasses[1].width = 0.05*this.canvas.width;
    	this.game.glasses[2].width = 0.05*this.canvas.width;

    	//ukuran tinggi gelas
    	let maxCapacity = Math.max(this.game.glasses[0].capacity, this.game.glasses[1].capacity, this.game.glasses[2].capacity);
    	if(maxCapacity < 10) maxCapacity = 10; 
    	this.game.glasses[0].height = 0.4*this.canvas.height*this.game.glasses[0].capacity/maxCapacity;
    	this.game.glasses[1].height = 0.4*this.canvas.height*this.game.glasses[1].capacity/maxCapacity;
    	this.game.glasses[2].height = 0.4*this.canvas.height*this.game.glasses[2].capacity/maxCapacity;

    	//posisi gelas
    	this.game.glasses[0].position = {x:0.350*this.canvas.width, y: 0.7*this.canvas.height - this.game.glasses[0].height};
    	this.game.glasses[1].position = {x:0.475*this.canvas.width, y: 0.7*this.canvas.height - this.game.glasses[1].height}
    	this.game.glasses[2].position = {x:0.600*this.canvas.width, y: 0.7*this.canvas.height - this.game.glasses[2].height}
	
    	//mengatur posisi asal gelas
    	this.game.glasses[0].oriPosition = {x:0.350*this.canvas.width, y: 0.7*this.canvas.height - this.game.glasses[0].height};
    	this.game.glasses[1].oriPosition = {x:0.475*this.canvas.width, y: 0.7*this.canvas.height - this.game.glasses[1].height}
    	this.game.glasses[2].oriPosition = {x:0.600*this.canvas.width, y: 0.7*this.canvas.height - this.game.glasses[2].height}

    	//mengatur posisi tujuan gelas
    	this.game.glasses[0].destPosition = {x:0.350*this.canvas.width, y: 0.7*this.canvas.height - this.game.glasses[0].height};
    	this.game.glasses[1].destPosition = {x:0.475*this.canvas.width, y: 0.7*this.canvas.height - this.game.glasses[1].height}
    	this.game.glasses[2].destPosition = {x:0.600*this.canvas.width, y: 0.7*this.canvas.height - this.game.glasses[2].height}
	}

	setupEventListeners() {
		window.addEventListener('resize', () => {
			this.canvas.width = window.innerWidth;
    		this.canvas.height = window.innerHeight;
    		this.initialize(); 
		})
	}

	render() {
		this.clearCanvas();
		
		this.drawWater(0);
		this.drawGlass(0);

		this.drawWater(1);
		this.drawGlass(1);
		
		this.drawWater(2);
		this.drawGlass(2);

		this.drawPointerCapacity(0);
		this.drawPointerCapacity(1);
		this.drawPointerCapacity(2);

		this.drawPointerVolume(0);
		this.drawPointerVolume(1);
		this.drawPointerVolume(2);



		this.drawUndoButton();
		if(this.game.selectedGlass >= 0) this.drawTempButtons(this.game.selectedGlass);

		this.drawTarget();
		this.drawLevel();
		// console.log('tes')
	}

	animate(elapsedTime) {
		this.animateGlassPosition(0, elapsedTime);
		this.animateGlassPosition(1, elapsedTime);
		this.animateGlassPosition(2, elapsedTime);

		// this.animateGlassAngle(0, elapsedTime);
		// this.animateGlassAngle(1, elapsedTime);
		// this.animateGlassAngle(2, elapsedTime);

		this.animateWater(0, elapsedTime);
		this.animateWater(1, elapsedTime);
		this.animateWater(2, elapsedTime);
	}

	clearCanvas() {
		this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
	}



	getCornerGlass(glassIndex) {
		//posisi gelas tanpa dimiringkan
		let b_corner1 = this.game.glasses[glassIndex].position;
		let b_corner2 = {x:this.game.glasses[glassIndex].position.x, y: this.game.glasses[glassIndex].position.y + this.game.glasses[glassIndex].height};
		let b_corner3 = {x:this.game.glasses[glassIndex].position.x + this.game.glasses[glassIndex].width, y: this.game.glasses[glassIndex].position.y + this.game.glasses[glassIndex].height};
		let b_corner4 = {x:this.game.glasses[glassIndex].position.x + this.game.glasses[glassIndex].width, y: this.game.glasses[glassIndex].position.y};
		
		//posisi gelas sudah dimiringkan
		if(this.game.glasses[glassIndex].rotationCenter == 'right') {
			let f_corner1 = b_corner1;
			let f_corner2 = {
					x : (b_corner2.x-b_corner1.x)*Math.cos(this.game.glasses[glassIndex].angle) - (b_corner2.y-b_corner1.y)*Math.sin(this.game.glasses[glassIndex].angle) + b_corner1.x,
					y : (b_corner2.x-b_corner1.x)*Math.sin(this.game.glasses[glassIndex].angle) + (b_corner2.y-b_corner1.y)*Math.cos(this.game.glasses[glassIndex].angle) + b_corner1.y,
				};
			let f_corner3 = {
					x : (b_corner3.x-b_corner1.x)*Math.cos(this.game.glasses[glassIndex].angle) - (b_corner3.y-b_corner1.y)*Math.sin(this.game.glasses[glassIndex].angle) + b_corner1.x,
					y : (b_corner3.x-b_corner1.x)*Math.sin(this.game.glasses[glassIndex].angle) + (b_corner3.y-b_corner1.y)*Math.cos(this.game.glasses[glassIndex].angle) + b_corner1.y,
				};
			let f_corner4 = {
					x : (b_corner4.x-b_corner1.x)*Math.cos(this.game.glasses[glassIndex].angle) - (b_corner4.y-b_corner1.y)*Math.sin(this.game.glasses[glassIndex].angle) + b_corner1.x,
					y : (b_corner4.x-b_corner1.x)*Math.sin(this.game.glasses[glassIndex].angle) + (b_corner4.y-b_corner1.y)*Math.cos(this.game.glasses[glassIndex].angle) + b_corner1.y,
				};
			return [f_corner1,f_corner2,f_corner3,f_corner4];
		}

		if(this.game.glasses[glassIndex].rotationCenter == 'left') {
			let f_corner1 = {
					x : (b_corner1.x-b_corner4.x)*Math.cos(this.game.glasses[glassIndex].angle) - (b_corner1.y-b_corner4.y)*Math.sin(this.game.glasses[glassIndex].angle) + b_corner4.x,
					y : (b_corner1.x-b_corner4.x)*Math.sin(this.game.glasses[glassIndex].angle) + (b_corner1.y-b_corner4.y)*Math.cos(this.game.glasses[glassIndex].angle) + b_corner4.y,
				};
			let f_corner2 = {
					x : (b_corner2.x-b_corner4.x)*Math.cos(this.game.glasses[glassIndex].angle) - (b_corner2.y-b_corner4.y)*Math.sin(this.game.glasses[glassIndex].angle) + b_corner4.x,
					y : (b_corner2.x-b_corner4.x)*Math.sin(this.game.glasses[glassIndex].angle) + (b_corner2.y-b_corner4.y)*Math.cos(this.game.glasses[glassIndex].angle) + b_corner4.y,
				};
			let f_corner3 = {
					x : (b_corner3.x-b_corner4.x)*Math.cos(this.game.glasses[glassIndex].angle) - (b_corner3.y-b_corner4.y)*Math.sin(this.game.glasses[glassIndex].angle) + b_corner4.x,
					y : (b_corner3.x-b_corner4.x)*Math.sin(this.game.glasses[glassIndex].angle) + (b_corner3.y-b_corner4.y)*Math.cos(this.game.glasses[glassIndex].angle) + b_corner4.y,
				};	
			let f_corner4 = b_corner4;
			return [f_corner1,f_corner2,f_corner3,f_corner4];
		}

	}

	drawGlass(glassIndex) {
		this.ctx.beginPath();
    	this.ctx.strokeStyle = "red";
    	this.ctx.lineWidth = 3;
		let corners = this.getCornerGlass(glassIndex);
		this.ctx.moveTo(corners[0].x, corners[0].y);
		for (let i = 1; i < corners.length; i++) {
		    this.ctx.lineTo(corners[i].x, corners[i].y);
		}
		this.ctx.stroke();	
		this.ctx.closePath();
    	// let x_pos = this.game.glasses[glassIndex].position.x;
    	// let y_pos = this.game.glasses[glassIndex].position.y;
    	// let width = this.game.glasses[glassIndex].width;
    	// let height = this.game.glasses[glassIndex].height;
    	// this.ctx.strokeRect(x_pos, y_pos, width, height);
	}

	animateGlassPosition(glassIndex, elapsedTime) {
		
		let distToDest = this.game.glasses[glassIndex].distToDest();
		// console.log(distToDest)
		if(distToDest !== 0 ) {
			this.animateState = true;
		    let progress = Math.min(this.moveAnimationSpeed*elapsedTime/distToDest, 1); // Batasi nilai progress antara 0 dan 1
		    // console.log(progress)
		    this.game.glasses[glassIndex].position.x = this.game.glasses[glassIndex].position.x + (this.game.glasses[glassIndex].destPosition.x - this.game.glasses[glassIndex].position.x) * progress;
		    this.game.glasses[glassIndex].position.y = this.game.glasses[glassIndex].position.y + (this.game.glasses[glassIndex].destPosition.y - this.game.glasses[glassIndex].position.y) * progress;
			if(progress === 1) this.animateState = false;
		}
	}

	// animateGlassAngle(glassIndex, elapsedTime) {
	// 	let angleToDest = this.game.glasses[glassIndex].angleToDest();
	// 	if(angleToDest !== 0 ) {
	// 		this.animateState = true;
	// 	    let progress = Math.min(this.angleAnimationSpeed*elapsedTime/Math.abs(angleToDest), 1); // Batasi nilai progress antara 0 dan 1
	// 	    this.game.glasses[glassIndex].angle = this.game.glasses[glassIndex].angle + (this.game.glasses[glassIndex].destAngle - this.game.glasses[glassIndex].angle) * progress;
	// 		if(progress === 1) this.animateState = false;
	// 	}
	// }

	getCornersWater(glassIndex) {
		let cornersGlass = this.getCornerGlass(glassIndex);
		let midBottomGlass = (cornersGlass[1].y + cornersGlass[2].y)*0.5;
		let midUpperGlass = (cornersGlass[0].y + cornersGlass[3].y)*0.5;
		let midPointWater = midBottomGlass*(1-this.game.glasses[glassIndex].volume/this.game.glasses[glassIndex].capacity) +  midUpperGlass*(this.game.glasses[glassIndex].volume/this.game.glasses[glassIndex].capacity)
		let cornerWaterLeft = (midPointWater-cornersGlass[0].y)/(cornersGlass[1].y-cornersGlass[0].y)*(cornersGlass[1].x-cornersGlass[0].x)+cornersGlass[0].x;
		let cornerWaterRight = (midPointWater-cornersGlass[2].y)/(cornersGlass[3].y-cornersGlass[2].y)*(cornersGlass[3].x-cornersGlass[2].x)+cornersGlass[2].x;
		let corner1 = {x:cornerWaterLeft, y:midPointWater};
		let corner2 = cornersGlass[1];
		let corner3 = cornersGlass[2];
		let corner4 = {x:cornerWaterRight, y:midPointWater};
		// console.log(midPointWater)
		return [corner1, corner2, corner3, corner4];

	}


	drawWater(glassIndex) {
		this.ctx.beginPath();
    	this.ctx.fillStyle = "blue";
		let corners = this.getCornersWater(glassIndex);
		this.ctx.moveTo(corners[0].x, corners[0].y);
		for (let i = 1; i < corners.length; i++) {
		    this.ctx.lineTo(corners[i].x, corners[i].y);
		}
		this.ctx.fill();	
		this.ctx.closePath();
	}

	animateWater(glassIndex, elapsedTime) {
		let volToDest = this.game.glasses[glassIndex].volToDest();
		if(volToDest !== 0) {
			this.animateState = true;
			let progress = this.volumeAnimationSpeed*elapsedTime/Math.abs(volToDest) // Batasi nilai progress antara -1 dan 1
			if(progress > 1) progress = 1;
		    this.game.glasses[glassIndex].volume = this.game.glasses[glassIndex].volume + (this.game.glasses[glassIndex].destVolume - this.game.glasses[glassIndex].volume) * progress;
			if(progress === 1) this.animateState = false;
		}
	}

	drawPointerVolume(glassIndex) {
		let text = this.game.glasses[glassIndex].volume;
		if(text % 1 !== 0) text =text.toFixed(2);
		text = '\u2190'+ " " + text + ' L';
		this.ctx.fillStyle = 'white';
	    this.ctx.font = "18px Arial";
	    let textWidth = this.ctx.measureText(text).width;
	    let textX = this.game.glasses[glassIndex].position.x + this.game.glasses[glassIndex].width + this.spacingTextToGlass;
	    let textY = this.getCornersWater(glassIndex)[0].y + 5
	    this.ctx.fillText(text, textX, textY); 
	}

	drawPointerCapacity(glassIndex) {
		let text = this.game.glasses[glassIndex].capacity;
		text = '\u2190'+ " " + text + ' L';
		this.ctx.fillStyle = '#666';
	    this.ctx.font = "18px Arial";
	    let textWidth = this.ctx.measureText(text).width;
	    let textX = this.game.glasses[glassIndex].position.x + this.game.glasses[glassIndex].width + this.spacingTextToGlass;
	    let textY = this.game.glasses[glassIndex].position.y + 5
	    this.ctx.fillText(text, textX, textY); 
	}

	drawTarget() {
		let text = `target : ${this.game.data.getTargetLevelText()}`;
		this.ctx.fillStyle = 'white';
	    this.ctx.font = "20px Arial";
	    let textWidth = this.ctx.measureText(text).width;
	    let textX = this.targetPos.x - textWidth/2;
	    let textY = this.targetPos.y
	    this.ctx.fillText(text, textX, textY); 
	}

	drawLevel() {
		let text = `level ${this.game.data.currentLevel}/${this.game.data.totalLevel}`;
		this.ctx.fillStyle = 'white';
	    this.ctx.font = "20px Arial";
	    let textWidth = this.ctx.measureText(text).width;
	    let textX = this.levelPos.x - textWidth/2;
	    let textY = this.levelPos.y
	    this.ctx.fillText(text, textX, textY); 
	}


	getTempButtonsPos(glassIndex) {
		// console.log('indek gelas', glassIndex)
		let button1pos = {x:this.game.glasses[glassIndex].position.x + 0.5*this.game.glasses[glassIndex].width - (1*this.tempButtonSize.width + 0.5*this.tempButtonSpacing), y: this.game.glasses[glassIndex].position.y + this.game.glasses[glassIndex].height + 0*this.tempButtonSize.height + 2*this.tempButtonSpacing }
		let button2pos = {x:this.game.glasses[glassIndex].position.x + 0.5*this.game.glasses[glassIndex].width + (0*this.tempButtonSize.width + 0.5*this.tempButtonSpacing), y: this.game.glasses[glassIndex].position.y + this.game.glasses[glassIndex].height + 0*this.tempButtonSize.height + 2*this.tempButtonSpacing }
		let button3pos = {x:this.game.glasses[glassIndex].position.x + 0.5*this.game.glasses[glassIndex].width - (1*this.tempButtonSize.width + 0.5*this.tempButtonSpacing), y: this.game.glasses[glassIndex].position.y + this.game.glasses[glassIndex].height + 1*this.tempButtonSize.height + 3*this.tempButtonSpacing }
		let button4pos = {x:this.game.glasses[glassIndex].position.x + 0.5*this.game.glasses[glassIndex].width + (0*this.tempButtonSize.width + 0.5*this.tempButtonSpacing), y: this.game.glasses[glassIndex].position.y + this.game.glasses[glassIndex].height + 1*this.tempButtonSize.height + 3*this.tempButtonSpacing }
		return [ button1pos, button2pos, button3pos, button4pos];
	}

	drawTempButtons(glassIndex) {
		let tempButtonsPos = this.getTempButtonsPos(glassIndex);
		let textButtons;
		let textButtons1 = ['fill', 'dispose', 'move to 2', 'move to 3'];
		let textButtons2 = ['fill', 'dispose', 'move to 1', 'move to 3'];
		let textButtons3 = ['fill', 'dispose', 'move to 1', 'move to 2'];
		if(glassIndex === 0) textButtons = textButtons1;
		if(glassIndex === 1) textButtons = textButtons2;
		if(glassIndex === 2) textButtons = textButtons3;

		for(let i = 0 ; i < tempButtonsPos.length ; i++) {
			this.ctx.beginPath();
	    	this.ctx.fillStyle = "green";
			this.ctx.fillRect(tempButtonsPos[i].x, tempButtonsPos[i].y, this.tempButtonSize.width, this.tempButtonSize.height);
			this.ctx.closePath();

			let text = textButtons[i];
			this.ctx.fillStyle = "white";
		    this.ctx.font = `${this.tempButtonSize.height/2}px Arial`;
		    let textWidth = this.ctx.measureText(text).width;
		    let textHeight = this.tempButtonSize.height/2; // Ukuran font
		    let textX = tempButtonsPos[i].x + (this.tempButtonSize.width - textWidth) / 2;
		    let textY = tempButtonsPos[i].y + (this.tempButtonSize.height + textHeight) / 2 - 2;
		    this.ctx.fillText(text, textX, textY);
		}
	}

	drawUndoButton() {
		this.ctx.beginPath();
    	this.ctx.fillStyle = "green";
		this.ctx.fillRect(this.undoButtonPos.x, this.undoButtonPos.y, this.undoButtonSize.width, this.undoButtonSize.height);
		this.ctx.closePath();

		let text = "undo";
		this.ctx.fillStyle = "white";
	    this.ctx.font = `${this.undoButtonSize.height/2}px Arial`;
	    let textWidth = this.ctx.measureText(text).width;
	    let textHeight = this.undoButtonSize.height/2; // Ukuran font
	    let textX = this.undoButtonPos.x + (this.undoButtonSize.width - textWidth) / 2;
	    let textY = this.undoButtonPos.y + (this.undoButtonSize.height + textHeight) / 2 - 3;
	    this.ctx.fillText(text, textX, textY);
	} 

}


let game = new Game(8,14,13);
let gameRender = new GameRender(game);


let startTime;
function animate(time) {

    if(game.isTargetAchieved()) game.updateLevel();
    if(game.isFinish()) {
    	gameRender.canvas.style.display = 'none';
    	fireworkCanvas.style.display = 'block';	
    	igniteFirework();
    	return;
    }

	if (!startTime) startTime = time;
    let elapsedTime = time - startTime;
	startTime = time;

    gameRender.animate(elapsedTime);
	gameRender.render();
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);