////////////////////////////////////////////////////////////////////////////
//
// Record
//
////////////////////////////////////////////////////////////////////////////

const bCopyCanvas = 1;
const bWritePNG = 0;

if (bCopyCanvas) {

	let canvas_draw = $('#canvas-draw-fancy');
	canvas_draw.width = 160;
	canvas_draw.height = 120;
	canvas_draw = $('canvas')[1].getContext('2d');

	draw_interval = setInterval(function () { // setInterval setTimeout

		// import the image from the video
		canvas_draw.drawImage(renderer.domElement, 0, 0, 320, 240);

		// export the image from the canvas
		const img = new Image();
		img.src = $("canvas")[2].toDataURL('image/png');
		img.width = 320;

		if (bWritePNG) {
			// set image data to php
			const ajax = new XMLHttpRequest();
			ajax.open("POST", 'makefile.php', false);
			ajax.setRequestHeader('Content-Type', 'application/upload');
			ajax.send(img.src);
		}

		// print screens on same page if necesary for test
		// document.body.appendChild(img);

	}, 80)


}
