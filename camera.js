var Camera = function(opts){
	var defaults = {
		container: $("<div id='camera-wrapper' />"),
		width: 640,
		height: 480,
		onInitError: $.noop,
		onInit: $.noop
	};
	
	var options = $.extend({}, defaults, opts);
	var supportsUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
	if (!supportsUserMedia) {
		options.initError("Device does not support user media");
		return;
	} 

	if (!navigator.getUserMedia && navigator.webkitGetUserMedia) {
		navigator.getUserMedia = navigator.webkitGetUserMedia;
	} 
	else if (!navigator.getUserMedia && navigator.mozGetUserMedia) {
		navigator.getUserMedia = navigator.mozGetUserMedia;
	} 
	else if (!navigator.getUserMedia && navigator.msGetUserMedia) {
		navigator.getUserMedia = navigator.msGetUserMedia;
	} 

	if (!window.URL && window.webkitURL) {
		window.URL = window.webkitURL;
	}

	var stream;
	var videoElement = document.createElement("video");
	var videoCanvas = document.createElement("canvas");
	var videoContext = videoCanvas.getContext('2d');
	var pictureCanvas = document.createElement("canvas");
	var pictureContext = pictureCanvas.getContext('2d');

	var updateCallback = function () {
		if (videoElement.paused || videoElement.ended) {
			return;
		}

		var w = videoCanvas.width,
			h = videoCanvas.height;
		$("#debug-width").html(w);
		$("#debug-height").html(h);
		videoContext.drawImage(videoElement, 0, 0);

		setTimeout(function() {
			updateCallback();
		}, 0);
	};

	var container = $(options.container);
	if (!container.closest('html').length) {
		$("body").append(container);
	}

	container.append($(videoCanvas));
	videoCanvas.width = options.width;
	videoCanvas.height = options.height;
	videoElement.autoplay = true;

	navigator.getUserMedia({video: true, audio: false}, function(sourceStream) {
		$(videoElement).attr("src", window.URL.createObjectURL(sourceStream));
		//options.onInit(sourceStream);
	}, function(e) {
		options.onInitError('No access to camera');
	});

	videoElement.addEventListener("play", function(){
		updateCallback();
	});

	this.takePicture = function(source, filter, callback) {
		if (!source) {
			return;
		}

		var h = $(source).css("height"),
			w = $(source).css("width");
		$(pictureCanvas).attr("width", w).attr("height", h);
		pictureContext.drawImage(source, 0, 0);

		if (filter) {
			filter(pictureContext, {x: -100, y: -100}, function() {
				var picUrl = pictureCanvas.toDataURL('image/png');		
				callback(picUrl);
			});
		} else {
			var picUrl = pictureCanvas.toDataURL('image/png');
			callback(picUrl);
		}
	};

	return this;
};