function drawButton() {
    ctx.fillStyle = "blue"; // Warna latar belakang tombol
    var buttonX = 100; // Koordinat x tombol
    var buttonY = 50; // Koordinat y tombol
    var buttonWidth = 200; // Lebar tombol
    var buttonHeight = 50; // Tinggi tombol
    
    // Gambar tombol
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    ctx.fillStyle = "white"; // Warna teks tombol
    
    let text = "Klik Saya";
    ctx.font = "30px Arial";
    
    // Hitung lebar dan tinggi teks
    var textWidth = ctx.measureText(text).width;
    var textHeight = 30; // Ukuran font

    // Hitung posisi x dan y teks agar berada di tengah tombol
    var textX = buttonX + (buttonWidth - textWidth) / 2;
    var textY = buttonY + (buttonHeight + textHeight) / 2;

    ctx.fillText(text, textX, textY); // Tampilkan teks di tengah tombol
}

drawButton();

function buttonClickHandler(event) {
    var mouseX = event.clientX - canvas.getBoundingClientRect().left;
    var mouseY = event.clientY - canvas.getBoundingClientRect().top;

    if (mouseX >= 100 && mouseX <= 300 && mouseY >= 50 && mouseY <= 150) {
        translasi(-100,-100);
        // Tambahkan tindakan lain yang ingin Anda lakukan saat tombol ditekan di sini
    }
}
canvas.addEventListener("click", buttonClickHandler);


