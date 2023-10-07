// Ambil referensi ke elemen canvas
let canvas = document.getElementById("myCanvas");

// Mengambil konteks 2D untuk menggambar pada canvas
let ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;    
    // Tambahkan kode gambar atau animasi Anda di sini
}

// Panggil resizeCanvas saat halaman dimuat ulang atau saat ukuran jendela berubah
window.addEventListener('resize', resizeCanvas);
// window.addEventListener('load', resizeCanvas);

// Pertama kali, panggil resizeCanvas untuk mengatur ukuran awal canvas
resizeCanvas();




// ctx.strokeStyle = "blue"; // Warna garis tepi
// ctx.lineWidth = 3; // Lebar garis tepi
// ctx.strokeRect(200, 50, 100, 100); // Koordinat x, y, lebar, tinggi

let drawPoligon = (points, fill) => {
	// Mulai menggambar
	ctx.beginPath();

	// Pindahkan ke titik awal
	ctx.moveTo(points[0].x, points[0].y);

	// Gambar garis-garis antara titik-titik sudut
	for (var i = 1; i < points.length; i++) {
	    ctx.lineTo(points[i].x, points[i].y);
	}

	// Tutup poligon dengan garis ke titik awal
	ctx.closePath();

	// Isi poligon dengan warna
	if(fill) {
		ctx.fillStyle = "blue";
		ctx.fill();
	}

	// Garis tepi poligon (opsional)
	ctx.strokeStyle = "red";
	ctx.lineWidth = 2;
	ctx.stroke();	

}


var points = [
    { x: 400, y: 350 },
    { x: 500, y: 350 },
    { x: 500, y: 550 },
    { x: 400, y: 550 }
];

drawPoligon(points, false)

// let translasi = (dx,dy) => {
//     for(let i = 0 ; i < 4 ; i++) {
//         points[i].x += dx;
//         points[i].y += dy;
//     }
//     drawPoligon(points, false);
// }

var startPosSquare = { x: 50, y: 100 }; // Posisi awal kotak
var endPosSquare = { x: 300, y: 100 }; // Posisi akhir kotak
var startPosCircle = { x: 450, y: 400 }; // Posisi awal kotak
var endPosCircle = { x: 300, y: 100 }; // Posisi akhir kotak
var duration = 1000; // Durasi animasi dalam milidetik (1 detik)

var startTimeSquare; // Waktu mulai animasi
var startTimeCircle; // Waktu mulai animasi

function drawSquare(x, y) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.fillRect(x, y, 50, 50);
    ctx.fillStyle = "blue";
    ctx.fill();
}

function drawCircle(x, y) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(x, y, 50, 0, Math.PI * 2); // Contoh lingkaran
      ctx.fillStyle = 'red';
      ctx.fill();
}

function animate(time) {
    if (!startTimeSquare) {
        startTimeSquare = time;
    }
    
    let elapsedTime = time - startTimeSquare;
    let progress = Math.min(elapsedTime / duration, 1); // Batasi nilai progress antara 0 dan 1
    
    let x = startPosSquare.x + (endPosSquare.x - startPosSquare.x) * progress;
    let y = startPosSquare.y + (endPosSquare.y - startPosSquare.y) * progress;

    drawSquare(x, y);

    if (progress < 1) {
        requestAnimationFrame(animate);
    }
}


function animate2(time) {
    if (!startTimeCircle) {
        startTimeCircle = time;
    }
    
    let elapsedTime = time - startTimeCircle;
    let progress = Math.min(elapsedTime / duration, 1); // Batasi nilai progress antara 0 dan 1
    
    let x = startPosCircle.x + (endPosCircle.x - startPosCircle.x) * progress;
    let y = startPosCircle.y + (endPosCircle.y - startPosCircle.y) * progress;

    drawCircle(x, y);

    if (progress < 1) {
        requestAnimationFrame(animate2);
    }
}


requestAnimationFrame(animate);
requestAnimationFrame(animate2);

