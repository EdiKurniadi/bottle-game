function randomColor() {
	let hex1 = Math.floor(Math.random()*256);
	let hex2 = Math.floor(Math.random()*256);
	let hex3 = Math.floor(Math.random()*256);
	return `${hex1},${hex2},${hex3}`;
}

const fireworkCanvas = document.querySelector('#firework');
fireworkCanvas.style.display = 'none';
fireworkCanvas.width = window.innerWidth;
fireworkCanvas.height = window.innerHeight;
const ctx = fireworkCanvas.getContext('2d');

let state;
const acc = 0.2;

window.addEventListener('resize', function() {
	fireworkCanvas.width = window.innerWidth;
	fireworkCanvas.height = window.innerHeight;
})

window.onkeypress = function(e){
	if(e.keyCode === 32 && state !== 0) {
		state = 0;
	}

	else if(e.keyCode === 32 && state === 0) {
		state = 1;
		animate();
	}
}

function distant(x1,y1,x2,y2) {
	return Math.sqrt((x1-x2)**2+(y1-y2)**2);
}

function Circle(x,y,dx,dy,radius, color = randomColor()) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
	this.opacity = 1;
	this.color = color;
	this.finColor = `rgba(${this.color},${this.opacity}`;


	this.draw = function() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fillStyle = this.finColor;
		ctx.fill();
	};

	this.drawAndUpdate = function() {
		this.draw();

		this.x += this.dx;
		this.y += this.dy;

		this.dy += acc;

		if(this.radius < 5 && this.dy > 1) {
			this.opacity -= 0.02;
			this.finColor = `rgba(${this.color},${this.opacity}`;
		}
	};
};


let circleArray = [];

function getNewCircle() {
	let radius = 6;
	let x = Math.random()*(fireworkCanvas.width-2*radius)+radius;
	let y = Math.random()*(fireworkCanvas.height/5)+fireworkCanvas.height;
	let dx = 0;
	let dy = (Math.random()-1)*4-12;
	circleArray.push(new Circle(x,y,dx,dy,radius));
}

for(let i = 0 ; i < 4 ; i++) {
	getNewCircle();
} 

let popCircleArray = [];

function popCircle(x, y, color) {
	for(let i = 0 ; i < 100 ; i++) {
		let radius = 1;
		let dx = (Math.random()-0.5)*4;
		let dy = Math.random()*4-7;
		popCircleArray.push(new Circle(x,y,dx,dy,radius, color));
	}
};


function igniteFirework() {
	if(state === 0) {return;};
	ctx.fillStyle = 'rgba(0,0,0,0.1)';
	ctx.fillRect(0,0,fireworkCanvas.width, fireworkCanvas.height);

	for(let i = 0 ; i < circleArray.length ; i++) {
		circleArray[i].drawAndUpdate();
		if(circleArray[i].dy > -3) {
			popCircle(circleArray[i].x, circleArray[i].y, circleArray[i].color);
			circleArray.splice(i, 1);
			getNewCircle();
		}
	}
	
	for(let i = 0 ; i < popCircleArray.length ; i++) {
		popCircleArray[i].drawAndUpdate();
		if(popCircleArray[i].opacity <= 0) {
			popCircleArray.splice(i, 1);
		}
	}	
	requestAnimationFrame(igniteFirework);
}