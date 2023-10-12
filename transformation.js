class Transformation{
	constructor() {
		//
	}

	translate(toPos) {
		// return 
	}

	rotate(pos, angle, posCR) { //posCR  = position center rotation
		let resultX = (pos.x-posCR.x)*Math.cos(angle) - (pos.y-posCR.y)*Math.sin(angle) + posCR.x;
		let resultY = (pos.x-posCR.x)*Math.sin(angle) + (pos.y-posCR.y)*Math.cos(angle) + posCR.y;
		return {x:resultX, y:resultY};
	}

	intersect(point1, point2, posY) { //menghasilkan absis (nilai x) titik perpotongan antara sebuah garis yang diwakili oleh point1 dan point2 dg garis y = posY;
		return (posY-point1.y)/(point2.y-point1.y)*(point2.x-point1.x)+point1.x;
	}
}