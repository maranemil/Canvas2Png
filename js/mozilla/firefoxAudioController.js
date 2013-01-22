	/////////////////////////////////////////////////////////////////////////////////////////////////
	//
	//	References:
	// 
	//	Mozilla Audio Data API - https://wiki.mozilla.org/Audio_Data_API
	//	Visualizing an audio spectrum - https://developer.mozilla.org/en/Visualizing_Audio_Spectrum
	//
	/////////////////////////////////////////////////////////////////////////////////////////////////
		
	var histoindex	= 0;
	var histomax	= 500;
	
	histobuffer_x	= new Array();
	histobuffer_y	= new Array();
	histobuffer_t	= new Array();

	for (a=0;a<histomax;a++) {
		histobuffer_t[a] = 0;
	}

	maxvalue = new Array();
	for (a=0;a<1024;a++) {
		maxvalue[a] = 0;
	}

	currentvalue = new Array();

      //var frameBufferSize = 4096;
	  var frameBufferSize = 2048;
      var bufferSize = frameBufferSize/2;
      
      var signal = new Float32Array(bufferSize);
      var peak = new Float32Array(bufferSize);
      
      var fft = new FFT(bufferSize, 44100);

      function loadedMetaData(event) {
        var audio = document.getElementById('input');
        audio.mozFrameBufferLength = frameBufferSize;
        audio.addEventListener("MozAudioAvailable", audioAvailable, false);
      }
     
		var canvas = document.getElementById('fft');
		var ctx = canvas.getContext('2d');

 
      function audioAvailable(event) {
        // deinterleave and mix down to mono
        signal = DSP.getChannel(DSP.MIX, event.frameBuffer);

        // perform forward transform
        fft.forward(signal);
        
        for ( var i = 0; i < bufferSize/8; i++ ) { // 8
          magnitude = fft.spectrum[i] * 8000; 					// multiply spectrum by a zoom value 8000
          currentvalue[i] = magnitude;

          if (magnitude > maxvalue[i]) {
          		maxvalue[i] = magnitude;
          		new_pos(canvas.width/29 ,canvas.height/29);
          		/*
				new_pos(canvas.width/2 + i*4 + 4,(canvas.height/2)+magnitude+20);
          		new_pos(canvas.width/2 - i*4 + 4,(canvas.height/2)-magnitude-20);
          		new_pos(canvas.width/2 - i*4 + 4,(canvas.height/2)+magnitude+20);
				*/
          } else {
          	if (maxvalue[i] > 20) {
          		maxvalue[i]--;
          	}
          }
        }
      }

	function new_pos(x,y) {

		x = Math.floor(x);
		y = Math.floor(y);
		
		histobuffer_t[histoindex] = 29;
		histobuffer_x[histoindex] = x;
		//histobuffer_y[histoindex++] = y;

		if (histoindex > histomax) {
			histoindex = 0;
		}
	}
	
	var spectrum_on = false;
	
	function visualizer() {
		for (h=0;h<histomax;h++) {
			if (histobuffer_t[h] > 0) {

				var size = histobuffer_t[h] * 12;
				animate(size);
				
				/*
				ctx.fillStyle = theme[ (histobuffer_t[h])] + (0.5 - (0.5 - histobuffer_t[h]/40))+')';
				ctx.beginPath();
				ctx.arc(histobuffer_x[h], histobuffer_y[h], size * .5, 0, Math.PI*2, true); 
				ctx.closePath();
				ctx.fill();
				*/
				//histobuffer_t[h] = histobuffer_t[h] - 1;
				//histobuffer_y[h] = histobuffer_y[h] - 3 + Math.random() * 6;
				//histobuffer_x[h] = histobuffer_x[h] - 3 + Math.random() * 6;
				
			}
		}

		//var AudioRand = Math.random()*68;
		t = setTimeout('visualizer()',50);
	}